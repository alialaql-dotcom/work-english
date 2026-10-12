import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { emptyProgress, mergeProgress, type Gender, type Progress } from '../lib/progress';
import { clearLocal, deviceId, loadLocal, saveLocal, supabaseBackend, syncNow } from '../lib/sync';
import { cloudConfigError, supabase } from '../lib/supabase';

export type SyncStatus = 'local' | 'syncing' | 'synced' | 'offline' | 'error';

interface Ctx {
  progress: Progress;
  update: (fn: (p: Progress, now: number, device: string) => Progress) => void;
  device: string;
  session: Session | null;
  authReady: boolean;
  syncStatus: SyncStatus;
  lastSyncedAt: number | null;
  syncError: string | null;
  cloudAvailable: boolean;
  cloudConfigError: string | null;
  passwordRecovery: boolean;
  clearRecovery: () => void;
  syncNow: () => Promise<void>;
  signOut: () => Promise<void>;
  deleteCloudData: () => Promise<void>;
  resetLocal: () => void;
}

const ProgressCtx = createContext<Ctx | null>(null);
const OWNER_KEY = 'we:owner';

function getOwner(): string | null {
  try {
    return localStorage.getItem(OWNER_KEY);
  } catch {
    return null;
  }
}
function setOwner(id: string | null) {
  try {
    if (id) localStorage.setItem(OWNER_KEY, id);
    else localStorage.removeItem(OWNER_KEY);
  } catch {
    /* ignore */
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(() => loadLocal());
  const progressRef = useRef(progress);
  const device = useMemo(() => deviceId(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(!supabase);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('local');
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const sessionRef = useRef<Session | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const backend = useMemo(() => (supabase ? supabaseBackend(supabase) : null), []);
  const inFlight = useRef(false);

  const doSync = useCallback(async () => {
    const uid = sessionRef.current?.user.id;
    if (!backend || !uid) return;
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      setSyncStatus('offline');
      return;
    }
    if (inFlight.current) return;
    inFlight.current = true;
    setSyncStatus('syncing');
    try {
      const merged = await syncNow(backend, uid, progressRef.current);
      // قد يكون المستخدم أضاف تقدمًا أثناء المزامنة: ندمج مرة أخرى محليًا (الدمج آمن للتكرار)
      progressRef.current = mergeProgress(progressRef.current, merged);
      saveLocal(progressRef.current);
      setProgress(progressRef.current);
      setSyncStatus('synced');
      setSyncError(null);
      setLastSyncedAt(Date.now());
    } catch (e) {
      setSyncStatus(navigator.onLine === false ? 'offline' : 'error');
      setSyncError(e instanceof Error ? e.message : String((e as { message?: string })?.message ?? e));
    } finally {
      inFlight.current = false;
    }
  }, [backend]);

  const scheduleSync = useCallback(() => {
    if (!sessionRef.current) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void doSync(), 2500);
  }, [doSync]);

  const update = useCallback<Ctx['update']>(
    (fn) => {
      const next = fn(progressRef.current, Date.now(), device);
      if (next === progressRef.current) return;
      progressRef.current = next;
      saveLocal(next);
      setProgress(next);
      scheduleSync();
    },
    [device, scheduleSync],
  );

  // المصادقة
  useEffect(() => {
    if (!supabase) return;
    const onSession = (s: Session | null) => {
      sessionRef.current = s;
      setSession(s);
      if (s) {
        const owner = getOwner();
        if (owner && owner !== s.user.id) {
          // تقدم محلي لمستخدم آخر على نفس الجهاز: لا ندمجه في هذا الحساب
          progressRef.current = emptyProgress();
          setProgress(progressRef.current);
          saveLocal(progressRef.current);
        }
        setOwner(s.user.id);
        void doSync();
      } else {
        setSyncStatus('local');
      }
    };
    supabase.auth.getSession().then(({ data }) => {
      onSession(data.session);
      setAuthReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === 'PASSWORD_RECOVERY') setPasswordRecovery(true);
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'PASSWORD_RECOVERY') onSession(s);
      if (event === 'TOKEN_REFRESHED') sessionRef.current = s;
    });
    return () => data.subscription.unsubscribe();
  }, [doSync]);

  // المزامنة عند عودة الاتصال أو مغادرة الصفحة
  useEffect(() => {
    const online = () => void doSync();
    const hidden = () => {
      if (document.visibilityState === 'hidden') void doSync();
    };
    window.addEventListener('online', online);
    document.addEventListener('visibilitychange', hidden);
    return () => {
      window.removeEventListener('online', online);
      document.removeEventListener('visibilitychange', hidden);
    };
  }, [doSync]);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await doSync(); // لا نفقد آخر تقدم
    await supabase.auth.signOut();
    // لحماية الخصوصية على الأجهزة المشتركة: نمسح النسخة المحلية بعد الخروج
    clearLocal();
    setOwner(null);
    progressRef.current = emptyProgress();
    setProgress(progressRef.current);
  }, [doSync]);

  const deleteCloudData = useCallback(async () => {
    const uid = sessionRef.current?.user.id;
    if (!backend || !uid) return;
    await backend.remove(uid);
  }, [backend]);

  const resetLocal = useCallback(() => {
    clearLocal();
    progressRef.current = emptyProgress();
    setProgress(progressRef.current);
  }, []);

  const value: Ctx = {
    progress,
    update,
    device,
    session,
    authReady,
    syncStatus,
    lastSyncedAt,
    syncError,
    cloudAvailable: !!supabase,
    cloudConfigError,
    passwordRecovery,
    clearRecovery: () => setPasswordRecovery(false),
    syncNow: doSync,
    signOut,
    deleteCloudData,
    resetLocal,
  };
  return <ProgressCtx.Provider value={value}>{children}</ProgressCtx.Provider>;
}

export function useProgress(): Ctx {
  const c = useContext(ProgressCtx);
  if (!c) throw new Error('useProgress outside provider');
  return c;
}

/** نص حسب جنس المخاطَب: m مذكر، f مؤنث، n محايد (يستخدم المذكر افتراضيًا إن لم تُعطَ صيغة محايدة) */
export function useG() {
  const { progress } = useProgress();
  const g: Gender = progress.profile.gender;
  return (m: string, f: string, n?: string) => (g === 'f' ? f : g === 'n' ? (n ?? m) : m);
}
