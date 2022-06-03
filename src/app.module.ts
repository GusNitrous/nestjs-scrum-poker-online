import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { VotingModule } from './modules/voting/voting.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ROOT_DIR } from './config';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(ROOT_DIR, 'client'),
        }),
        EventEmitterModule.forRoot({ global: true }),
        AuthModule,
        UserModule,
        VotingModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
