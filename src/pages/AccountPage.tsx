import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useProgress } from '../state/ProgressContext';
import { ConfirmButton, Spinner } from '../components/ui';

function arError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('invalid login')) return 'البريد أو كلمة المرور غير صحيحة.';
  if (m.includes('already registered') || m.includes('already been registered')) return 'هذا البريد مسجل مسبقًا. جرّب تسجيل الدخول أو استعادة كلمة المرور.';
  if (m.includes('email not confirmed')) return 'لم يتم تأكيد البريد بعد. افتح رسالة التأكيد في بريدك.';
  if (m.includes('rate limit') || m.includes('too many')) return 'محاولات كثيرة. انتظر قليلًا ثم حاول مرة أخرى.';
  if (m.includes('password') && m.includes('characters')) return 'كلمة المرور قصيرة. استخدم 8 أحرف على الأقل.';
  if (m.includes('failed to fetch') || m.includes('network')) return 'تعذر الاتصال. تحقق من الإنترنت ثم حاول مرة أخرى.';
  if (m.includes('same') && m.includes('password')) return 'كلمة المرور الجديدة مطابقة للقديمة.';
  return 'حدث خطأ: ' + msg;
}

const appUrl = () => window.location.href.split('#')[0].split('?')[0];

export function AccountPage() {
  const ctx = useProgress();
  const { session, authReady, cloudAvailable, cloudConfigError, syncStatus, lastSyncedAt, syncError, passwordRecovery } = ctx;
  const navigate = useNavigate();
  const [delErr, setDelErr] = useState<string | null>(null);

  if (!cloudAvailable) {
    return (
      <div>
        <h1>الحساب</h1>
        <div className="card soft">
          {cloudConfigError === 'secret-key' ? (
            <p className="banner bad">تم رفض الإعداد: وُضع مفتاح سري في إعدادات الموقع. يجب استخدام المفتاح العام (anon / publishable) فقط.</p>
          ) : (
            <p>الحساب والحفظ السحابي غير مهيأين في هذه النسخة من الموقع.</p>
          )}
          <p style={{ margin: 0 }}>تقدمك محفوظ في متصفح هذا الجهاز، ويبقى ما لم تمسح بيانات المتصفح. لتفعيل الحسابات والمزامنة بين الأجهزة، اتبع دليل النشر المرفق مع المشروع (إعداد Supabase مجاني).</p>
        </div>
      </div>
    );
  }
  if (!authReady) return <Spinner />;
  if (passwordRecovery) return <NewPassword onDone={() => { ctx.clearRecovery(); navigate('/'); }} />;

  if (session) {
    const statusText = {
      local: 'غير متزامن',
      syncing: 'جارٍ المزامنة…',
      synced: 'متزامن',
      offline: 'دون اتصال — ستتم المزامنة عند عودة الإنترنت',
      error: 'تعذرت المزامنة',
    }[syncStatus];
    return (
      <div>
        <h1>الحساب</h1>
        <div className="card">
          <p style={{ margin: 0 }}>
            <b>البريد:</b> <span className="en">{session.user.email}</span>
          </p>
          <p style={{ margin: '6px 0' }}>
            <b>المزامنة:</b> {statusText}
            {lastSyncedAt && syncStatus === 'synced' && <span className="small muted"> · {new Date(lastSyncedAt).toLocaleTimeString('ar-SA-u-nu-latn', { hour: '2-digit', minute: '2-digit' })}</span>}
          </p>
          {syncStatus === 'error' && syncError && <p className="small" style={{ color: 'var(--bad)' }}>{arError(syncError)}</p>}
          <button type="button" className="btn secondary block" onClick={() => void ctx.syncNow()} disabled={syncStatus === 'syncing'}>
            زامن الآن
          </button>
        </div>
        <p className="small muted">تقدمك يُحفظ على الجهاز أولًا ثم يُرفع للسحابة تلقائيًا. إذا درست على جهازين دون اتصال، يُدمج التقدم عند المزامنة دون أن يضيع شيء.</p>
        <button
          type="button"
          className="btn secondary block"
          onClick={async () => {
            await ctx.signOut();
            navigate('/welcome');
          }}
        >
          تسجيل الخروج
        </button>
        <p className="small muted">عند الخروج نمسح النسخة المحلية من هذا الجهاز لحماية خصوصيتك، وتبقى محفوظة في حسابك.</p>
        <details className="card soft" style={{ marginTop: 20 }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600 }}>حذف البيانات</summary>
          <p className="small">يحذف تقدمك المحفوظ في السحابة نهائيًا. لحذف الحساب نفسه (البريد وكلمة المرور) تواصل مع مشرف المنصة.</p>
          <ConfirmButton
            message="حذف تقدمك من السحابة نهائيًا؟ لا يمكن التراجع."
            confirmLabel="نعم، احذف"
            onConfirm={async () => {
              try {
                await ctx.deleteCloudData();
                await ctx.signOut();
                navigate('/welcome');
              } catch (e) {
                setDelErr(arError(e instanceof Error ? e.message : String(e)));
              }
            }}
          >
            حذف بياناتي من السحابة
          </ConfirmButton>
          {delErr && <p role="alert" style={{ color: 'var(--bad)' }}>{delErr}</p>}
        </details>
      </div>
    );
  }

  return <AuthForms />;
}

function AuthForms() {
  const [tab, setTab] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setErr(null);
    setInfo(null);
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr('اكتب بريدًا إلكترونيًا صحيحًا.');
    if (tab !== 'forgot' && password.length < 8) return setErr('كلمة المرور يجب أن تكون 8 أحرف على الأقل.');
    setBusy(true);
    try {
      if (tab === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (tab === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: appUrl() } });
        if (error) throw error;
        if (!data.session) setInfo('أرسلنا رسالة تأكيد إلى بريدك. افتحها ثم ارجع وسجّل الدخول. تقدمك الحالي على هذا الجهاز سيُضاف لحسابك بعد الدخول.');
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: appUrl() });
        if (error) throw error;
        setInfo('إذا كان البريد مسجلًا، ستصلك رسالة فيها رابط لتعيين كلمة مرور جديدة.');
      }
    } catch (e) {
      setErr(arError(e instanceof Error ? e.message : String(e)));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h1>الحساب</h1>
      <p className="muted">احفظ تقدمك سحابيًا وتابع من الهاتف أو الكمبيوتر.</p>
      <div className="row" role="tablist" style={{ marginBottom: 14 }}>
        {(
          [
            ['signin', 'تسجيل الدخول'],
            ['signup', 'حساب جديد'],
          ] as const
        ).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} type="button" className={`btn small ${tab === k ? 'primary' : 'secondary'}`} onClick={() => { setTab(k); setErr(null); setInfo(null); }}>
            {l}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="card" noValidate>
        {tab === 'forgot' && <p>اكتب بريدك وسنرسل لك رابطًا لتعيين كلمة مرور جديدة.</p>}
        <label className="field">
          <span>البريد الإلكتروني</span>
          <input className="input en" type="email" dir="ltr" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        {tab !== 'forgot' && (
          <label className="field">
            <span>كلمة المرور {tab === 'signup' && <span className="muted small">(8 أحرف على الأقل)</span>}</span>
            <input className="input en" type="password" dir="ltr" autoComplete={tab === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          </label>
        )}
        {err && <p role="alert" style={{ color: 'var(--bad)' }}>{err}</p>}
        {info && <p role="status" className="banner info">{info}</p>}
        <button className="btn primary block" disabled={busy}>
          {busy ? 'لحظة…' : tab === 'signin' ? 'دخول' : tab === 'signup' ? 'إنشاء الحساب' : 'أرسل الرابط'}
        </button>
        {tab === 'signin' && (
          <button type="button" className="btn ghost block" onClick={() => setTab('forgot')}>
            نسيت كلمة المرور؟
          </button>
        )}
        {tab === 'forgot' && (
          <button type="button" className="btn ghost block" onClick={() => setTab('signin')}>
            رجوع لتسجيل الدخول
          </button>
        )}
      </form>
    </div>
  );
}

function NewPassword({ onDone }: { onDone: () => void }) {
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  return (
    <form
      className="card"
      onSubmit={async (e) => {
        e.preventDefault();
        if (pw.length < 8) return setErr('8 أحرف على الأقل.');
        setBusy(true);
        const { error } = await supabase!.auth.updateUser({ password: pw });
        setBusy(false);
        if (error) setErr(arError(error.message));
        else onDone();
      }}
    >
      <h1>كلمة مرور جديدة</h1>
      <label className="field">
        <span>كلمة المرور الجديدة</span>
        <input className="input en" type="password" dir="ltr" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} />
      </label>
      {err && <p role="alert" style={{ color: 'var(--bad)' }}>{err}</p>}
      <button className="btn primary block" disabled={busy}>
        حفظ
      </button>
    </form>
  );
}
