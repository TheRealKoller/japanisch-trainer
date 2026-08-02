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

// Strict rate-limit config for sensitive auth endpoints (brute-force / mass-registration protection)
const AUTH_RATE_LIMIT = {
  config: {
    rateLimit: {
      max: 10,
      timeWindow: "1 minute",
    },
  },
} as const;

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post<{ Body: Credentials }>("/register", { schema: credentialsSchema, ...AUTH_RATE_LIMIT }, async (request, reply) => {
    const email = request.body.email.toLowerCase();

    // Schema-maxLength zählt Zeichen, bcrypt schneidet aber bei 72 Bytes ab —
    // Multibyte-Passwörter (Umlaute, Emoji) hier explizit auf Bytes prüfen.
    if (Buffer.byteLength(request.body.password, "utf8") > 72) {
      return reply.code(400).send({ message: "Passwort zu lang (max. 72 Bytes)" });
    }

    const passwordHash = await bcrypt.hash(request.body.password, 12);
    // Kein SELECT-then-INSERT (Race bei gleichzeitiger Registrierung) —
    // der Unique-Constraint entscheidet atomar.
    const inserted = await db
      .insert(users)
      .values({ email, passwordHash })
      .onConflictDoNothing({ target: users.email })
      .returning({ id: users.id });
    if (inserted.length === 0) {
      return reply.code(409).send({ message: "E-Mail ist bereits registriert" });
    }

    const token = app.jwt.sign({ sub: inserted[0].id, email });
    reply.setCookie(AUTH_COOKIE, token, authCookieOptions);
    return reply.code(201).send({ email });
  });

  app.post<{ Body: Credentials }>("/login", { schema: credentialsSchema, ...AUTH_RATE_LIMIT }, async (request, reply) => {
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
