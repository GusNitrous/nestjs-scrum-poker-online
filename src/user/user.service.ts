import { Injectable } from "@nestjs/common";
import { UserEntity } from "./persistense/user.entity";
import { UserRepository } from "./persistense/user.repository";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    create(data: Partial<UserEntity>): UserEntity {
        return this.userRepository.save(UserEntity.from(data));
    }
}
