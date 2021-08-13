import { Injectable } from "@nestjs/common";
import { User, UserId } from "./persistence/user.entity";
import { UserRepository } from "./persistence/user.repository";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    create(data: Partial<User>): Promise<User> {
        return Promise.resolve(this.userRepository.save(User.from(data)));
    }

    findById(userId: UserId): Promise<User> {
        return Promise.resolve(this.userRepository.findById(userId));
    }
}
