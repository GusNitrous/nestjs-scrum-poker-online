import { User, UserId } from '../../user/persistence/user.entity';
import {customAlphabet} from 'nanoid';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);

export type RoomUID = string;

// Room data entity
export class Room {
    public static from(data: Partial<Room>): Room {
        return new Room().populate(data);
    }

    public uid: RoomUID = nanoid();

    public ownerId: UserId;

    public users = new Set<User>();

    public createdAt: Date = new Date();

    public get id(): string {
        return this.uid;
    }

    public populate(data: Partial<Room>): this {
        this.uid = data?.uid;
        this.ownerId = data?.ownerId;
        return this;
    }

    addUser(user: User): this {
        this.users.add(user);
        return this;
    }

    removeUser(user: User): this {
        this.users.delete(user);
        return this;
    }

    setOwnerId(id: UserId): this {
        this.ownerId = id;
        return this;
    }
}
