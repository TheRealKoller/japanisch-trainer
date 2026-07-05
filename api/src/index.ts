import { migrate } from "drizzle-orm/node-postgres/migrator";
import { buildApp } from "./app.js";
import { db } from "./db/client.js";

const app = buildApp();

try {
  await migrate(db, { migrationsFolder: "./drizzle" });
  await app.listen({ port: 3000, host: "0.0.0.0" });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
