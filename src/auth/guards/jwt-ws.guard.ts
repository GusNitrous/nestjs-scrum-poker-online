import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';
import { VerifyErrors } from 'jsonwebtoken';
import { User, UserId } from '../../user/persistence/user.entity';
import { UserService } from '../../user/user.service';
import { JwtUserPayload } from '../jwt.types';
import { WsClient } from '../../common/ws/ws-types';

@Injectable()
export class JwtWsGuard implements CanActivate {
    private readonly logger = new Logger(JwtWsGuard.name);

    constructor(private readonly config: ConfigService, private readonly userService: UserService) {
    }

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const wsClient = ctx.switchToWs().getClient<WsClient>();
        try {
            const jwtSecret = this.config.get<string>('JWT_SECRET');
            const payload = await this.verifyClient(wsClient, jwtSecret);
            wsClient.data.currentUser = await this.getUserById(payload.id);
        } catch (err) {
            this.logger.error(err?.message || 'WsClient verification error');
            throw new WsException(new UnauthorizedException());
        }
        return true;
    }

    private async getUserById(id: UserId): Promise<User> {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new WsException(new NotFoundException('User not found'));
        }
        return user;
    }

    private verifyClient(wsClient: WsClient, secret: string): Promise<JwtUserPayload> {
        const { auth } = wsClient.handshake;
        return new Promise((resolve, reject) => {
            jwt.verify(auth?.token, secret, (err: VerifyErrors, decoded: JwtUserPayload) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    }
}
