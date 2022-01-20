import { User } from '../../user/persistence/user.entity';
import { customAlphabet } from 'nanoid';
import { VotingRound } from '../voting-round';
import { VotingResult } from '../voting-result';
import { Logger } from '@nestjs/common';
import { Score } from '../score';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);

export type RoomUID = string;

// Room data entity
export class Room {
    private readonly logger = new Logger(Room.name);

    public owner: User;

    public id: RoomUID = nanoid();

    public users = new Set<User>();

    public createdAt = new Date();

    public lastActivity = new Date();

    public results = new Set<VotingResult>();

    private voting: VotingRound = null;

    constructor(owner: User) {
        this.owner = owner;
        this.addUser(owner);
    }

    get hasActiveVoting(): boolean {
        return this.voting?.isActive;
    }

    getActiveVoting(): VotingRound {
        if (!this.hasActiveVoting) {
            throw new Error('Active voting not found');
        }
        return this.voting;
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

    startVoting(): void {
        this.logger.debug(`ROOM_START_VOTING => ${this.id}`);

        this.updateLastActivity();
        this.voting = new VotingRound(this);

        this.logger.debug(`ROOM_AFTER_START_VOTING => ${JSON.stringify([...this.users])}`);
    }

    stopVoting(): VotingResult {
        this.logger.debug(`ROOM_STOP_VOTING => ${this.id}`);

        this.updateLastActivity();
        const result = this.voting.getResult();
        this.results.add(result);
        this.voting = null;

        this.logger.debug(`ROOM_AFTER_STOP_VOTING => ${JSON.stringify(this)}`);

        return result;
    }

    addScore(user: User, scoreValue: number): Score {
        const score = new Score(user.id, scoreValue);
        this.voting.addScore(score);
        return score;
    }
}
