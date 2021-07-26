import { Injectable } from "@nestjs/common";
import { UserEntity } from "./user.entity";

@Injectable()
export class UserRepository {
    private readonly storage: Set<UserEntity> = new Set();

    save(entity: UserEntity): UserEntity {
        this.storage.add(entity);
        return entity;
    }

    findById(id: string): UserEntity {
        for (const entity of this.storage.values()) {
            if (entity.id === id) {
                return entity;
            }
        }
        return null;
    }

    remove(entity: UserEntity): void {
        this.storage.delete(entity);
    }
}
