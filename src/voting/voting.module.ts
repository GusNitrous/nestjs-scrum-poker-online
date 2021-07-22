import { Module } from "@nestjs/common";
import { VotingController } from "./voting.controller";
import { VotingService } from "./voting.service";

@Module({
    controllers: [VotingController],
    providers: [VotingService],
})
export class VotingModule {}
