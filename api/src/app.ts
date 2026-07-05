import Fastify, { type FastifyInstance } from "fastify";
import cookie from "@fastify/cookie";
import jwt from "@fastify/jwt";
import { AUTH_COOKIE } from "./auth.js";
import { authRoutes } from "./routes/auth.js";
import { progressRoutes } from "./routes/progress.js";

export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: true });

  if (!process.env.JWT_SECRET) {
    app.log.warn("JWT_SECRET nicht gesetzt — unsicherer Dev-Default aktiv. Für den Betrieb JWT_SECRET setzen!");
  }

  app.register(cookie);
  app.register(jwt, {
    secret: process.env.JWT_SECRET ?? "dev-secret-change-me",
    cookie: { cookieName: AUTH_COOKIE, signed: false },
    sign: { expiresIn: "30d" },
  });

  app.register(authRoutes, { prefix: "/api/auth" });
  app.register(progressRoutes, { prefix: "/api/progress" });

  app.get("/api/health", async () => ({ ok: true }));

  return app;
}
