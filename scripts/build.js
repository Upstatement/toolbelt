const esbuild = require("esbuild");

async function build(options) {
  return esbuild.build(options).catch(() => process.exit(1));
}

// Minified for CDN
build({
  entryPoints: [`builds/cdn.js`],
  outfile: `dist/plugin.min.js`,
  bundle: true,
  minify: true,
  sourcemap: false,
  platform: "browser",
});

// ES Module
build({
  entryPoints: [`builds/module.js`],
  outfile: `dist/plugin.esm.js`,
  bundle: true,
  platform: "neutral",
  mainFields: ["main", "module"],
});
