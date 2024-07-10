import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  output: "server",
  server: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  adapter: netlify(),
  integrations: [svelte()],
  middleware: ["./src/middleware.ts"],
  security: {
    checkOrigin: true,
  },
});
