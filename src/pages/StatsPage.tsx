import { Link } from 'react-router-dom';
import { UNITS, UPCOMING_UNITS } from '../content';
import { LEVEL_LABELS } from '../content/placement';
import { SKILL_LABELS, type Skill } from '../content/types';
import { VOCAB } from '../content/vocab';
import { ProgressBar } from '../components/ui';
import { curriculumProgress } from '../lib/path';
import { dayKey, dayTotals, skillAccuracy, streak } from '../lib/progress';
import { dueItems, itemStatus } from '../lib/srs';
import { useProgress } from '../state/ProgressContext';

const MEASURED: Skill[] = ['vocab', 'grammar', 'listening', 'reading', 'writing', 'conversation'];

export function StatsPage() {
  const { progress } = useProgress();
  const now = Date.now();
  const items = Object.values(progress.items);
  const counts = { new: 0, learning: 0, struggling: 0, mastered: 0 };
  for (const s of items) counts[itemStatus(s)] += 1;
  const struggling = items.filter((s) => itemStatus(s) === 'struggling');
  const due = dueItems(progress.items, now, 99);
  const st = streak(progress, now);
  const cur = curriculumProgress(progress);
  const totalUnits = UNITS.length + UPCOMING_UNITS.length;
  const passedUnits = UNITS.filter((u) => progress.unitTests[u.id]?.passed).length;

  const skillRows = MEASURED.map((k) => ({ k, acc: skillAccuracy(progress.skills[k]), n: progress.skills[k]?.total ?? 0 }));
  const rated = skillRows.filter((r) => r.acc !== null).sort((a, b) => b.acc! - a.acc!);
  const strong = rated.filter((r) => r.acc! >= 0.8).slice(0, 2);
  const weak = [...rated].reverse().filter((r) => r.acc! < 0.7).slice(0, 2);

  const days = Array.from({ length: 14 }, (_, i) => {
    const t = now - (13 - i) * 86_400_000;
    const d = dayTotals(progress, dayKey(t));
    return { key: dayKey(t), on: d.lessons > 0 || d.reviews > 0 };
  });
  const activeThisWeek = days.slice(-7).filter((d) => d.on).length;

  const goals = [
    { label: 'أكمل جلسة اليوم (درس أو مراجعة)', done: days[13].on },
    { label: `راجع العناصر المستحقة (${due.length} الآن)`, done: due.length === 0 && items.length > 0 },
    { label: 'ادرس 5 أيام هذا الأسبوع', done: activeThisWeek >= 5, note: `${activeThisWeek}/5` },
    { label: 'أتقن 10 كلمات', done: counts.mastered >= 10, note: `${counts.mastered}/10` },
  ];

  return (
    <div>
      <h1>التقدم</h1>

      <section className="card">
        <h2>المستوى</h2>
        <p style={{ margin: 0 }}>
          تقدير البداية: <b>{progress.placement ? LEVEL_LABELS[progress.placement.level] : 'لم يُحدد بعد'}</b>
        </p>
        <p className="small muted">من اختبار تحديد المستوى. يتحدث التقدير مع اجتياز اختبارات الوحدات.</p>
        <div style={{ marginTop: 12 }}>
          <div className="row between small">
            <span>نحو B1 — اختبارات الوحدات المجتازة</span>
            <span className="en">
              {passedUnits}/{totalUnits}
            </span>
          </div>
          <ProgressBar value={passedUnits / totalUnits} label="التقدم نحو B1" />
        </div>
        <div className="row between small" style={{ marginTop: 10 }}>
          <span>الدروس المكتملة من المنهج المتاح</span>
          <span className="en">
            {cur.done}/{cur.total}
          </span>
        </div>
        <ProgressBar value={cur.done / cur.total} label="الدروس المكتملة" />
        <div className="banner info small" style={{ marginTop: 14, marginBottom: 0 }}>
          لن نعلن وصولك إلى B1 لمجرد إكمال الدروس. يلزم اجتياز اختبار شامل للاستماع والقراءة والكتابة والمحادثة الموجّهة (سيُضاف مع الوحدات القادمة). التحدث الحر ودقة النطق لا يمكن تقييمهما آليًا بدقة هنا؛ ننصح بتقييمهما مع زميل أو مدرّب.
        </div>
      </section>

      <section className="card">
        <h2>المهارات</h2>
        <p className="small muted">دقة آخر 40 محاولة في كل مهارة.</p>
        {skillRows.map((r) => (
          <div key={r.k} style={{ marginBottom: 10 }}>
            <div className="row between small">
              <span>{SKILL_LABELS[r.k]}</span>
              <span className="en">{r.acc === null ? '—' : `${Math.round(r.acc * 100)}%`}</span>
            </div>
            <ProgressBar value={r.acc ?? 0} label={SKILL_LABELS[r.k]} />
          </div>
        ))}
        <div className="row between small">
          <span>{SKILL_LABELS.speaking}</span>
          <span className="muted">تدريب تكرار — لا يُقيَّم آليًا</span>
        </div>
        {(strong.length > 0 || weak.length > 0) && (
          <div className="kv">
            {strong.length > 0 && <p style={{ margin: 0 }}>💪 نقاط قوة: {strong.map((r) => SKILL_LABELS[r.k]).join('، ')}</p>}
            {weak.length > 0 && <p style={{ margin: 0 }}>🎯 تحتاج تركيزًا: {weak.map((r) => SKILL_LABELS[r.k]).join('، ')}</p>}
          </div>
        )}
        {rated.length === 0 && <p className="small muted">تظهر النتائج بعد 3 محاولات على الأقل في كل مهارة.</p>}
      </section>

      <section className="card">
        <h2>الكلمات والعبارات</h2>
        <div className="grid2">
          <div className="stat">
            <span className="small muted">متقنة</span>
            <b>{counts.mastered}</b>
          </div>
          <div className="stat">
            <span className="small muted">قيد التعلم</span>
            <b>{counts.learning + counts.new}</b>
          </div>
          <div className="stat">
            <span className="small muted">متعثرة</span>
            <b>{counts.struggling}</b>
          </div>
          <div className="stat">
            <span className="small muted">مستحقة الآن</span>
            <b>{due.length}</b>
          </div>
        </div>
        {struggling.length > 0 && (
          <div className="kv">
            <b>تتعثر فيها</b>
            <div className="row" style={{ gap: 6 }}>
              {struggling.map((s) => (
                <span key={s.id} className="chip warn en" dir="ltr">
                  {VOCAB[s.id]?.en ?? s.id}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="row" style={{ marginTop: 12 }}>
          <Link to="/review" className="btn primary small">
            المراجعة
          </Link>
          <Link to="/words" className="btn secondary small">
            كل البطاقات
          </Link>
        </div>
      </section>

      <section className="card">
        <h2>الالتزام</h2>
        <p style={{ marginBottom: 8 }}>
          سلسلة الأيام: <b className="en">{st}</b>
        </p>
        <div className="days" aria-label="آخر 14 يومًا">
          {days.map((d) => (
            <span key={d.key} className={d.on ? 'on' : ''} title={d.key} />
          ))}
        </div>
        <p className="small muted" style={{ marginTop: 6 }}>
          آخر 14 يومًا (من اليسار للأقدم إلى اليمين لليوم).
        </p>
      </section>

      <section className="card">
        <h2>أهداف قصيرة</h2>
        {goals.map((g) => (
          <div key={g.label} className="row between" style={{ padding: '6px 0' }}>
            <span>
              {g.done ? '✅' : '⬜'} {g.label}
            </span>
            {g.note && <span className="small muted en">{g.note}</span>}
          </div>
        ))}
      </section>

      <section className="card">
        <h2>سجل الأخطاء</h2>
        {progress.mistakes.length === 0 && <p className="muted small">لا أخطاء مسجلة بعد.</p>}
        {[...progress.mistakes]
          .reverse()
          .slice(0, 15)
          .map((m) => (
            <div key={m.id} className="kv">
              <b>
                {SKILL_LABELS[m.skill]} · {new Date(m.at).toLocaleDateString('ar-SA-u-nu-latn')}
              </b>
              <div className="small">{m.prompt}</div>
              {m.given && (
                <div className="small">
                  إجابتك: <span className="en" dir="ltr" style={{ textDecoration: 'line-through' }}>{m.given}</span>
                </div>
              )}
              {m.expected && (
                <div className="small">
                  الصحيح: <span className="en" dir="ltr">{m.expected}</span>
                </div>
              )}
            </div>
          ))}
      </section>
    </div>
  );
}
