import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://xrgtydyveysfzikugaex.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyZ3R5ZHl2ZXlzZnppa3VnYWV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNTI5MjYsImV4cCI6MjA5NjgyODkyNn0.O7t6Lj5AfW1VDadCHyTsLlfizRLwKUIXVNm-N0bEcyw";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function test() {
  console.log("Testing strong password sign up...");
  try {
    const res = await supabase.auth.signUp({
      email: `test_user_${Date.now()}@example.com`,
      password: "AVeryStrongPassword!987654321",
      options: {
        emailRedirectTo: "http://localhost:8080",
        data: { display_name: "Test User" },
      },
    });
    console.log("Result:", JSON.stringify(res, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
