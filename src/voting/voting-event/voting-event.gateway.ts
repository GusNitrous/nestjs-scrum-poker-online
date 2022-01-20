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
import { RoomService } from '../../room/room.service';
import {
    SCORE_DISPATCH,
    SEND_SCORE,
    SHOW_RESULTS,
    VOTING_FINISH,
    VOTING_FINISHED,
    VOTING_START,
    VOTING_STARTED,
} from './events';
import { JwtWsGuard } from '../../auth/guards/jwt-ws.guard';
import { WsCurrentUser } from '../../common/ws/ws-param-decorators';
import { User } from '../../user/persistence/user.entity';


// Voting Gateway
@WebSocketGateway({
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})
export class VotingEventGateway {
    private readonly logger = new Logger(VotingEventGateway.name);

    @WebSocketServer()
    server: Server;

    constructor(
        private readonly roomStateService: RoomService,
    ) {
    }

    @UseGuards(JwtWsGuard)
    @SubscribeMessage(VOTING_START)
    async start(
        @WsCurrentUser() currentUser: User,
        @ConnectedSocket() socket: Socket,
        @MessageBody('roomId') roomId: string,
    ): Promise<void> {
        const room = await this.roomStateService.findById(roomId);
        if (!room) {
            throw new WsException('Room not found');
        }
        if (room.hasActiveVoting) {
            throw new WsException('Room already has active voting');
        }
        room.startVoting();
        this.server.to(roomId).emit(VOTING_STARTED, new Date());
    }

    @UseGuards(JwtWsGuard)
    @SubscribeMessage(VOTING_FINISH)
    async stop(
        @WsCurrentUser() currentUser: User,
        @ConnectedSocket() socket: Socket,
        @MessageBody('roomId') roomId: string,
    ): Promise<void> {
        const room = await this.roomStateService.findById(roomId);
        if (!room) {
            throw new WsException('Room not found');
        }
        const result = room.stopVoting();
        this.server.to(roomId).emit(VOTING_FINISHED, result);
    }

    @UseGuards(JwtWsGuard)
    @SubscribeMessage(SEND_SCORE)
    async sendScore(
        @WsCurrentUser() currentUser: User,
        @ConnectedSocket() socket: Socket,
        @MessageBody() { roomId, score }: { roomId: string, score: number },
    ): Promise<void> {
        const room = await this.roomStateService.findById(roomId);
        if (!room) {
            throw new WsException('Room not found');
        }
        if (!room.hasActiveVoting) {
            throw new WsException('Room has no active voting');
        }
        const userScore = room.addScore(currentUser, score);
        this.server.to(roomId).emit(SCORE_DISPATCH, userScore);
    }

    @UseGuards(JwtWsGuard)
    @SubscribeMessage(SHOW_RESULTS)
    async showResults(
        @WsCurrentUser() currentUser: User,
        @ConnectedSocket() socket: Socket,
        @MessageBody('roomId') roomId: string,
    ): Promise<void> {

    }
}
