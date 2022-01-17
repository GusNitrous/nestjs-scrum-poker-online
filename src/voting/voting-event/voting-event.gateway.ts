import { Logger, UseGuards } from '@nestjs/common';
import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from '../../room/room.service';
import { SEND_SCORE, SHOW_RESULTS, VOTING_START, VOTING_STOP } from './events';
import { JwtWsGuard } from '../../auth/guards/jwt-ws.guard';
import { WsCurrentUser } from '../../common/ws/ws-param-decorators';
import { User } from '../../user/persistence/user.entity';


// Voting Gateway
@WebSocketGateway({
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
})
export class VotingEventGateway {
    private readonly logger = new Logger(VotingEventGateway.name);

    @WebSocketServer()
    server: Server;

    constructor(
        private readonly roomStateService: RoomService,
    ) {}


    @UseGuards(JwtWsGuard)
    @SubscribeMessage(VOTING_START)
    async start(@WsCurrentUser() currentUser: User, @ConnectedSocket() socket: Socket): Promise<void> {

    }

    @UseGuards(JwtWsGuard)
    @SubscribeMessage(VOTING_STOP)
    async stop(@WsCurrentUser() currentUser: User, @ConnectedSocket() socket: Socket): Promise<void> {

    }

    @UseGuards(JwtWsGuard)
    @SubscribeMessage(SEND_SCORE)
    async sendScore(@WsCurrentUser() currentUser: User, @ConnectedSocket() socket: Socket): Promise<void> {

    }

    @UseGuards(JwtWsGuard)
    @SubscribeMessage(SHOW_RESULTS)
    async showResults(@WsCurrentUser() currentUser: User, @ConnectedSocket() socket: Socket): Promise<void> {

    }
}
