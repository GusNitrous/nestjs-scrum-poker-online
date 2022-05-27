import { Module } from '@nestjs/common';
import { RoomRepository } from './persistence/room.repository';
import { RoomService } from './room.service';
import { RoomGateway } from './room.gateway';
import { UserModule } from '../user/user.module';

@Module({
    imports: [UserModule],
    providers: [RoomRepository, RoomService, RoomGateway],
    exports: [RoomService],
})
export class RoomModule {
}
