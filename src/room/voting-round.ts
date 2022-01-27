import { Score } from './score';
import { Room } from './persistence/room.entity';
import { VotingStatus } from './constants/voting-status';
import { VotingResult } from './voting-result';
import { UserId } from '../user/persistence/user.entity';

export class VotingRound {
    public status: VotingStatus = VotingStatus.Waiting;
    public room: Room;
    private _scores = new Set<Score>();

    constructor(room: Room) {
        this.room = room;
        this.start();
    }

    get scores(): Score[] {
        return [...this._scores];
    }

    get isActive(): boolean {
        return this.status === VotingStatus.Active;
    }

    get isFinished(): boolean {
        return this.status === VotingStatus.Finished;
    }

    start(): this {
        this.room.updateLastActivity();
        this.status = VotingStatus.Active;
        return this;
    }

    stop(): this {
        this.room.updateLastActivity();
        this.status = VotingStatus.Finished;
        return this;
    }

    addScore(userId: UserId, scoreValue: number): Score {
        this.room.updateLastActivity();
        const score = new Score(userId, scoreValue);
        this._scores.add(score);
        return score;
    }

    getResult(): any {
        this.room.updateLastActivity();
        if (!this.isFinished || this._scores.size === 0) {
            throw new Error('Round is not finished or has empty scores');
        }
        return new VotingResult(this._scores);
    }
}
