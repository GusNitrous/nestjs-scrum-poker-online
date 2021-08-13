import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { AuthInputDto } from "./dto/auth-input.dto";
import { AuthOutputDto } from "./dto/auth-output.dto";

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

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
}
