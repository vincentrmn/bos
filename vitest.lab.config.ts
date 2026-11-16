import { defineConfig } from "vitest/config";
import path from "node:path";

// Laboratoire de migration (scripts/migration-lab.sh) : un processus par etat
// de base, parce que ensureSchema() se souvient d'avoir tourne (global).
export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: {
    include: ["tests/lab/**/*.lab.ts"],
    environment: "node",
    testTimeout: 60_000,
    fileParallelism: false,
  },
});
