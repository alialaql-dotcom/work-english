import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ExerciseRunner, type RunnerOutcome } from '../components/ExerciseRunner';
import { generate, reviewSession, rng, type GenMode, type GeneratedExercise } from '../lib/exerciseGen';
import { finishReview, recordAttempt } from '../lib/progress';
import { dueItems, isStruggling, type ItemState } from '../lib/srs';
import { VOCAB } from '../content/vocab';
import { VocabCard } from '../components/LessonParts';
import { useG, useProgress } from '../state/ProgressContext';

function formatDue(ms: number): string {
  const h = Math.round(ms / 3600_000);
  if (h < 1) return 'خلال أقل من ساعة';
  if (h < 24) return `بعد ${h} ساعة تقريبًا`;
  return `بعد ${Math.round(h / 24)} يوم تقريبًا`;
}

export function ReviewPage() {
  const { progress, update } = useProgress();
  const g = useG();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'start' | 'cards' | 'run' | 'done'>('start');
  const [practice, setPractice] = useState(false);
  const [queue, setQueue] = useState<GeneratedExercise[]>([]);
  const [summary, setSummary] = useState<{ ok: number; total: number; weak: string[] } | null>(null);
  const retried = useRef(new Set<string>());
  const started = useRef(0);
  const now = Date.now();

  const due = useMemo(() => dueItems(progress.items, now, 15), [progress.items]); // eslint-disable-line react-hooks/exhaustive-deps
  const struggling = due.filter(isStruggling);
  const nextDue = useMemo(() => {
    const future = Object.values(progress.items).filter((s) => s.due > now).sort((a, b) => a.due - b.due);
    return future[0];
  }, [progress.items]); // eslint-disable-line react-hooks/exhaustive-deps
  const practicePool = useMemo(
    () => Object.values(progress.items).filter((s) => !s.mastered).sort((a, b) => b.lapses - a.lapses || a.due - b.due).slice(0, 8),
    [progress.items],
  );

  const begin = (items: ItemState[], isPractice: boolean) => {
    setPractice(isPractice);
    setQueue(reviewSession(items, Date.now() % 10000));
    retried.current = new Set();
    started.current = Date.now();
    setMode(items.some(isStruggling) ? 'cards' : 'run');
  };

  const onAnswer = (o: RunnerOutcome): number => {
    const ex = o.ex as GeneratedExercise;
    update((p, t, dev) =>
      recordAttempt(p, { exerciseId: ex.id, skill: ex.skill, itemIds: ex.itemIds ?? [], mode: ex.mode, grade: o.result.grade, prompt: ex.prompt, given: o.result.given, expected: o.result.expected }, t, dev),
    );
    // خطأ: نعيد اختبار العنصر في آخر الجلسة بنوع تمرين مختلف (مرة واحدة)
    if (o.result.grade === 'again' && !retried.current.has(ex.itemId)) {
      retried.current.add(ex.itemId);
      const alt: GenMode = ex.mode === 'meaning' ? 'listen' : 'meaning';
      setQueue((q) => [...q, generate(VOCAB[ex.itemId], alt, rng(Date.now()))]);
      return 1;
    }
    return 0;
  };

  if (mode === 'cards') {
    const cards = (practice ? practicePool : due).filter(isStruggling);
    return (
      <div>
        <h1>قبل المراجعة: كلمات تتعثر فيها</h1>
        <p className="muted">{g('اقرأ البطاقة واستمع لها مرة، ثم سنختبرك بتمرين أسهل أولًا.', 'اقرئي البطاقة واستمعي لها مرة، ثم سنختبرك بتمرين أسهل أولًا.', 'راجع البطاقة واستمع لها، ثم يأتي تمرين أسهل أولًا.')}</p>
        {cards.map((s) => (
          <VocabCard key={s.id} item={VOCAB[s.id]} withQuiz={false} />
        ))}
        <div className="sticky-actions">
          <button type="button" className="btn primary block" onClick={() => setMode('run')}>
            ابدأ المراجعة
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'run') {
    return (
      <ExerciseRunner
        exercises={queue}
        title={practice ? 'تدريب إضافي' : 'المراجعة'}
        onAnswer={onAnswer}
        onExit={() => navigate('/')}
        onComplete={(all) => {
          const ok = all.filter((o) => o.result.grade !== 'again').length;
          const weak = [...new Set(all.filter((o) => o.result.grade === 'again').map((o) => (o.ex as GeneratedExercise).itemId))];
          const secs = Math.min(1800, Math.round((Date.now() - started.current) / 1000));
          update((p, t, dev) => finishReview(p, all.length, secs, t, dev));
          setSummary({ ok, total: all.length, weak });
          setMode('done');
        }}
      />
    );
  }

  if (mode === 'done' && summary) {
    return (
      <div>
        <div className="card primary">
          <h1>{g('أنهيت المراجعة', 'أنهيتِ المراجعة', 'انتهت المراجعة')}</h1>
          <p style={{ margin: 0 }}>
            {summary.ok} من {summary.total} صحيحة.
          </p>
        </div>
        {summary.weak.length > 0 && (
          <div className="card">
            <h2>ستعود إليك قريبًا</h2>
            <div className="row">
              {summary.weak.map((id) => (
                <span key={id} className="chip warn en" dir="ltr">
                  {VOCAB[id].en}
                </span>
              ))}
            </div>
          </div>
        )}
        {practice && <p className="small muted">التدريب الإضافي يقوّي الذاكرة، لكنه لا يسرّع جدول المراجعة إذا كان في نفس اليوم — الإتقان يُقاس على مدى أيام.</p>}
        <Link to="/" className="btn primary block">
          الرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1>المراجعة</h1>
      {due.length > 0 ? (
        <div className="card">
          <p style={{ fontSize: '1.1rem' }}>
            <b className="en">{due.length}</b> {due.length === 1 ? 'عنصر مستحق' : 'عناصر مستحقة'} للمراجعة الآن.
          </p>
          {struggling.length > 0 && <p className="small">منها {struggling.length} تتعثر فيها — سنبدأ بها بتمارين أسهل.</p>}
          <button type="button" className="btn primary block" onClick={() => begin(due, false)}>
            ابدأ المراجعة
          </button>
        </div>
      ) : (
        <div className="card soft">
          <p style={{ marginBottom: 4 }}>{Object.keys(progress.items).length === 0 ? 'لا توجد كلمات بعد. ستظهر هنا بعد أول درس.' : 'لا شيء مستحق للمراجعة الآن. ممتاز!'}</p>
          {nextDue && <p className="small muted" style={{ margin: 0 }}>المراجعة القادمة {formatDue(nextDue.due - now)}.</p>}
        </div>
      )}
      {practicePool.length > 0 && (
        <div className="card">
          <h2>تدريب إضافي</h2>
          <p className="small muted">على الكلمات غير المتقنة بعد، خارج الجدول.</p>
          <button type="button" className="btn secondary block" onClick={() => begin(practicePool, true)}>
            تدرّب على {practicePool.length} كلمات
          </button>
        </div>
      )}
      <div className="card soft small">
        <b>كيف تعمل المراجعة؟</b>
        <p style={{ margin: 0 }}>
          كل كلمة تعود إليك قبل أن تنساها: بعد يوم، ثم 3 أيام، ثم أسبوع وأكثر. إذا أخطأت تعود قريبًا وبتمرين مختلف. تُعتبر الكلمة «متقنة» بعد أن تتذكرها 3 مرات متتالية على فترات متباعدة وفي نوعين مختلفين من التمارين على الأقل.
        </p>
      </div>
    </div>
  );
}
