import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/tic-tac-toe/" : "/",
  plugins: [
    svelte(),
    {
      name: "development-source-entry",
      apply: "serve",
      transformIndexHtml: {
        order: "pre",
        handler: (html) => html
          .replace('    <link rel="stylesheet" href="./styles.css" />\n', "")
          .replace('src="./app.js"', 'src="/src/main.js"'),
      },
    },
  ],
  server: {
    allowedHosts: [".onamp.dev"],
  },
}));
