import { UserRole } from '../constants/user-role';
import { uuid } from '../../../common/utils/uuid';

export type UserId = string;

export class User {
    public static from(data: Partial<User>): User {
        return new User().populate(data);
    }

    public name: string;

    public role: UserRole;

    public createdAt: Date = new Date();

    public updatedAt: Date;

    private readonly _id: UserId = uuid(13);

    get id(): string {
        return this._id;
    }

    populate(data: Partial<User>): this {
        this.name = data.name;
        this.role = data.role;
        this.updatedAt = new Date();
        return this;
    }

    toPlain(): Record<string, any> {
        return {
            [this.constructor.name]: {
                id: this.id,
                name: this.name,
                role: this.role,
                createdAt: this.createdAt,
                updatedAt: this.updatedAt,
            },
        };
    }

    toString(): string {
        return JSON.stringify(this.toPlain());
    }
}
