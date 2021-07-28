import { Body, Controller, Logger, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthInputDto } from "./dto/auth-input.dto";
import { AuthOutputDto } from "./dto/auth-output.dto";

@Controller("auth")
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) {}

    // Temporary: registerging and sign in
    @Post("/register")
    @UsePipes(
        new ValidationPipe({
            skipUndefinedProperties: false,
        })
    )
    async register(@Body() dto: AuthInputDto): Promise<AuthOutputDto> {
        this.logger.debug(`REGISTRATION => ${dto.userName}`);
        return this.authService.register(dto);
    }

    @Post("/logout")
    logout(): any {
        return "logout";
    }
}
