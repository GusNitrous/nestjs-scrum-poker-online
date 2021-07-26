import { UserRole } from "../constants/user-role";
import { v4 as uuidv4 } from "uuid";

export class UserEntity {
    public static from(data: Partial<UserEntity>): UserEntity {
        const newUser = new UserEntity();
        newUser.name = data.name;
        newUser.role = data.role;
        newUser.createdAt = new Date();
        return newUser;
    }

    public name: string;

    public role: UserRole;

    public createdAt: Date;

    public updatedAt: Date;

    private readonly _id: string = uuidv4();

    get id(): string {
        return this._id;
    }

    pupulate(data: Partial<UserEntity>): this {
        this.name = data.name;
        this.role = data.role;
        this.updatedAt = new Date();
        return this;
    }
}
