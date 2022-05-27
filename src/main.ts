import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

const { appName, appPort, appHost, appVersion } = config;

(async () => {
    const corsOptions = {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    };

    const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: corsOptions });
    await app.listen(appPort, appHost);

    Logger.verbose(`[ApplicationServer] ${appName} successfully started (v${appVersion}): ${config.baseUrl}`);
})().catch((err) => {
    Logger.error(`[ApplicationServer] ${appName} failed: ` + err);
});
