import { Module } from "@nestjs/common";
import { UserRepository } from "./persistence/user.repository";
import { UserService } from "./user.service";

@Module({
    providers: [UserService, UserRepository],
    exports: [UserService],
})
export class UserModule {}
