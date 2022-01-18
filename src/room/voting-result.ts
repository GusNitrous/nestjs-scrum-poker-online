export class VotingResult {
    constructor(
       public avg: number,
       public max: number,
       public min: number,
       public byScores: number[][],
    ) {}
}
