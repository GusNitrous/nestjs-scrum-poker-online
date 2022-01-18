import { Score } from './score';
import { VotingStatus } from './constants/voting-status';
import { VotingResult } from './voting-result';
import { Room } from './persistence/room.entity';

export class VotingRound {
    public status: VotingStatus = VotingStatus.Waiting;
    public scores = new Set<Score>();
    public room: Room;

    constructor(room: Room) {
        this.room = room;
        this.status = VotingStatus.Active;
    }

    get isActive(): boolean {
        return this.status === VotingStatus.Active;
    }

    addScore(score: Score): this {
        this.room.updateLastActivity();
        this.scores.add(score);
        return this;
    }

    getResult(): any {
        return new VotingResult(0, 0, 0, [[0, 0]]);
    }
}
