import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}

    register(dto): any {
        return this.userService.create(dto);
    }
}
