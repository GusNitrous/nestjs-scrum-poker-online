import { UserId } from '../user/persistence/user.entity';

export class Score {
    constructor(
        public userId: UserId,
        public value: string,
    ) {
    }

    getValue(): number {
        return Number(this.value);
    }

    setValue(value: string): this {
        this.value = value;
        return this;
    }
}
