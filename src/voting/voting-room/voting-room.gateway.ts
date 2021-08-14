import { Logger, UseGuards } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WsException } from "@nestjs/websockets";
import { WebSocketServer } from "@nestjs/websockets";
import { ConnectedSocket } from "@nestjs/websockets";
import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { JwtWsGuard } from "src/auth/guards/jwt-ws.guard";
import { WsCurrentUser } from "src/common/web-socket/ws.decorators";
import { User } from "src/user/persistence/user.entity";
import { UserService } from "src/user/user.service";
import { CREATE_ROOM, DELETE_ROOM, JOIN_ROOM, ROOM_CREATED } from "./events";

// Room Gateway
@WebSocketGateway({
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
})
export class VotingRoomGateway {
    private readonly logger = new Logger(VotingRoomGateway.name);

    @WebSocketServer()
    private readonly server: Server;

    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtWsGuard)
    @SubscribeMessage(CREATE_ROOM)
    create(@WsCurrentUser() currentUser: User, @ConnectedSocket() socket: Socket): void {
        this.logger.debug(`REQUEST_ON_CREATING_ROOM => ${JSON.stringify(currentUser)}`);
        const roomId = currentUser.id;

        if (socket.rooms.has(roomId)) {
            this.logger.debug(`CREATING_ERROR => ${roomId}`);
            throw new WsException("Room already exists");
        }

        socket.join(roomId);
        this.server.to(socket.id).emit(ROOM_CREATED, roomId);
    }

    @UseGuards(JwtWsGuard)
    @SubscribeMessage(JOIN_ROOM)
    join(@WsCurrentUser() currentUser: User, @ConnectedSocket() socket: Socket, @MessageBody() payload: any): void {
        const rooms = this.server.of("/").adapter.rooms;
        if (!rooms || !rooms.has(payload.roomId)) {
            throw new WsException("Room not found");
        }

        socket.join(payload.roomId);
        this.server.to(socket.id).emit("JOINED_TO_ROOM", payload.roomId);
        socket.to(payload.roomId).emit("USER_JOINED", { userId: currentUser.id });
    }

    @SubscribeMessage(DELETE_ROOM)
    delete(@MessageBody() payload: any, @ConnectedSocket() socket: Socket): void {}
}
