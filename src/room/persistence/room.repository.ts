import { Injectable, Logger } from '@nestjs/common';
import { Room, RoomId } from './room.entity';
import { User } from '../../user/persistence/user.entity';

@Injectable()
export class RoomRepository {
    private readonly logger = new Logger(RoomRepository.name);

    private readonly storage = new Set<Room>();

    save(entity: Room): Room {
        this.logger.debug(`SAVE_ROOM => ${entity.toJson()}`);
        this.storage.add(entity);
        return entity;
    }

    findById(id: RoomId): Room {
        for (const entity of this.storage.values()) {
            if (entity.id === id) {
                return entity;
            }
        }
    }

    remove(entity: Room): void {
        this.logger.debug(`REMOVE_ROOM => ${entity.id}`);
        this.storage.delete(entity);
    }

    async removeUserFromRooms(user: User): Promise<void> {
        this.storage.forEach((room) => {
            room.removeUser(user);
        });
    }
}
