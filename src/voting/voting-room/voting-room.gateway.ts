import { Logger, UseGuards } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtWsGuard } from 'src/auth/guards/jwt-ws.guard';
import { User } from 'src/user/persistence/user.entity';
import { UserService } from 'src/user/user.service';
import {
    CREATE_ROOM,
    DELETE_ROOM,
    JOIN_USER,
    RECEIVE_MESSAGE,
    ROOM_CREATED,
    SEND_MESSAGE,
    USER_JOINED,
    USER_JOINED_TO_ROOM,
} from './events';
import { WsCurrentUser } from '../../common/ws/ws-param-decorators';

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

    constructor(private readonly userService: UserService) {
    }

    @UseGuards(JwtWsGuard)
    @SubscribeMessage(SEND_MESSAGE)
    sendMessage(@ConnectedSocket() socket: Socket, @MessageBody() payload: any): void {
        this.logger.debug(`REQUEST_ON_SEND_MESSAGE_TO_ROOM => ${JSON.stringify(payload)}`);

        const rooms = this.getAllRooms();
        const roomId = payload.roomId;
        if (!rooms || !rooms.has(roomId)) {
            this.logger.debug(`SEND_MESSAGE_TO_ROOM_ERROR => ${roomId}`);
            throw new WsException('Room not found');
        }
        socket.to(roomId).emit(RECEIVE_MESSAGE, payload.message);
    }

    @UseGuards(JwtWsGuard)
    @SubscribeMessage(CREATE_ROOM)
    create(@WsCurrentUser() currentUser: User, @ConnectedSocket() socket: Socket): void {
        this.logger.debug(`REQUEST_ON_CREATING_ROOM => ${JSON.stringify(currentUser)}`);

        const rooms = this.server.of('/').adapter.rooms;

        const roomId = currentUser.id;
        // if (!rooms || rooms.has(roomId)) {
        //     this.logger.debug(`CREATING_ERROR => ${roomId}`);
        //     throw new WsException("Room already exists");
        // }
        socket.join(roomId);
        this.server.to(socket.id).emit(ROOM_CREATED, roomId);
    }

    @UseGuards(JwtWsGuard)
    @SubscribeMessage(JOIN_USER)
    join(@WsCurrentUser() currentUser: User, @ConnectedSocket() socket: Socket, @MessageBody() payload: any): void {
        this.logger.debug(`REQUEST_ON_JOIN_USER => ${JSON.stringify(payload)}`);

        const rooms = this.getAllRooms();

        console.log('payload', payload);
        console.log(rooms);

        if (!rooms || !rooms.has(payload?.roomId)) {
            this.logger.debug('Room not found');
            throw new WsException('Room not found');
        }

        socket.join(payload.roomId);
        this.server.to(socket.id).emit(USER_JOINED, payload.roomId);
        socket.to(payload.roomId).emit(USER_JOINED_TO_ROOM, currentUser.id);
    }

    @SubscribeMessage(DELETE_ROOM)
    delete(@MessageBody() payload: any, @ConnectedSocket() socket: Socket): void {
    }

    private getAllRooms(namespace = '/'): Map<any, Set<string>> {
        return this.server.of(namespace).adapter.rooms;
    }
}
