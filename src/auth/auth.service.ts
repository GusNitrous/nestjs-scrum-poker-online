import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthInputDto } from './dto/auth-input.dto';
import { AuthOutputDto } from './dto/auth-output.dto';
import { RoomService } from '../room/room.service';
import { User } from '../user/persistence/user.entity';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly roomService: RoomService,
    ) {
    }

    async register(dto: AuthInputDto): Promise<AuthOutputDto> {
        const newUser = await this.userService.create({
            name: dto.userName,
            role: dto.role,
        });
        return AuthOutputDto.fromUser(newUser).addJwt({
            token: await this.login(newUser.id),
        });
    }

    login(userId: string): Promise<string> {
        return this.jwtService.signAsync({ id: userId });
    }

    async logout(user: User): Promise<void> {
        this.logger.debug(`REMOVE_USER_AFTER_LOGOUT => ${user.id}`);
        await this.userService.remove(user);
        await this.roomService.removeUserFromRooms(user);
    }
}
