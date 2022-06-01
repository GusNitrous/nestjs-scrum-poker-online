import { Logger, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { JwtWsGuard } from '../auth/guards/jwt-ws.guard';
import {
    CREATE_ROOM,
    JOIN_USER,
    LEAVE_ROOM,
    ROOM_CREATED,
    USER_JOINED,
    USER_JOINED_TO_ROOM,
    USER_LEAVE,
} from './ws-events';
import { WsCurrentUser } from '../../common/ws/ws-param-decorators';
import { User } from '../user/persistence/user.entity';
import { Server, Socket } from 'socket.io';
import { RoomDto } from './dto/room.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { AuthEvent } from '../../common/app-events/auth-event';

@WebSocketGateway({
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})
@UseGuards(JwtWsGuard)
export class RoomGateway {
    private readonly logger = new Logger(RoomGateway.name);

    @WebSocketServer()
    private readonly server: Server;

    constructor(
        private readonly roomService: RoomService,
    ) {
    }

    @SubscribeMessage(CREATE_ROOM)
    async create(@WsCurrentUser() currentUser: User, @ConnectedSocket() socket: Socket): Promise<void> {
        this.logger.debug('REQUEST_ON_CREATING_ROOM => ' + currentUser);
        const room = (await this.roomService
            .createByOwner(currentUser))
            .addUser(currentUser)
            .startVoting();

        socket.join(room.id);
        this.server.to(socket.id).emit(ROOM_CREATED, room.id);
    }

    @SubscribeMessage(JOIN_USER)
    async join(
        @WsCurrentUser() currentUser: User,
        @ConnectedSocket() socket: Socket,
        @MessageBody('roomId') roomId: string,
    ): Promise<void> {
        this.logger.debug(`REQUEST_ON_JOIN_USER => ${roomId}`);
        const room = (await this.roomService.findById(roomId)).addUser(currentUser);
        const roomDto = RoomDto.from(room);

        socket.join(roomId);
        socket.to(roomId).emit(USER_JOINED_TO_ROOM, roomDto);
        this.server.to(socket.id).emit(USER_JOINED, roomDto);
    }

    @SubscribeMessage(LEAVE_ROOM)
    async leave(
        @WsCurrentUser() currentUser: User,
        @ConnectedSocket() socket: Socket,
        @MessageBody('roomId') roomId: string,
    ): Promise<void> {
        this.logger.debug(`REQUEST_ON_LEAVE_FROM_ROOM => ${roomId}`);
        await this.roomService.removeUserFromRooms(currentUser);
        socket.leave(roomId);
        this.server.emit(USER_LEAVE, currentUser.id);
    }

    @OnEvent(AuthEvent.LOGOUT)
    async userLeave(user: User): Promise<void> {
        this.logger.debug(`${USER_LEAVE} => ` + user);
        await this.roomService.removeUserFromRooms(user);
        this.server.emit(USER_LEAVE, user.id);
    }

    private hasServerRoom(roomId: string): boolean {
        return this.getRooms()?.has(roomId);
    }

    private getRooms(namespace = '/'): Map<any, Set<string>> {
        return this.server.of(namespace).adapter.rooms;
    }
}
