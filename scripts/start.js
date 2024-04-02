const esbuild = require("esbuild");

async function start(options) {
  const context = await esbuild.context(options);

  await context.watch();
  console.log("Watching for changes...");
}

// Minified for CDN
start({
  entryPoints: [`builds/cdn.js`],
  outfile: `dist/cdn.min.js`,
  bundle: true,
  minify: true,
  sourcemap: true,
  platform: "browser",
});
