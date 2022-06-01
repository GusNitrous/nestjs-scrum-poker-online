import { UserRole } from "src/modules/user/constants/user-role";
import { User } from "src/modules/user/persistence/user.entity";

export class AuthOutputDto {
    static fromUser(data: Partial<User>): AuthOutputDto {
        const authData = new AuthOutputDto();
        authData.userId = data.id;
        authData.userName = data.name;
        authData.role = data.role;
        return authData;
    }

    public userId: string;
    public userName: string;
    public role: UserRole;
    public jwtToken: string;

    addJwt({ token }: { token: string }): this {
        this.jwtToken = token;
        return this;
    }
}
