import { Logger } from "@nestjs/common";
import { OnGatewayConnection } from "@nestjs/websockets";
import { OnGatewayDisconnect } from "@nestjs/websockets";
import { WebSocketServer } from "@nestjs/websockets";
import { OnGatewayInit } from "@nestjs/websockets";
import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
})
export class VotingEventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(VotingEventGateway.name);

    @WebSocketServer()
    server: Server;

    afterInit(server: Server) {
        // console.log("afterInit", server);
    }

    handleConnection(socket: Socket) {
        console.log("handleConnection_VotingEventGateway", socket.rooms);
    }

    handleDisconnect(socket: Socket) {
        // console.log("handleDisconnect", socket);
    }

    @SubscribeMessage("start")
    start(client: any, payload: any): string {
        return "voting start";
    }

    @SubscribeMessage("stop")
    stop(client: any, payload: any): string {
        return "voting stop";
    }

    @SubscribeMessage("estimate")
    estimate(client: any, payload: any): string {
        return "estimate";
    }

    @SubscribeMessage("showResult")
    showResult(client: any, payload: any): string {
        return "show result";
    }

    @SubscribeMessage("clearEstimate")
    clearEstimate(client: any, payload: any): string {
        return "clear estimate";
    }
}
