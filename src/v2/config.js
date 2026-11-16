// 1) Supabase Dashboard > Project Settings > API (ou bouton "Connect")
// 2) Collez l'URL du projet et la clé PUBLIQUE (publishable key, ou "anon public key").
// ⚠️ N'utilisez JAMAIS la clé "secret" / "service_role" dans une application mobile.
export const SUPABASE_URL = 'https://wjzpfxzcylrokauevxly.supabase.co';
export const SUPABASE_KEY = 'sb_publishable__tS71L9cNzwtqZCFSSW6zg_WcLczXeg';

export const isConfigured =
  SUPABASE_URL.startsWith('https://') &&
  !SUPABASE_URL.includes('YOUR-PROJECT-REF') &&
  !SUPABASE_KEY.startsWith('YOUR-');
