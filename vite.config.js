import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  base: "/tic-tac-toe/",
  plugins: [svelte()],
  server: {
    allowedHosts: [".onamp.dev"],
  },
});
