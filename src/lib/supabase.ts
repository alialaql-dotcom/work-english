import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// المفتاح المستخدم هنا هو المفتاح العام (anon / publishable) فقط، وهو مصمم ليكون في المتصفح.
// الحماية الفعلية للبيانات تأتي من سياسات RLS في قاعدة البيانات (انظر supabase/migrations).
// إذا وُضع مفتاح سري بالخطأ، نرفض استخدامه ونعطّل السحابة بدل تسريبه.

export function looksSecret(key: string): boolean {
  if (key.startsWith('sb_secret_')) return true;
  const parts = key.split('.');
  if (parts.length === 3) {
    try {
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload?.role === 'service_role';
    } catch {
      return false;
    }
  }
  return false;
}

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const cloudConfigError: string | null = !url || !key
  ? 'not-configured'
  : looksSecret(key)
    ? 'secret-key'
    : null;

export const supabase: SupabaseClient | null = cloudConfigError
  ? null
  : createClient(url!, key!, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' },
    });

if (cloudConfigError === 'secret-key') {
  console.error('رُفض مفتاح Supabase: هذا مفتاح سري (service_role / secret) ولا يجوز وضعه في الواجهة. استخدم المفتاح العام anon / publishable.');
}
