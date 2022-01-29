import { Score } from './score';

export class VotingResult {
    public avg: number;
    public max: number;
    public min: number;
    public scores: Score[];

    constructor(scores: Score[]) {
        this.scores = scores;
        this.calc();
    }

    calc(): this {
        const scoreValues = this.scores
            .map((score) => score.getValue())
            .filter((val) => !isNaN(val));
        const sumValues = scoreValues.reduce((acc, val) => (acc += val), 0);
        this.avg = sumValues && Math.ceil(sumValues / scoreValues.length);
        this.max = Math.max(...scoreValues);
        this.min = Math.min(...scoreValues);
        return this;
    }
}
