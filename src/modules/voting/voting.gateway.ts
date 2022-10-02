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
import { RoomService } from '../room/room.service';
import {
    DISPATCH_RESULTS,
    SCORE_DISPATCH,
    SEND_SCORE,
    SHOW_RESULTS,
    VOTING_FINISH,
    VOTING_FINISHED,
    VOTING_START,
    VOTING_STARTED,
} from './ws-events';
import { JwtWsGuard } from '../auth/guards/jwt-ws.guard';
import { WsCurrentUser } from '../../common/ws/ws-param-decorators';
import { User } from '../user/persistence/user.entity';
import { RoomDto } from '../room/dto/room.dto';


@WebSocketGateway({
    transports: ['websocket'],
    cors: {
        origin: '*',
        methods: ['*'],
    },
})
@UseGuards(JwtWsGuard)
export class VotingGateway {
    private readonly logger = new Logger(VotingGateway.name);

    @WebSocketServer()
    server: Server;

    constructor(
        private readonly roomService: RoomService,
    ) {
    }

    @SubscribeMessage(VOTING_START)
    async start(
        @WsCurrentUser() currentUser: User,
        @ConnectedSocket() socket: Socket,
        @MessageBody() { roomId }: any,
    ): Promise<void> {
        this.logger.debug(`${VOTING_START} => ${roomId}`);
        const room = await this.roomService.findById(roomId);
        room.startVoting();
        this.server.in(roomId).emit(VOTING_STARTED, RoomDto.from(room));
    }

    @SubscribeMessage(VOTING_FINISH)
    async stop(
        @WsCurrentUser() currentUser: User,
        @ConnectedSocket() socket: Socket,
        @MessageBody('roomId') roomId: string,
    ): Promise<void> {
        this.logger.debug(`${VOTING_FINISH} => ${roomId}`);

        const voting = await this.roomService.getVotingByRoomId(roomId);
        voting.stop();
        socket.to(roomId).emit(VOTING_FINISHED);
    }

    @SubscribeMessage(SEND_SCORE)
    async sendScore(
        @WsCurrentUser() currentUser: User,
        @ConnectedSocket() socket: Socket,
        @MessageBody() { roomId, score }: { roomId: string, score: string },
    ): Promise<void> {
        this.logger.debug(`${SEND_SCORE} => ROOM: ${roomId} SCORE: ${score}`);

        const voting = await this.roomService.getVotingByRoomId(roomId);
        const userScore = voting.addScore(currentUser.id, score);
        this.server.in(roomId).emit(SCORE_DISPATCH, userScore);
    }

    // TODO change event name
    @SubscribeMessage(SHOW_RESULTS)
    async finishVoting(
        @WsCurrentUser() currentUser: User,
        @ConnectedSocket() socket: Socket,
        @MessageBody('roomId') roomId: string,
    ): Promise<void> {
        try {
            const result = await this.roomService.finishVoting(roomId);
            this.server.in(roomId).emit(DISPATCH_RESULTS, result);
        } catch (err) {
            this.logger.debug(`${DISPATCH_RESULTS}_ERROR => ${err.message}`);
            throw new WsException(err.message);
        }
    }
}
