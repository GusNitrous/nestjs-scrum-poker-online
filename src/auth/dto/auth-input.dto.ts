import { IsEnum, IsOptional, IsString } from "class-validator";
import { UserRole } from "src/user/constants/user-role";

export class AuthInputDto {
    @IsString()
    userName: string;

    @IsOptional()
    @IsEnum(UserRole)
    role: UserRole = UserRole.USER;
}
