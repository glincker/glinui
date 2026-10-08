import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      "@glinui/motion": fileURLToPath(new URL("../motion/src/index.ts", import.meta.url))
    }
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
      include: ["src/components/**/*.tsx", "src/lib/**/*.ts", "src/lib/**/*.tsx"],
      exclude: ["src/tests/**", "tests/**", "src/index.ts"],
      thresholds: {
        statements: 80,
        branches: 80,
        lines: 80
      }
    }
  }
})
