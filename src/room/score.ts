import { UserId } from '../user/persistence/user.entity';

export class Score {
    constructor(
        public userId: UserId,
        public value: string,
    ) {
    }
}
