import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ConfirmButton, SpeakButton } from '../components/ui';
import { buildIcs, isValidTime, notificationsSupported, suggestTime, WINDOWS } from '../lib/reminders';
import { englishVoices, onVoicesChanged, recognitionSupported, ttsSupported } from '../lib/speech';
import type { Gender, Settings } from '../lib/progress';
import { useProgress } from '../state/ProgressContext';

export function SettingsPage() {
  const { progress, update, resetLocal, session, cloudAvailable } = useProgress();
  const navigate = useNavigate();
  const s = progress.settings;
  const [voices, setVoices] = useState(() => englishVoices());
  const [perm, setPerm] = useState<NotificationPermission | 'unsupported'>(() => (notificationsSupported() ? Notification.permission : 'unsupported'));
  const [icsMsg, setIcsMsg] = useState<string | null>(null);

  useEffect(() => onVoicesChanged(() => setVoices(englishVoices())), []);

  const set = (patch: Partial<Settings>) => update((p, now) => ({ ...p, settings: { ...p.settings, ...patch, updatedAt: now }, updatedAt: now }));
  const setReminder = (patch: Partial<Settings['reminder']>) => set({ reminder: { ...s.reminder, ...patch } });
  const setGender = (gender: Gender) => update((p, now) => ({ ...p, profile: { ...p.profile, gender, updatedAt: now }, updatedAt: now }));

  const downloadIcs = () => {
    const appUrl = window.location.href.split('#')[0];
    const ics = buildIcs(s.reminder.time, appUrl);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'english-daily-reminder.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    setIcsMsg('افتح الملف الذي تم تنزيله ليُضاف التذكير إلى تقويم جهازك. لإيقافه لاحقًا احذف الحدث من التقويم.');
  };

  return (
    <div>
      <h1>الإعدادات</h1>

      <section className="card">
        <h2>الصوت</h2>
        {!ttsSupported() && <div className="banner bad">متصفحك لا يدعم تشغيل الصوت. جرّب Chrome أو Safari أو Edge.</div>}
        {voices.length > 0 && (
          <label className="field">
            <span>الصوت الإنجليزي</span>
            <select className="input" value={s.voiceURI ?? ''} onChange={(e) => set({ voiceURI: e.target.value || undefined })}>
              <option value="">تلقائي (أمريكي ثم بريطاني)</option>
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </label>
        )}
        {voices.length > 1 && <p className="small muted">جرّب أصواتًا بلهجات مختلفة (أمريكية، بريطانية، أسترالية، هندية…) لتعتاد على سماعها من العملاء.</p>}
        <label className="field">
          <span>
            سرعة الكلام: <span className="en">{s.rate.toFixed(1)}×</span>
          </span>
          <input type="range" min={0.6} max={1.2} step={0.1} value={s.rate} onChange={(e) => set({ rate: Number(e.target.value) })} style={{ width: '100%' }} />
        </label>
        <SpeakButton text="Good evening! How can I help you today?" label="تجربة الصوت" />
      </section>

      <section className="card">
        <h2>الترجمة</h2>
        <label className="field">
          <span>ترجمة نصوص الاستماع</span>
          <select className="input" value={s.showTranslation} onChange={(e) => set({ showTranslation: e.target.value as Settings['showTranslation'] })}>
            <option value="after">تظهر بعد الاستماع (مُوصى به)</option>
            <option value="hidden">مخفية — تحدٍّ أكبر</option>
            <option value="always">تظهر دائمًا</option>
          </select>
        </label>
      </section>

      <section className="card">
        <h2>الميكروفون</h2>
        <label className="row" style={{ minHeight: 44 }}>
          <input type="checkbox" checked={s.micEnabled} onChange={(e) => set({ micEnabled: e.target.checked })} />
          استخدام الميكروفون في تمارين التكرار
        </label>
        <p className="small muted">
          {recognitionSupported()
            ? 'متصفحك يدعم التعرف على الكلام. يُظهر الكلمات التي فهمها المتصفح، وليس تقييمًا لدقة النطق. في Chrome يُرسل الصوت لخدمة Google للتعرف عليه.'
            : 'متصفحك لا يدعم التعرف على الكلام (مثل Firefox). كل التمارين تعمل بدونه.'}
        </p>
      </section>

      <section className="card">
        <h2>التذكير اليومي</h2>
        <label className="field">
          <span>متى يناسبك الدرس؟</span>
          <select
            className="input"
            value={s.reminder.window}
            onChange={(e) => setReminder({ window: e.target.value, time: suggestTime(e.target.value) })}
          >
            {WINDOWS.map((w) => (
              <option key={w.id} value={w.id}>
                {w.label} ({w.start}–{w.end})
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>الوقت المقترح (يمكنك تعديله)</span>
          <input className="input en" type="time" value={s.reminder.time} onChange={(e) => isValidTime(e.target.value) && setReminder({ time: e.target.value })} />
        </label>
        <label className="row" style={{ minHeight: 44 }}>
          <input type="checkbox" checked={s.reminder.enabled} onChange={(e) => setReminder({ enabled: e.target.checked })} />
          تفعيل التذكير داخل الموقع
        </label>

        <div className="kv">
          <b>الطريقة الأضمن: تذكير في تقويم هاتفك</b>
          <p className="small" style={{ margin: '4px 0 8px' }}>يعمل حتى والموقع مغلق، دون أي خادم أو صلاحيات.</p>
          <button type="button" className="btn secondary block" onClick={downloadIcs}>
            أضف تذكيرًا يوميًا للتقويم ({s.reminder.time})
          </button>
          {icsMsg && <p className="small" style={{ marginTop: 8 }}>{icsMsg}</p>}
          {import.meta.env.MODE === 'preview' && <p className="small muted" style={{ marginTop: 8 }}>في نسخة المعاينة قد يُمنع التنزيل. يعمل في الموقع بعد نشره.</p>}
        </div>

        <div className="kv">
          <b>إشعار المتصفح</b>
          {perm === 'unsupported' && <p className="small">متصفحك لا يدعم الإشعارات.</p>}
          {perm === 'default' && (
            <button
              type="button"
              className="btn secondary small"
              style={{ marginTop: 6 }}
              onClick={async () => setPerm(await Notification.requestPermission())}
            >
              اسمح بالإشعارات
            </button>
          )}
          {perm === 'denied' && <p className="small">الإشعارات مرفوضة. يمكنك السماح بها من إعدادات المتصفح للموقع.</p>}
          {perm === 'granted' && <p className="small">مسموح.</p>}
          <p className="small muted" style={{ marginTop: 6 }}>
            إشعار المتصفح يظهر فقط إذا كان الموقع مفتوحًا (ولو في الخلفية) وقت التذكير. الإشعارات مع إغلاق الموقع تحتاج خادم إشعارات وهي غير مفعّلة في هذه النسخة.
          </p>
        </div>
      </section>

      <section className="card">
        <h2>الملف الشخصي</h2>
        <label className="field">
          <span>صيغة المخاطبة</span>
          <select className="input" value={progress.profile.gender} onChange={(e) => setGender(e.target.value as Gender)}>
            <option value="m">مذكر</option>
            <option value="f">مؤنث</option>
            <option value="n">محايدة</option>
          </select>
        </label>
        <label className="field">
          <span>هدف الدقائق اليومي</span>
          <select className="input" value={s.dailyGoalMinutes} onChange={(e) => set({ dailyGoalMinutes: Number(e.target.value) })}>
            {[5, 10, 15, 20].map((m) => (
              <option key={m} value={m}>
                {m} دقائق
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="btn secondary block" onClick={() => navigate('/placement')}>
          أعد اختبار تحديد المستوى
        </button>
      </section>

      <section className="card">
        <h2>الحساب والبيانات</h2>
        {cloudAvailable ? (
          <p className="small">{session ? `مسجل باسم ${session.user.email}` : 'غير مسجل — التقدم على هذا الجهاز فقط.'}</p>
        ) : (
          <p className="small">الحفظ السحابي غير مهيأ في هذه النسخة. التقدم محفوظ في متصفح هذا الجهاز.</p>
        )}
        <Link to="/account" className="btn secondary block">
          الحساب والمزامنة
        </Link>
        {!session && (
          <div style={{ marginTop: 10 }}>
            <ConfirmButton
              message="سيُحذف كل تقدمك المحفوظ على هذا الجهاز نهائيًا."
              confirmLabel="نعم، امسح التقدم"
              onConfirm={() => {
                resetLocal();
                navigate('/welcome');
              }}
            >
              مسح التقدم من هذا الجهاز
            </ConfirmButton>
          </div>
        )}
      </section>
      <p className="small muted center">المحتوى تعليمي ومستقل، ولا يمثل مكتبة جرير أو سياساتها أو أسعارها.</p>
    </div>
  );
}
