import { Logger } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { User, UserId } from "./user.entity";

@Injectable()
export class UserRepository {
    private readonly logger = new Logger(UserRepository.name);

    private readonly storage: Set<User> = new Set();

    save(entity: User): User {
        this.logger.debug(`SAVE_USER => ${JSON.stringify(entity)}`);
        this.storage.add(entity);
        this.logger.debug(`USER_STORAGE_AFTER_SAVE => ${JSON.stringify([...this.storage])}`);

        return entity;
    }

    findById(id: UserId): User | undefined {
        for (const entity of this.storage.values()) {
            if (entity.id === id) {
                return entity;
            }
        }
    }

    remove(entity: User): void {
        this.storage.delete(entity);
        this.logger.debug(`USER_STORAGE_AFTER_REMOVE => ${JSON.stringify([...this.storage])}`);
    }
}
