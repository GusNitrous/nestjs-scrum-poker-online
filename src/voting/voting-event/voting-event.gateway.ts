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
    DISPATCH_RESULTS,
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
        private readonly roomService: RoomService,
    ) {
    }

    @UseGuards(JwtWsGuard)
    @SubscribeMessage(VOTING_START)
    async start(
        @WsCurrentUser() currentUser: User,
        @ConnectedSocket() socket: Socket,
        @MessageBody() { roomId, restart }: any,
    ): Promise<void> {
        this.logger.debug(`${VOTING_START} => ${roomId}`);

        const room = await this.roomService.getById(roomId);
        if (room.hasActiveVoting && !restart) {
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
        this.logger.debug(`${VOTING_FINISH} => ${roomId}`);

        const voting = await this.roomService.getVotingByRoomId(roomId);
        voting.stop();
        this.server.to(roomId).emit(VOTING_FINISHED);
    }

    @UseGuards(JwtWsGuard)
    @SubscribeMessage(SEND_SCORE)
    async sendScore(
        @WsCurrentUser() currentUser: User,
        @ConnectedSocket() socket: Socket,
        @MessageBody() { roomId, score }: { roomId: string, score: number },
    ): Promise<void> {
        this.logger.debug(`${SEND_SCORE} => ROOM: ${roomId} SCORE: ${score}`);

        const voting = await this.roomService.getVotingByRoomId(roomId);
        const userScore = voting.addScore(currentUser.id, score);
        this.server.to(roomId).emit(SCORE_DISPATCH, userScore);
    }

    @UseGuards(JwtWsGuard)
    @SubscribeMessage(SHOW_RESULTS)
    async showResults(
        @WsCurrentUser() currentUser: User,
        @ConnectedSocket() socket: Socket,
        @MessageBody('roomId') roomId: string,
    ): Promise<void> {
        this.logger.debug(`${SHOW_RESULTS} => ${roomId}`);

        const voting = await this.roomService.getVotingByRoomId(roomId);
        const result = voting.getResult();
        this.server.to(roomId).emit(DISPATCH_RESULTS, result);
    }
}
