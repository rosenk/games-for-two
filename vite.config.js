import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  base: "/games-for-two/",
  plugins: [svelte(), {
    name: "dev-preload-fonts",
    apply: "serve",
    transformIndexHtml() {
      // The page uses Cyrillic and Latin Manrope. Discover the fonts alongside
      // the bundled JS instead of after Svelte renders the first text.
      return ["xn7gYHE41ni1AdIRggOxSuXd", "xn7gYHE41ni1AdIRggexSg"].map((font) => ({
        tag: "link",
        attrs: {
          rel: "preload",
          as: "font",
          type: "font/woff2",
          crossorigin: "anonymous",
          href: `https://fonts.gstatic.com/s/manrope/v20/${font}.woff2`,
        },
        injectTo: "head",
      }));
    },
  }],
  experimental: {
    bundledDev: true,
  },
  server: {
    allowedHosts: [".onamp.dev"],
  },
});
