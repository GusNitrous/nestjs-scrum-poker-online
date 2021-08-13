import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
    const corsOptions = {
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
    };

    const app = await NestFactory.create(AppModule, { cors: corsOptions });
    const config = app.get(ConfigService);
    await app.listen(config.get<number>("APP_LISTEN_PORT"));
}
bootstrap();
