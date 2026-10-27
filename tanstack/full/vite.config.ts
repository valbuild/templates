import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools({
      /*
       * Vite already forwards the browser's console to the terminal, which is
       * where Val's development warnings should be read. The devtools' own
       * piping on top of it sends every browser warning round in a loop --
       * the terminal's copy is piped back to the browser, which forwards it
       * again -- dozens of times a second for as long as the tab is open.
       */
      consolePiping: { enabled: false },
    }),
    tailwindcss(),
    tanstackStart({
      /*
       * A `*.val.ts` beside a route file is content, not a route.
       *
       * Val's route modules are named after the route file they serve —
       * `products.$sku.tsx` is served by `products.$sku.val.ts` — and the route
       * generator scans every file under `src/routes`. Without this it reads
       * that as a route at `/products/$sku/val` and warns on every run.
       * `tsr.config.json` needs the same pattern for the standalone CLI.
       */
      router: { routeFileIgnorePattern: "\\.val\\.[tj]sx?$" },
    }),
    viteReact(),
  ],
});

export default config;
