import { Injectable } from "@nestjs/common";
import { UserEntity } from "./user.entity";

@Injectable()
export class UserRepository {
    private readonly storage: Map<any, UserEntity>;

    constructor() {
        this.storage = new Map();
    }

    save(data: UserEntity): UserEntity {
        this.storage.set(data.id, data);
        return data;
    }

    getById(id: string): UserEntity {
        return this.storage.get(id);
    }

    remove(id: string): void {
        this.storage.delete(id);
    }
}
