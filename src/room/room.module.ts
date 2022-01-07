import { Module } from '@nestjs/common';
import { RoomRepository } from './persistence/room.repository';
import { RoomService } from './room.service';

@Module({
    providers: [RoomRepository, RoomService],
    exports: [RoomService],
})
export class RoomModule {
}
