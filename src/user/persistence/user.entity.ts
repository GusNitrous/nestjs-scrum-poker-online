import { UserRole } from '../constants/user-role';
import { randomUUID } from 'crypto';

export type UserId = string;

export class User {
    public static from(data: Partial<User>): User {
        return new User().populate(data);
    }

    public name: string;

    public role: UserRole;

    public createdAt: Date = new Date();

    public updatedAt: Date;

    private readonly _id: UserId = randomUUID();

    get id(): string {
        return this._id;
    }

    populate(data: Partial<User>): this {
        this.name = data.name;
        this.role = data.role;
        this.updatedAt = new Date();
        return this;
    }
}
