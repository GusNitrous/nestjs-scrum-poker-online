import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { VotingModule } from "./voting/voting.module";

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, UserModule, VotingModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
