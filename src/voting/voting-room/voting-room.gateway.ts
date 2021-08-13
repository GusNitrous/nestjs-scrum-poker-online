import { Logger, UseGuards } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from "@nestjs/websockets";
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
    create(@WsCurrentUser() currentUser: User, @MessageBody() payload: any, @ConnectedSocket() socket: Socket): void {
        this.logger.debug(`REQUEST_ON_CREATING_ROOM => ${JSON.stringify(payload)}`);

        console.log("current_user", currentUser);

        const roomId = currentUser.id;

        // if (socket.rooms.has(roomId)) {
        //     this.logger.debug(`CREATING_ERROR => ${roomId}`);

        //     socket.send("creating-error", "Room already exists");
        //     return;
        // }

        socket.join(roomId);

        this.server.to(socket.id).emit(ROOM_CREATED, roomId);
        // socket.to(roomId).emit("room-created", `CreatedRoom => ${roomId}`);
    }

    @SubscribeMessage(JOIN_ROOM)
    join(@MessageBody() payload: any, @ConnectedSocket() socket: Socket): void {
        socket.join(payload.roomId);
        socket.to(payload.roomId).emit("room-join", { userId: payload.userId });
    }

    @SubscribeMessage(DELETE_ROOM)
    delete(@MessageBody() payload: any, @ConnectedSocket() socket: Socket): void {}
}
