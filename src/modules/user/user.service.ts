import { Injectable } from '@nestjs/common';
import { User, UserId } from './persistence/user.entity';
import { UserRepository } from './persistence/user.repository';

@Injectable()
export class UserService {
    constructor(private readonly repository: UserRepository) {
    }

    async create(data: Partial<User>): Promise<User> {
        return this.repository.save(User.from(data));
    }

    async findByName(userName: string): Promise<User> {
        return this.repository.findByUserName(userName);
    }

    async findById(userId: UserId): Promise<User> {
        return this.repository.findById(userId);
    }

    async remove(user: User): Promise<void> {
        this.repository.remove(user);
    }
}
