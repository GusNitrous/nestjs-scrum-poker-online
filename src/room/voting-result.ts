import { Score } from './score';

export class VotingResult {
    public avg: number;
    public max: number;
    public min: number;
    public scores: Set<Score>;

    constructor(scores: Set<Score>) {
        this.scores = scores;
    }
}
