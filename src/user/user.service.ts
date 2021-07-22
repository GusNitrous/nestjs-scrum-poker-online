import { Injectable } from "@nestjs/common";
import { UserEntity } from "./persistense/user.entity";
import { UserRepository } from "./persistense/user.repository";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    create(data: any): UserEntity {
        const user = new UserEntity();
        return this.userRepository.save(user);
    }
}
