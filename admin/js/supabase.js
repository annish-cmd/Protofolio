/// local supabase url and publishable key
const SUPABASE_URL = "http://127.0.0.1:54321";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH";

/*
/// use this when running admin panel using vite
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
);
*/

/// use this when running admin panel using liveserver extension in vscode
export const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
);
