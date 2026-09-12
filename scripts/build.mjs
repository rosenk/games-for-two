import { copyFile, readdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

import { svelte } from "@sveltejs/vite-plugin-svelte";
import { build } from "vite";

const root = resolve(import.meta.dirname, "..");
const rootBuild = resolve(root, ".root-build");

await rm(rootBuild, { force: true, recursive: true });

await build({
  configFile: false,
  plugins: [svelte()],
  build: {
    cssCodeSplit: false,
    emptyOutDir: true,
    minify: true,
    outDir: rootBuild,
    lib: {
      entry: resolve(root, "src/main.js"),
      cssFileName: "styles",
      fileName: "app",
      formats: ["es"],
    },
  },
});

const outputFiles = await readdir(rootBuild);
const cssFile = outputFiles.find((file) => file.endsWith(".css"));
if (!cssFile) throw new Error("The Svelte build did not emit CSS");

await copyFile(resolve(rootBuild, "app.js"), resolve(root, "app.js"));
await copyFile(resolve(rootBuild, cssFile), resolve(root, "styles.css"));
await rm(rootBuild, { force: true, recursive: true });

await build();
