import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./src/test/setup.ts"],
    // api/ ist ein eigenständiges npm-Projekt mit eigenem vitest.config.ts/node_modules
    // (siehe api/package.json "test") — Root-Vitest darf dessen Tests nicht mitscannen,
    // sonst schlagen Imports wie "fastify" fehl (nur in api/node_modules vorhanden).
    exclude: [...configDefaults.exclude, "api/**"],
  },
});
