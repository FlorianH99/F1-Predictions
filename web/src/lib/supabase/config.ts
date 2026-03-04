export function getSupabaseEnv(): {
  url: string | undefined;
  anonKey: string | undefined;
} {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

export function hasSupabaseEnv(): boolean {
  const { url, anonKey } = getSupabaseEnv();

  return Boolean(url && anonKey);
}
