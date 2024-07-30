// vite.config.js
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    copyPublicDir: false,
    lib: {
      name: "toolbelt",
      entry: path.resolve(__dirname, "src/lib/builds/plugin.cdn.js"),
      formats: ["es", "umd"],
    },
  },
});
