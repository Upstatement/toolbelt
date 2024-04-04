import * as esbuild from "esbuild";

async function build(options) {
  return esbuild.build(options).catch(() => process.exit(1));
}

// Minified for CDN
build({
  entryPoints: ["src/lib/builds/cdn.js"],
  outfile: `dist/cdn.min.js`,
  bundle: true,
  minify: true,
  sourcemap: false,
  platform: "browser",
});

// ES Module
build({
  entryPoints: [`src/lib/builds/module.js`],
  outfile: `dist/module.esm.js`,
  bundle: true,
  platform: "neutral",
  mainFields: ["main", "module"],
});
