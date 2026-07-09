import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
function createSupabaseClient() {
  const SUPABASE_URL = "https://xrgtydyveysfzikugaex.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyZ3R5ZHl2ZXlzZnppa3VnYWV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNTI5MjYsImV4cCI6MjA5NjgyODkyNn0.O7t6Lj5AfW1VDadCHyTsLlfizRLwKUIXVNm-N0bEcyw";
  console.log("[Supabase Client] Initializing with URL:", SUPABASE_URL);
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : void 0,
      persistSession: true,
      autoRefreshToken: true
    }
  });
}
let _supabase;
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  }
});
export {
  supabase as s
};
