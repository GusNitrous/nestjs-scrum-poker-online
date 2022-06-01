import { User } from '../../user/persistence/user.entity';
import { VotingRound } from '../voting-round';
import { VotingResult } from '../voting-result';
import { Logger } from '@nestjs/common';
import { uuid } from '../../../common/utils/uuid';


export type RoomId = string;

// Room data entity
export class Room {
    private readonly logger = new Logger(Room.name);

    public owner: User;

    public id: RoomId = uuid();

    public createdAt = new Date();

    public lastActivity = new Date();

    public results = new Set<VotingResult>();

    public voting: VotingRound = null;

    private _users = new Set<User>();

    private _votingCounter: number = 0;

    constructor(owner: User) {
        this.owner = owner;
    }

    get hasActiveVoting(): boolean {
        return this.voting?.isActive;
    }

    getUsers(): User[] {
        return [...this._users];
    }

    getResults(): VotingResult[] {
        return [...this.results];
    }

    getActiveVoting(): VotingRound {
        this.updateLastActivity();
        if (!this.hasActiveVoting) {
            throw new Error('Room has no active voting');
        }
        return this.voting;
    }

    addUser(user: User): this {
        this.updateLastActivity();
        this._users.add(user);
        return this;
    }

    removeUser(user: User): this {
        this.updateLastActivity();
        this._users.delete(user);
        return this;
    }

    startVoting(): this {
        this.logger.debug('ROOM_START_VOTING => ' + this);
        this.voting = new VotingRound(this);
        this.logger.debug('ROOM_AFTER_START_VOTING => ' + this);
        return this;
    }

    finishVoting(): VotingResult {
        const result = this.getActiveVoting()?.getResult();
        this.voting = null;
        this.results.add(result);
        return result;
    }

    updateLastActivity(): this {
        this.lastActivity = new Date();
        return this;
    }

    incVotingCounter(): number {
        return ++this._votingCounter;
    }

    toPlain(): Record<string, any> {
        return {
            [this.constructor.name]: {
                id: this.id,
                users: this.getUsers().map((user) => user.toPlain()),
                createdAt: this.createdAt,
            },
        };
    }

    toString(): string {
        return JSON.stringify(this.toPlain());
    }
}
