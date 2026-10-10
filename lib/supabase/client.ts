import { createBrowserClient } from "@supabase/ssr";
import { supabasePublicKey, supabaseUrl } from "./env";

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabasePublicKey);
}

export function createClient() {
  return createBrowserClient(supabaseUrl!, supabasePublicKey!);
}
