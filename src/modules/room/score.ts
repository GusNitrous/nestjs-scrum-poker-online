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

    toPlain(): Record<string, any> {
        return {
            [this.constructor.name]: {
                constructor: Score.name,
                userId: this.userId,
                originalValue: this.value,
                value: this.getValue(),
            },
        };
    }

    toString(): string {
        return JSON.stringify(this.toPlain());
    }
}
