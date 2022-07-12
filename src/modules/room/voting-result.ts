import { Score } from './score';

export class VotingResult {
    public roundId: number;
    public avg: number;
    public max: number;
    public min: number;
    public scores: Score[];
    public createdAt: number = Date.now();

    constructor(roundId: number, scores: Score[]) {
        this.roundId = roundId;
        this.scores = scores;
        this.calc();
    }

    calc(): this {
        const scoreValues = this.scores
            .map((score) => score.getValue())
            .filter((val) => !isNaN(val));

        const sumValues = scoreValues.reduce((acc, val) => (acc += val), 0);
        const result = (sumValues / scoreValues.length) || 0;

        this.avg = result > 0.5 ? Math.round(result) : result;

        this.max = Math.max(...scoreValues);
        this.min = Math.min(...scoreValues);

        return this;
    }
}
