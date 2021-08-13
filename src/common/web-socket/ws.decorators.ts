import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { WsClient } from "./ws.types";

/**
 * WebSocket current user param decorator.
 * Extracts a object of current user from data property of the Socket client.
 */
export const WsCurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const wsClient = ctx.switchToWs().getClient<WsClient>();
    return wsClient.data?.currentUser;
});
