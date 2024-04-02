import * as esbuild from "esbuild";

const OUT_DIR = "www";

const context = await esbuild.context({
  entryPoints: [
    { in: "builds/cdn.js", out: "cdn" },
    { in: "src/index.html", out: "index" },
  ],
  bundle: true,
  sourcemap: true,
  platform: "browser",
  loader: { ".html": "copy" },
  outdir: OUT_DIR,
});

await context.watch();

const { host, port } = await context.serve({
  host: "localhost",
  port: 8080,
  servedir: OUT_DIR,
});

console.log(`Serving at http://${host}:${port}`);
