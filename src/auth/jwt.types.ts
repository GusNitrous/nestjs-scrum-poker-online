import { JwtPayload } from "jsonwebtoken";

export type JwtUserPayload = { id: string } & JwtPayload;
