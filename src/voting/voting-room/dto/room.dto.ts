import { Room } from '../../../room/persistence/room.entity';
import { VotingDto } from './voting.dto';

export class RoomDto {
    static from(room: Room): RoomDto {
        return new RoomDto(
            room.id,
            room.owner.id,
            room.createdAt,
            VotingDto.fromRoom(room),
        );
    }

    constructor(
        public id: string,
        public ownerId: string,
        public createdAt: Date,
        public voting: VotingDto,
    ) {
    }
}
