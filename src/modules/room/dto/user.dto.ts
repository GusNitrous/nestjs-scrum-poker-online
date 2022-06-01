import { UserRole } from '../../user/constants/user-role';
import { User } from '../../user/persistence/user.entity';
import { Score } from '../score';

export class UserDto {
    static fromUser(user: User): UserDto {
        return new UserDto(
            user.id,
            user.name,
            user.role,
            user.createdAt,
            user.updatedAt,
        );
    }

    constructor(
        public id: string,
        public name: string,
        public role: UserRole,
        public createdAt: Date,
        public updatedAt: Date,
        public score?: string,
    ) {
    }

    addScore(score?: Score): this {
        this.score = score?.value;
        return this;
    }
}
