// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { loadEnv } from "vite";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  Object.entries(env).forEach(([key, value]) => {
    if (value !== undefined) {
      process.env[key] = value;
    }
  });

  return {
    tanstackStart: {
      server: { entry: "server" },
    },
    nitro: {
      preset: "netlify",
    },
  };
});

