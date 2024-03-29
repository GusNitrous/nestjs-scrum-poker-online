import { Score } from './score';
import { Room } from './persistence/room.entity';
import { VotingStatus } from './constants/voting-status';
import { VotingResult } from './voting-result';
import { UserId } from '../user/persistence/user.entity';


export class VotingRound {
    public id: number;
    public status: VotingStatus = VotingStatus.Waiting;
    public room: Room;
    private _scores = new Set<Score>();

    constructor(room: Room) {
        this.id = room.incVotingCounter();
        this.room = room;
        this.start();
    }

    getScores(): Score[] {
        return [...this._scores];
    }

    get isActive(): boolean {
        return this.status === VotingStatus.Active;
    }

    get isFinished(): boolean {
        return this.status === VotingStatus.Finished;
    }

    start(): void {
        this.room.updateLastActivity();
        this.status = VotingStatus.Active;
    }

    stop(): this {
        this.status = VotingStatus.Finished;
        return this;
    }

    findScoreByUserId(userId: UserId): Score {
        for (const score of this._scores) {
            if (score.userId === userId) {
                return score;
            }
        }
    }

    addScore(userId: UserId, value: string): Score {
        this.room.updateLastActivity();
        const score = this.findScoreByUserId(userId);
        const userScore = score?.setValue(value) ?? new Score(userId, value);
        this._scores.add(userScore);
        return userScore;
    }

    getResult(): VotingResult {
        this.room.updateLastActivity();
        if (this._scores.size === 0) {
            throw new Error('Round is not finished or has empty scores');
        }
        return new VotingResult(this.id, this.getScores());
    }

    toPlain(): Record<string, any> {
        return {
            [this.constructor.name]: {
                status: this.status,
                room: this.room.id,
                scores: this.getScores().map((score) => score.toString()),
            },
        };
    }

    toString(): string {
        return JSON.stringify(this.toPlain());
    }
}
