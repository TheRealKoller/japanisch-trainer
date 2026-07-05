import type { FastifyReply, FastifyRequest } from "fastify";

export interface JwtPayload {
  sub: number;
  email: string;
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}

export async function verifyAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    await request.jwtVerify();
  } catch {
    reply.code(401).send({ message: "Nicht angemeldet" });
  }
}

export const AUTH_COOKIE = "token";

export const authCookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  path: "/",
  maxAge: 30 * 24 * 60 * 60,
} as const;
