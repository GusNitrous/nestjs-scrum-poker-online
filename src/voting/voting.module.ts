import { Module } from "@nestjs/common";
import { VotingController } from "./voting.controller";
import { VotingService } from "./voting.service";
import { VotingRoomGateway } from "./voting-room/voting-room.gateway";
import { VotingEventGateway } from "./voting-event/voting-event.gateway";
import { UserModule } from "src/user/user.module";

@Module({
    imports: [UserModule],
    controllers: [VotingController],
    providers: [VotingService, VotingRoomGateway, VotingEventGateway],
})
export class VotingModule {}
