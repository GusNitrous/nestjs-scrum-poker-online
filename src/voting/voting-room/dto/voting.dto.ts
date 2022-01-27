import { VotingStatus } from '../../../room/constants/voting-status';
import { UserDto } from './user.dto';
import { Room } from '../../../room/persistence/room.entity';

export class VotingDto {
    static fromRoom({ voting, users }: Room): VotingDto {
        return new VotingDto(
            voting?.status,
            users.map((user) =>
                UserDto.fromUser(user)
                    .addScore(voting?.findScoreByUserId(user.id)),
            ),
        );
    }

    constructor(
        public status: VotingStatus,
        public users: UserDto[],
    ) {
    }
}
