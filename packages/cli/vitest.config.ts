import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    // The install tests copy files and resolve dependencies; CI runners need more than the 5s default.
    testTimeout: 30000
  }
})
