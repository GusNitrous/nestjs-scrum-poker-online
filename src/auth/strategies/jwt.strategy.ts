import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/user/persistence/user.entity";

@Injectable()
export class Jwt2Strategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        super({
            secretOrKey: config.get<string>("JWT_SECRET"),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
        });
    }

    validate({ id }: Pick<User, "id">): string {
        return id;
    }
}
