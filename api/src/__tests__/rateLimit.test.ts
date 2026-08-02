import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildApp } from "../app.js";

// Mock bcrypt so hashing is instant in tests
vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("$2b$12$mocked-hash"),
    compare: vi.fn().mockResolvedValue(false),
  },
}));

// Mock the database so tests run without a real Postgres instance
vi.mock("../db/client.js", () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    }),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        onConflictDoNothing: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
        onConflictDoUpdate: vi.fn().mockResolvedValue(undefined),
      }),
    }),
  },
  pool: { end: vi.fn() },
}));

const VALID_BODY = JSON.stringify({ email: "test@example.com", password: "password123" });
const HEADERS = { "content-type": "application/json" };

describe("Rate limiting", () => {
  describe("POST /api/auth/login", () => {
    it("returns 429 after exceeding the per-IP limit (max 10 per minute)", async () => {
      const app = buildApp();
      await app.ready();

      // Requests 1–10 must not be rate-limited (they return 401 because the user does not exist)
      for (let i = 0; i < 10; i++) {
        const res = await app.inject({ method: "POST", url: "/api/auth/login", headers: HEADERS, payload: VALID_BODY });
        expect(res.statusCode, `request ${i + 1} should not be rate-limited yet`).not.toBe(429);
      }

      // Request 11 must be rate-limited
      const res = await app.inject({ method: "POST", url: "/api/auth/login", headers: HEADERS, payload: VALID_BODY });
      expect(res.statusCode).toBe(429);

      await app.close();
    });
  });

  describe("POST /api/auth/register", () => {
    it("returns 429 after exceeding the per-IP limit (max 10 per minute)", async () => {
      const app = buildApp();
      await app.ready();

      for (let i = 0; i < 10; i++) {
        const res = await app.inject({ method: "POST", url: "/api/auth/register", headers: HEADERS, payload: VALID_BODY });
        expect(res.statusCode, `request ${i + 1} should not be rate-limited yet`).not.toBe(429);
      }

      const res = await app.inject({ method: "POST", url: "/api/auth/register", headers: HEADERS, payload: VALID_BODY });
      expect(res.statusCode).toBe(429);

      await app.close();
    });
  });
});
