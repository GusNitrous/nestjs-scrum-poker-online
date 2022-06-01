import { IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../user/constants/user-role';
import { IsLogin } from '../../../common/decorators/validation-decorators';

export class AuthInputDto {
    @IsLogin()
    userName: string;

    @IsOptional()
    @IsEnum(UserRole)
    role: UserRole = UserRole.USER;
}
