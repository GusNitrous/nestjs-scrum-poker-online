import { Injectable, Logger } from '@nestjs/common';
import { Room, RoomId } from './room.entity';
import { User } from '../../user/persistence/user.entity';

@Injectable()
export class RoomRepository {
    private readonly logger = new Logger(RoomRepository.name);

    private readonly storage = new Set<Room>();

    save(room: Room): Room {
        this.logger.debug('SAVE_ROOM => ' + room);
        this.storage.add(room);
        return room;
    }

    findById(id: RoomId): Room {
        for (const entity of this.storage.values()) {
            if (entity.id === id) {
                return entity;
            }
        }
    }

    remove(room: Room): void {
        this.logger.debug('REMOVE_ROOM => ' + room);
        this.storage.delete(room);
    }

    async removeUserFromRooms(user: User): Promise<void> {
        this.storage.forEach((room) => {
            room.removeUser(user);
        });
    }
}
