import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Logger,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthInputDto } from './dto/auth-input.dto';
import { AuthOutputDto } from './dto/auth-output.dto';
import { JwtHttpGuard } from './guards/jwt-http.guard';
import { CurrentUser } from '../common/http/htpp-param-decorators';
import { User } from '../user/persistence/user.entity';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService, private readonly userService: UserService) {
    }

    // Temporary: registering and sign in
    @Post('/register')
    @UsePipes(
        new ValidationPipe({
            skipUndefinedProperties: false,
        }),
    )
    async register(@Body() dto: AuthInputDto): Promise<AuthOutputDto> {
        this.logger.debug(`REGISTRATION => ${dto.userName}`);
        const user = await this.userService.findByName(dto.userName);
        if (user) {
            throw new BadRequestException('User exists');
        }
        return this.authService.register(dto);
    }

    @UseGuards(JwtHttpGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('/logout')
    async logout(@CurrentUser() user: User): Promise<void> {
        this.logger.debug(`LOGOUT => ${user.id}`);
        await this.authService.logout(user);
    }
}
