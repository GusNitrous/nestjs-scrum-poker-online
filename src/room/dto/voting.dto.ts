import { VotingStatus } from '../constants/voting-status';
import { UserDto } from './user.dto';
import { Room } from '../persistence/room.entity';


export class VotingDto {
    static fromRoom(room: Room): VotingDto {
        const voting = room.getActiveVoting();
        const users = room.getUsers();
        return new VotingDto(
            voting.status,
            users.map((user) =>
                UserDto.fromUser(user)
                    .addScore(voting.findScoreByUserId(user.id)),
            ),
        );
    }

    constructor(
        public status: VotingStatus,
        public users: UserDto[],
    ) {
    }
}
