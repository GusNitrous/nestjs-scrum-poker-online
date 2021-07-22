import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // Temporary: registerging and sign in
    @Post("/register")
    register(dto: AuthDto): any {
        return this.authService.register(dto);
    }

    @Post("/logout")
    logout(): any {
        return "logout";
    }
}
