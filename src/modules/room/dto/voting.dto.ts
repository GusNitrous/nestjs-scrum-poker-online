import { VotingStatus } from '../constants/voting-status';
import { UserDto } from './user.dto';
import { Room } from '../persistence/room.entity';


export class VotingDto {
    static fromRoom(room: Room): VotingDto {
        const voting = room.voting;
        const votingStatus = voting?.status ?? VotingStatus.Waiting;
        const users = room.getUsers().map((user) => {
            return UserDto.fromUser(user).addScore(voting?.findScoreByUserId(user.id));
        });

        return new VotingDto(votingStatus, users);
    }

    constructor(
        public status: VotingStatus,
        public users: UserDto[],
    ) {
    }
}
