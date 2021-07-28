import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";

export const getJwtConfig = async (config: ConfigService): Promise<JwtModuleOptions> => {
    return {
        secret: config.get<string>("JWT_SECRET"),
    };
};
