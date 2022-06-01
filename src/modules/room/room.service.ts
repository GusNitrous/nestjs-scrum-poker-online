import { Injectable, Logger } from '@nestjs/common';
import { RoomRepository } from './persistence/room.repository';
import { Room, RoomId } from './persistence/room.entity';
import { User } from '../user/persistence/user.entity';
import { VotingRound } from './voting-round';
import { VotingResult } from './voting-result';

@Injectable()
export class RoomService {
    private readonly logger = new Logger(RoomService.name);

    constructor(
        private readonly repository: RoomRepository,
    ) {
    }

    async createByOwner(owner: User): Promise<Room> {
        return this.repository.save(new Room(owner));
    }

    async findById(id: RoomId): Promise<Room> {
        const room = this.repository.findById(id);
        if (!room) {
            const error = new Error('Room not found');
            this.logger.error(error.message);
            throw error;
        }
        return room;
    }

    async getVotingByRoomId(roomId: RoomId): Promise<VotingRound> {
        return (await this.findById(roomId)).getActiveVoting();
    }

    async finishVoting(roomId: RoomId): Promise<VotingResult> {
        const room = await this.findById(roomId);
        return room.finishVoting();
    }

    async removeById(id: RoomId): Promise<void> {
        const room = this.repository.findById(id);
        if (room) {
            this.repository.remove(room);
        }
    }

    async remove(entity?: Room): Promise<void> {
        if (entity) {
            this.repository.remove(entity);
        }
    }

    async removeUserFromRooms(user: User): Promise<void> {
        await this.repository.removeUserFromRooms(user);
    }
}
