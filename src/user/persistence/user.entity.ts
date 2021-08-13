import { UserRole } from "../constants/user-role";
import { v4 as uuidv4 } from "uuid";

export type UserId = string;

export class User {
    public static from(data: Partial<User>): User {
        const newUser = new User();
        newUser.name = data.name;
        newUser.role = data.role;
        newUser.createdAt = new Date();
        return newUser;
    }

    public name: string;

    public role: UserRole;

    public createdAt: Date;

    public updatedAt: Date;

    public createdRoomIds: Set<string>;

    public socketIds: Set<string>;

    private readonly _id: UserId = uuidv4();

    constructor() {
        this.createdAt = new Date();
        this.createdRoomIds = new Set();
        this.socketIds = new Set();
    }

    get id(): string {
        return this._id;
    }

    pupulate(data: Partial<User>): this {
        this.name = data.name;
        this.role = data.role;
        this.updatedAt = new Date();
        return this;
    }
}
