// Supabase connection settings, accepting both naming schemes:
// - the classic names in .env.example (…_ANON_KEY, …_SERVICE_ROLE_KEY), and
// - the names the Supabase ⇄ Vercel integration syncs (…_PUBLISHABLE_KEY,
//   SUPABASE_SECRET_KEY), which hold Supabase's newer key format.
// NEXT_PUBLIC_* values are read with literal property access so Next can inline
// them into client bundles.

export const supabaseUrl: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL;

export const supabasePublicKey: string | undefined =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** Server-only: bypasses Row Level Security. Never import the value into client code. */
export function supabaseSecretKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
}
