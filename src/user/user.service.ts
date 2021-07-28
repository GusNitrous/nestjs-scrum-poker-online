import { Injectable } from "@nestjs/common";
import { UserEntity } from "./persistence/user.entity";
import { UserRepository } from "./persistence/user.repository";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    create(data: Partial<UserEntity>): Promise<UserEntity> {
        return Promise.resolve(this.userRepository.save(UserEntity.from(data)));
    }
}
