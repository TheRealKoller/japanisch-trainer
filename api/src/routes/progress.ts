import type { FastifyInstance } from "fastify";
import { eq, sql } from "drizzle-orm";
import { db } from "../db/client.js";
import { progress } from "../db/schema.js";
import { verifyAuth } from "../auth.js";

// Muss mit API_KEYS in src/utils/progressSync.ts synchron gehalten werden.
const ALLOWED_KEYS = new Set(["item-stats", "quiz-stats", "kana-level-hiragana", "kana-level-katakana"]);

export async function progressRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", verifyAuth);

  app.get("/", async (request) => {
    const rows = await db
      .select({ key: progress.key, value: progress.value })
      .from(progress)
      .where(eq(progress.userId, request.user.sub));
    return Object.fromEntries(rows.map((row) => [row.key, row.value]));
  });

  app.put<{ Params: { key: string }; Body: { value: unknown } }>(
    "/:key",
    {
      schema: {
        body: {
          type: "object",
          required: ["value"],
          properties: { value: {} },
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const { key } = request.params;
      if (!ALLOWED_KEYS.has(key)) {
        return reply.code(400).send({ message: "Unbekannter Progress-Key" });
      }

      await db
        .insert(progress)
        .values({ userId: request.user.sub, key, value: request.body.value })
        .onConflictDoUpdate({
          target: [progress.userId, progress.key],
          set: { value: request.body.value, updatedAt: sql`now()` },
        });
      return reply.code(204).send();
    },
  );
}
