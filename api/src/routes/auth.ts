import type { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { users } from "../db/schema.js";
import { AUTH_COOKIE, authCookieOptions, verifyAuth } from "../auth.js";

const credentialsSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email", maxLength: 255 },
      // bcrypt schneidet bei 72 Bytes ab — längere Passwörter ablehnen
      password: { type: "string", minLength: 8, maxLength: 72 },
    },
    additionalProperties: false,
  },
} as const;

interface Credentials {
  email: string;
  password: string;
}

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post<{ Body: Credentials }>("/register", { schema: credentialsSchema }, async (request, reply) => {
    const email = request.body.email.toLowerCase();

    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      return reply.code(409).send({ message: "E-Mail ist bereits registriert" });
    }

    const passwordHash = await bcrypt.hash(request.body.password, 12);
    const [user] = await db.insert(users).values({ email, passwordHash }).returning({ id: users.id });

    const token = app.jwt.sign({ sub: user.id, email });
    reply.setCookie(AUTH_COOKIE, token, authCookieOptions);
    return reply.code(201).send({ email });
  });

  app.post<{ Body: Credentials }>("/login", { schema: credentialsSchema }, async (request, reply) => {
    const email = request.body.email.toLowerCase();

    const [user] = await db.select().from(users).where(eq(users.email, email));
    // gleiche Fehlermeldung für unbekannte E-Mail und falsches Passwort (kein User-Enumeration)
    if (!user || !(await bcrypt.compare(request.body.password, user.passwordHash))) {
      return reply.code(401).send({ message: "Ungültige Anmeldedaten" });
    }

    const token = app.jwt.sign({ sub: user.id, email });
    reply.setCookie(AUTH_COOKIE, token, authCookieOptions);
    return reply.send({ email });
  });

  app.post("/logout", async (_request, reply) => {
    reply.clearCookie(AUTH_COOKIE, { path: "/" });
    return reply.send({ ok: true });
  });

  app.get("/me", { preHandler: [verifyAuth] }, async (request) => {
    return { email: request.user.email };
  });
}
