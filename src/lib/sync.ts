// تخزين محلي أولًا (يعمل دون اتصال) ثم مزامنة سحابية بالدمج.
import { emptyProgress, isProgress, mergeProgress, repairProgress, type Progress } from './progress';
import type { SupabaseClient } from '@supabase/supabase-js';

const LOCAL_KEY = 'we:progress:v1';
const DEVICE_KEY = 'we:device';

function storage(): Storage | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
}

export function deviceId(): string {
  const s = storage();
  let id = s?.getItem(DEVICE_KEY);
  if (!id) {
    id = Math.random().toString(36).slice(2, 10);
    try {
      s?.setItem(DEVICE_KEY, id);
    } catch {
      /* تخزين ممتلئ أو محظور */
    }
  }
  return id;
}

export function loadLocal(): Progress {
  const s = storage();
  const raw = s?.getItem(LOCAL_KEY);
  if (!raw) return emptyProgress();
  try {
    const parsed = JSON.parse(raw);
    return isProgress(parsed) ? repairProgress(parsed) : repairProgress(parsed ?? {});
  } catch {
    return emptyProgress();
  }
}

export function saveLocal(p: Progress): boolean {
  try {
    storage()?.setItem(LOCAL_KEY, JSON.stringify(p));
    return true;
  } catch {
    return false;
  }
}

export function clearLocal() {
  try {
    storage()?.removeItem(LOCAL_KEY);
  } catch {
    /* ignore */
  }
}

// ───────── الخادم ─────────

export interface ProgressBackend {
  fetch(userId: string): Promise<Progress | null>;
  push(userId: string, p: Progress): Promise<void>;
  remove(userId: string): Promise<void>;
}

export function supabaseBackend(client: SupabaseClient): ProgressBackend {
  return {
    async fetch(userId) {
      const { data, error } = await client.from('progress').select('data').eq('user_id', userId).maybeSingle();
      if (error) throw error;
      if (!data?.data) return null;
      return isProgress(data.data) ? repairProgress(data.data) : null;
    },
    async push(userId, p) {
      const { error } = await client
        .from('progress')
        .upsert({ user_id: userId, data: p, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
      if (error) throw error;
    },
    async remove(userId) {
      const { error } = await client.from('progress').delete().eq('user_id', userId);
      if (error) throw error;
    },
  };
}

/**
 * مزامنة: نجلب نسخة السحابة، ندمجها مع المحلية، ثم نحفظ النتيجة في المكانين.
 * الدمج تبادلي، فلا يضيع تقدم أي جهاز حتى لو درس المستخدم على جهازين دون اتصال.
 */
export async function syncNow(backend: ProgressBackend, userId: string, local: Progress): Promise<Progress> {
  const remote = await backend.fetch(userId);
  const merged = remote ? mergeProgress(local, remote) : local;
  await backend.push(userId, merged);
  saveLocal(merged);
  return merged;
}
