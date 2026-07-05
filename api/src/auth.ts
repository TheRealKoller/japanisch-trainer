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

export async function verifyAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch {
    // reply zurückgeben, damit Fastify den Handler sicher nicht mehr ausführt
    return reply.code(401).send({ message: "Nicht angemeldet" });
  }
}

export const AUTH_COOKIE = "token";

export const authCookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  // Opt-in statt Default: secure-Cookies würden Login über LAN-HTTP
  // (z.B. http://192.168.x.x:8080) brechen. Hinter TLS: COOKIE_SECURE=true setzen.
  secure: process.env.COOKIE_SECURE === "true",
  path: "/",
  maxAge: 30 * 24 * 60 * 60,
} as const;
