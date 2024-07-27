/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    include: ["./src/lib/__tests__/**/*.test.js"],
    environment: "jsdom",
    setupFiles: ["./src/lib/__tests__/setup.js"],
  },
});
