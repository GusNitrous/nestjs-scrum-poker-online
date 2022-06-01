import { Module } from '@nestjs/common';
import { VotingGateway } from './voting.gateway';
import { UserModule } from 'src/modules/user/user.module';
import { RoomModule } from '../room/room.module';

@Module({
    imports: [UserModule, RoomModule],
    providers: [VotingGateway],
})
export class VotingModule {
}
