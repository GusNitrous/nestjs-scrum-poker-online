import { Injectable, Logger } from '@nestjs/common';
import { Room, RoomId } from './room.entity';

@Injectable()
export class RoomRepository {
    private readonly logger = new Logger(RoomRepository.name);

    private readonly storage = new Set<Room>();

    save(entity: Room): Room {
        this.logger.debug(`SAVE_ROOM => ${entity.toJson()}`);
        this.storage.add(entity);
        this.logger.debug(`ROOM_STORAGE_AFTER_SAVE => ${JSON.stringify([...this.storage])}`);
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
        this.logger.debug(`ROOM_STORAGE_AFTER_REMOVE => ${JSON.stringify([...this.storage])}`);
    }

}
