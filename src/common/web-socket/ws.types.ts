// WebSocket Client
export type WsClient = {
    Client: Record<any, any>;
    Server: Record<any, any>;
    data?: Record<any, any>;
    handshake: { auth: { token?: string } };
};
