// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { loadEnv, defineConfig } from "vite";
import { defineConfig as lovableDefineConfig } from "@lovable.dev/vite-tanstack-config";

const lovableConfig = lovableDefineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "netlify",
  },
});

export default defineConfig(async (configEnv) => {
  const env = loadEnv(configEnv.mode, process.cwd(), "");

  if (env.SUPABASE_URL && !env.VITE_SUPABASE_URL) {
    env.VITE_SUPABASE_URL = env.SUPABASE_URL;
  }
  if (env.SUPABASE_PUBLISHABLE_KEY && !env.VITE_SUPABASE_PUBLISHABLE_KEY) {
    env.VITE_SUPABASE_PUBLISHABLE_KEY = env.SUPABASE_PUBLISHABLE_KEY;
  }

  Object.entries(env).forEach(([key, value]) => {
    if (value !== undefined) {
      process.env[key] = value;
    }
  });

  return await lovableConfig(configEnv);
});

