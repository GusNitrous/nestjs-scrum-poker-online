import { Logger, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtWsGuard } from '../../auth/guards/jwt-ws.guard';
import { User } from '../../user/persistence/user.entity';
import { UserService } from '../../user/user.service';
import {
    CREATE_ROOM,
    JOIN_USER,
    LEAVE_ROOM,
    ROOM_CREATED,
    USER_JOINED,
    USER_JOINED_TO_ROOM,
    USER_LEAVE,
} from './events';
import { WsCurrentUser } from '../../common/ws/ws-param-decorators';
import { RoomService } from '../../room/room.service';
import { RoomDto } from './dto/room.dto';
import { OnEvent } from '@nestjs/event-emitter';

// Room Gateway
@WebSocketGateway({
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})
export class VotingRoomGateway {
    private readonly logger = new Logger(VotingRoomGateway.name);

    @WebSocketServer()
    private readonly server: Server;

    constructor(
        private readonly userService: UserService,
        private readonly roomStateService: RoomService,
    ) {
    }

    @UseGuards(JwtWsGuard)
    @SubscribeMessage(CREATE_ROOM)
    async create(@WsCurrentUser() currentUser: User, @ConnectedSocket() socket: Socket): Promise<void> {
        this.logger.debug('REQUEST_ON_CREATING_ROOM => ' + currentUser);
        const roomState = await this.roomStateService.createByOwner(currentUser);
        roomState.addUser(currentUser).startVoting();
        socket.join(roomState.id);
        this.server.to(socket.id).emit(ROOM_CREATED, roomState.id);
    }

    @UseGuards(JwtWsGuard)
    @SubscribeMessage(JOIN_USER)
    async join(
        @WsCurrentUser() currentUser: User,
        @ConnectedSocket() socket: Socket,
        @MessageBody('roomId') roomId: string,
    ): Promise<void> {
        this.logger.debug(`REQUEST_ON_JOIN_USER => ${roomId}`);
        const roomState = await this.roomStateService.getById(roomId);
        const roomDto = RoomDto.from(roomState.addUser(currentUser));

        socket.join(roomId);
        socket.to(roomId).emit(USER_JOINED_TO_ROOM, roomDto);
        this.server.to(socket.id).emit(USER_JOINED, roomDto);
    }

    @UseGuards(JwtWsGuard)
    @SubscribeMessage(LEAVE_ROOM)
    async leave(
        @WsCurrentUser() currentUser: User,
        @ConnectedSocket() socket: Socket,
        @MessageBody('roomId') roomId: string,
    ): Promise<void> {
        this.logger.debug(`REQUEST_ON_LEAVE_FROM_ROOM => ${roomId}`);
        await this.roomStateService.removeUserFromRooms(currentUser);
        socket.leave(roomId);
        this.server.emit(USER_LEAVE, currentUser.id);
    }

    @OnEvent('user.logout')
    async userLeave(user: User): Promise<void> {
        this.logger.debug(`${USER_LEAVE} => ` + user);
        await this.roomStateService.removeUserFromRooms(user);
        this.server.emit(USER_LEAVE, user.id);
    }

    private hasServerRoom(roomId: string): boolean {
        return this.getRooms()?.has(roomId);
    }

    private getRooms(namespace = '/'): Map<any, Set<string>> {
        return this.server.of(namespace).adapter.rooms;
    }
}
