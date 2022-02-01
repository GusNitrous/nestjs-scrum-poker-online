import { VotingResult } from '../../../room/voting-result';

export class ResultDto {
    static fromResult(result: VotingResult): ResultDto {
        return new ResultDto(
            result.roundId,
            result.avg,
            result.max,
            result.min,
        );
    }

    constructor(
        public roundId: number,
        public avg: number,
        public max: number,
        public min: number,
    ) {
    }
}
