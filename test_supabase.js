import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkErrors() {
  const { data, error } = await supabase.from('reports').select('id, status, error, created_at');
  if (error) {
    console.error("Error querying reports:", error);
  } else {
    console.log("Reports found:", data);
  }
}

checkErrors();
