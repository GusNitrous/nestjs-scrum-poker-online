import { Room } from '../../../room/persistence/room.entity';
import { User } from '../../../user/persistence/user.entity';

export class RoomDto {
    static from(room: Room): RoomDto {
        const dto = new RoomDto();
        dto.uid = room.id;
        dto.ownerId = room.owner.id;
        dto.users = [...room.users];
        dto.createdAt = room.createdAt;
        return dto;
    }

    public uid: string;

    public ownerId: string;

    public users: User[];

    public createdAt: Date;
}
