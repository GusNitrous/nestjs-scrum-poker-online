import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config';
import { Logger } from '@nestjs/common';


(async () => {
    const corsOptions = {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    };

    const app = await NestFactory.create(AppModule, { cors: corsOptions });
    await app.listen(config.appPort, config.appHost);

    Logger.verbose(`[SERVER_STARTED] ${config.baseUrl}`);
})().catch((err) => {
    Logger.error('[SERVER_STARTING_FAILED] ' + err);
});
