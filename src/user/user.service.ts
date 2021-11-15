import { Injectable } from '@nestjs/common';
import { User, UserId } from './persistence/user.entity';
import { UserRepository } from './persistence/user.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {
    }

    async create(data: Partial<User>): Promise<User> {
        return this.userRepository.save(User.from(data));
    }

    async findByUserName(userName: string): Promise<User> {
        return this.userRepository.findByUserName(userName);
    }

    async findById(userId: UserId): Promise<User> {
        return this.userRepository.findById(userId);
    }

    async remove(user: User): Promise<void> {
        this.userRepository.remove(user);
    }
}
