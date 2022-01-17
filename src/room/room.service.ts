import { Injectable } from '@nestjs/common';
import { RoomRepository } from './persistence/room.repository';
import { Room, RoomUID } from './persistence/room.entity';
import { User } from '../user/persistence/user.entity';

@Injectable()
export class RoomService {
    constructor(private readonly repository: RoomRepository) {
    }

    async createByOwner(owner: User): Promise<Room> {
        return this.repository.save(new Room(owner));
    }

    async findByUID(uid: RoomUID): Promise<Room> {
        return this.repository.findByUID(uid);
    }

    async removeByUID(uid: RoomUID): Promise<void> {
        const room = this.repository.findByUID(uid);
        if (room) {
            this.repository.remove(room);
        }
    }

    async remove(entity?: Room): Promise<void> {
        if (entity) {
            this.repository.remove(entity);
        }
    }
}
