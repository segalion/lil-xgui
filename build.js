const esbuild = require("esbuild");

esbuild.build({
    entryPoints: ["src/index.js"],
    bundle: true,
    minify: true,
    sourcemap: false,
    format: "esm",
    outfile: "dist/lil-xgui.min.js",
    external: ["lil-gui"],
    loader: { ".css": "text" }
}).catch(() => process.exit(1));