import { User } from '../../user/persistence/user.entity';
import { customAlphabet } from 'nanoid';
import { RoomState } from '../room-state';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);

export type RoomUID = string;

// Room data entity
export class Room {
    public owner: User;

    public id: RoomUID = nanoid();

    public users = new Set<User>();

    public createdAt = new Date();

    public lastActivity = new Date();

    public state = new RoomState();

    constructor(owner: User) {
        this.owner = owner;
        this.addUser(owner);
    }

    addUser(user: User): this {
        this.users.add(user);
        return this;
    }

    removeUser(user: User): this {
        this.users.delete(user);
        return this;
    }

    updateLastActivity(): this {
        this.lastActivity = new Date();
        return this;
    }
}
