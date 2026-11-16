import { defineConfig } from "vitest/config";
import path from "node:path";

// Tests unitaires cibles (src/lib, src/services) : vitest lit le TypeScript
// directement, sans build. Les tests de bout en bout sont dans scripts/e2e.sh.
export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
});
