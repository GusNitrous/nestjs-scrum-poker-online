import { Room } from '../../../room/persistence/room.entity';
import { VotingDto } from './voting.dto';
import { ResultDto } from './result.dto';

export class RoomDto {
    static from(room: Room): RoomDto {
        const results = room.getResults()
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((result) => ResultDto.fromResult(result));
        return new RoomDto(
            room.id,
            room.owner.id,
            room.createdAt,
            VotingDto.fromRoom(room),
            results,
        );
    }

    constructor(
        public id: string,
        public ownerId: string,
        public createdAt: Date,
        public voting: VotingDto,
        public results: ResultDto[],
    ) {
    }
}
