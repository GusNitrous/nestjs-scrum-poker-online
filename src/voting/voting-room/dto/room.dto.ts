import { Room } from '../../../room/persistence/room.entity';
import { VotingDto } from './voting.dto';
import { ResultDto } from './result.dto';

export class RoomDto {
    static from(room: Room): RoomDto {
        return new RoomDto(
            room.id,
            room.owner.id,
            room.createdAt,
            VotingDto.fromRoom(room),
            room.getResults().map((result) => ResultDto.fromResult(result)),
        );
    }

    constructor(
        public id: string,
        public ownerId: string,
        public createdAt: Date,
        public voting: VotingDto,
        public latestResults: ResultDto[],
    ) {
    }
}
