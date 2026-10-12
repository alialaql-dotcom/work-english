import { Link } from 'react-router-dom';
import { findLesson, findUnit, UNITS } from '../content';
import { BidiText, Icon, ProgressBar } from '../components/ui';
import { currentLessonId, curriculumProgress, unitTestAvailable } from '../lib/path';
import { dayKey, dayTotals, streak, totalXp, xpLevel } from '../lib/progress';
import { dueItems } from '../lib/srs';
import { useG, useProgress } from '../state/ProgressContext';
import { APP_VERSION, CHANGELOG } from '../version';
import { useState } from 'react';

const SEEN_KEY = 'we:seen-version';
function readSeen(): string | null {
  try {
    return localStorage.getItem(SEEN_KEY);
  } catch {
    return null;
  }
}
function writeSeen(v: string) {
  try {
    localStorage.setItem(SEEN_KEY, v);
  } catch {
    /* ignore */
  }
}

export function HomePage() {
  const { progress, session, cloudAvailable } = useProgress();
  const g = useG();
  const now = Date.now();
  const lessonId = currentLessonId(progress);
  const lesson = lessonId ? findLesson(lessonId) : undefined;
  const unit = lesson ? findUnit(lesson.unitId) : undefined;
  const due = dueItems(progress.items, now, 99).length;
  const today = dayTotals(progress, dayKey(now));
  const minutesToday = Math.round(today.seconds / 60);
  const goal = progress.settings.dailyGoalMinutes;
  const st = streak(progress, now);
  const xp = totalXp(progress);
  const lvl = xpLevel(xp);
  const cur = curriculumProgress(progress);
  const pendingTest = UNITS.find((u) => unitTestAvailable(progress, u.id) && !progress.unitTests[u.id]?.passed);
  const name = progress.profile.name;
  const hour = new Date().getHours();
  const hello = hour < 12 ? 'صباح الخير' : 'مساء الخير';
  const doneToday = today.lessons > 0 || today.reviews > 0;
  // أول زيارة على الإطلاق: نسجل الإصدار الحالي دون عرض لافتة التحديث
  const [seen, setSeen] = useState(() => {
    const v = readSeen();
    if (v !== null) return v;
    // مستخدم من الإصدار 1.0.0 (قبل حفظ رقم الإصدار) لديه تقدم مسجل: نعرض له ما الجديد
    const existing = Object.keys(progress.lessons).length > 0 || Object.keys(progress.items).length > 0;
    if (existing) return '1.0.0';
    writeSeen(APP_VERSION);
    return APP_VERSION;
  });
  const showUpdate = seen !== APP_VERSION;

  return (
    <div>
      <h1>
        {hello}
        {name ? ` يا ${name}` : ''}
      </h1>
      <p className="muted">{doneToday ? g('أحسنت، درست اليوم. المراجعة الإضافية تزيد ثباتك.', 'أحسنتِ، درستِ اليوم. المراجعة الإضافية تزيد ثباتك.', 'تم إنجاز جلسة اليوم. المراجعة الإضافية تزيد الثبات.') : '10 دقائق اليوم تكفي.'}</p>

      {showUpdate && (
        <div className="banner info" role="status">
          <b>تم التحديث إلى الإصدار {APP_VERSION}</b>
          <ul style={{ margin: '6px 0', paddingInlineStart: 18 }}>
            {CHANGELOG[0].changes.slice(0, 3).map((c) => (
              <li key={c} className="small">
                {c}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="btn ghost small"
            onClick={() => {
              writeSeen(APP_VERSION);
              setSeen(APP_VERSION);
            }}
          >
            تم
          </button>
        </div>
      )}

      {cloudAvailable && !session && (
        <div className="banner">
          تقدمك محفوظ على هذا الجهاز فقط. <Link to="/account">{g('أنشئ حسابًا', 'أنشئي حسابًا', 'أنشئ حسابًا')}</Link> لحفظه سحابيًا ومتابعته من جهاز آخر.
        </div>
      )}

      {due > 0 && (
        <Link to="/review" className="card row between" style={{ textDecoration: 'none', color: 'inherit', borderColor: 'var(--accent)' }}>
          <div>
            <b>مراجعة مستحقة</b>
            <div className="small muted">{due} {due === 1 ? 'عنصر' : 'عناصر'} — حوالي {Math.max(1, Math.round(due * 0.3))} دقيقة</div>
          </div>
          <span className="btn small primary">راجع</span>
        </Link>
      )}

      {pendingTest && (
        <Link to={`/test/${pendingTest.id}`} className="card row between" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div>
            <b>اختبار الوحدة جاهز</b>
            <div className="small muted">{pendingTest.title}</div>
          </div>
          <span className="btn small secondary">ابدأ</span>
        </Link>
      )}

      {lesson ? (
        <div className="card primary">
          <div className="small" style={{ opacity: 0.85 }}>
            درس اليوم · {unit?.title}
          </div>
          <h2 style={{ margin: '4px 0' }}>{lesson.title}</h2>
          <p style={{ opacity: 0.9 }}>
            <BidiText text={lesson.goal} />
          </p>
          <Link to={`/lesson/${lesson.id}`} className="btn block" style={{ background: 'var(--primary-ink)', color: 'var(--primary)' }}>
            <Icon name="play" /> ابدأ الدرس ({lesson.minutes} دقائق)
          </Link>
        </div>
      ) : (
        <div className="card">
          <h2>{g('أكملت كل الدروس المتاحة!', 'أكملتِ كل الدروس المتاحة!', 'اكتملت كل الدروس المتاحة!')}</h2>
          <p>الوحدات التالية قيد الإعداد. استمر في المراجعة اليومية حتى لا تنسى ما تعلمته.</p>
        </div>
      )}

      <div className="grid2">
        <div className="stat">
          <span className="small muted">
            <Icon name="flame" /> سلسلة الأيام
          </span>
          <b>{st}</b>
        </div>
        <div className="stat">
          <span className="small muted">هدف اليوم</span>
          <b>
            {Math.min(minutesToday, goal)}/{goal}
          </b>
          <ProgressBar value={minutesToday / goal} accent label="هدف اليوم بالدقائق" />
        </div>
        <div className="stat">
          <span className="small muted">النقاط · مستوى {lvl.level}</span>
          <b>{xp}</b>
          <ProgressBar value={lvl.into / lvl.need} label="التقدم للمستوى التالي" />
        </div>
        <div className="stat">
          <span className="small muted">المنهج المتاح</span>
          <b>
            {cur.done}/{cur.total}
          </b>
          <ProgressBar value={cur.done / cur.total} label="الدروس المكتملة" />
        </div>
      </div>
      <p className="small muted" style={{ marginTop: 12 }}>
        النقاط للتحفيز فقط ولا تعني مستوى اللغة. مستواك الفعلي في صفحة <Link to="/stats">التقدم</Link>.
      </p>
      <p className="small muted center">
        <Link to="/settings" style={{ color: 'inherit' }}>
          الإصدار <span className="en">{APP_VERSION}</span>
        </Link>
      </p>
    </div>
  );
}
