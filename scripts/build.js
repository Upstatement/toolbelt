import path from "path";
import { defineConfig, build } from "vite";

const filename = import.meta.filename;
const dirname = path.dirname(filename);

const ENTRIES = [
  path.resolve(dirname, "../src/lib/builds/cdn.js"),
  path.resolve(dirname, "../src/lib/builds/plugin.cdn.js"),
  path.resolve(dirname, "../src/lib/builds/module.js"),
];

function createConfig(entry) {
  return defineConfig({
    build: {
      copyPublicDir: false,
      lib: {
        name: "toolbelt",
        entry: [entry],
        formats: ["es"],
      },
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
        },
      },
    },
  });
}

for (const entry of ENTRIES) {
  build(createConfig(entry));
}
