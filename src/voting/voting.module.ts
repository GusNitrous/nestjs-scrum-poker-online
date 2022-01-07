import { Module } from '@nestjs/common';
import { VotingRoomGateway } from './voting-room/voting-room.gateway';
import { VotingEventGateway } from './voting-event/voting-event.gateway';
import { UserModule } from 'src/user/user.module';
import { RoomModule } from '../room/room.module';

@Module({
    imports: [UserModule, RoomModule],
    providers: [VotingRoomGateway, VotingEventGateway],
})
export class VotingModule {
}
