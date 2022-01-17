import { VotingState } from './constants/voting-state';
import { Score } from './score';

export class RoomState {
    public votingState: VotingState = VotingState.Waiting;
    public scores = new Set<Score>();

    calcResult(): any {
        return {};
    }

    addScore(score: Score): this {
        this.scores.add(score);
        return this;
    }
}
