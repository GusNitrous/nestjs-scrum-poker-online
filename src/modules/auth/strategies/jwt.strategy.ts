import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User, UserId } from 'src/modules/user/persistence/user.entity';
import { UserService } from '../../user/user.service';
import config from '../../../config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({
            secretOrKey: config.jwtSecret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
        });
    }

    validate({ id }: Pick<User, 'id'>): Promise<User> {
        return this.getUserById(id);
    }

    private async getUserById(id: UserId): Promise<User> {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }
}
