import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { findLesson, nextLessonId } from '../content';
import type { Exercise, Skill, Step } from '../content/types';
import { VOCAB } from '../content/vocab';
import { ExerciseView, type ExerciseResult } from '../components/ExerciseView';
import { GrammarView, ListenView, RepeatView, VocabCard } from '../components/LessonParts';
import { BidiText, Icon, ProgressBar } from '../components/ui';
import { lessonDrill, reviewSession, type GeneratedExercise } from '../lib/exerciseGen';
import { completeLesson, introduceItems, recordAttempt, type Progress } from '../lib/progress';
import { LESSON_PASS, lessonState } from '../lib/path';
import { dueItems, type Grade } from '../lib/srs';
import { useG, useProgress } from '../state/ProgressContext';

type Section = 'review' | 'drill' | 'practice' | 'quiz';

type Screen =
  | { kind: 'intro' }
  | { kind: 'vocab'; itemId: string; first: boolean; title: string }
  | { kind: 'grammar'; step: Extract<Step, { kind: 'grammar' }> }
  | { kind: 'listen'; step: Extract<Step, { kind: 'listen' }> }
  | { kind: 'repeat'; step: Extract<Step, { kind: 'repeat' }> }
  | { kind: 'exercise'; ex: Exercise | GeneratedExercise; section: Section; title: string; index: number; count: number };

const SECTION_LABEL: Record<Section, string> = { review: 'مراجعة سريعة', drill: 'تدريب', practice: 'تطبيق', quiz: 'اختبار الدرس' };

export function gradeScore(g: Grade): number {
  return g === 'good' ? 1 : g === 'hard' ? 0.6 : 0;
}

function buildScreens(steps: Step[], p: Progress, seed: number): Screen[] {
  const out: Screen[] = [{ kind: 'intro' }];
  for (const s of steps) {
    if (s.kind === 'review') {
      const due = dueItems(p.items, Date.now(), 4);
      const exs = reviewSession(due, seed);
      exs.forEach((ex, i) => out.push({ kind: 'exercise', ex, section: 'review', title: s.title ?? SECTION_LABEL.review, index: i, count: exs.length }));
    } else if (s.kind === 'vocab') {
      s.itemIds.forEach((id, i) => out.push({ kind: 'vocab', itemId: id, first: i === 0, title: `${s.title} (${i + 1}/${s.itemIds.length})` }));
    } else if (s.kind === 'grammar') out.push({ kind: 'grammar', step: s });
    else if (s.kind === 'listen') out.push({ kind: 'listen', step: s });
    else if (s.kind === 'repeat') out.push({ kind: 'repeat', step: s });
    else if (s.kind === 'drill') {
      const exs = lessonDrill(s.itemIds, seed);
      exs.forEach((ex, i) => out.push({ kind: 'exercise', ex, section: 'drill', title: s.title, index: i, count: exs.length }));
    } else {
      const section: Section = s.kind;
      s.exercises.forEach((ex, i) => out.push({ kind: 'exercise', ex, section, title: s.title, index: i, count: s.exercises.length }));
    }
  }
  return out;
}

interface Outcome {
  exId: string;
  section: Section | 'listen';
  grade: Grade;
  prompt: string;
  given: string;
  expected: string;
  explain?: string;
}

export function LessonPage() {
  const { lessonId = '' } = useParams();
  const lesson = findLesson(lessonId);
  const { progress, update } = useProgress();
  const g = useG();
  const navigate = useNavigate();
  const [seed] = useState(() => Date.now() % 100000);
  const screens = useMemo(() => (lesson ? buildScreens(lesson.steps, progress, seed) : []), [lesson, seed]); // eslint-disable-line react-hooks/exhaustive-deps
  const [idx, setIdx] = useState(0);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [finished, setFinished] = useState<null | { score: number; passed: boolean }>(null);
  const [confirmExit, setConfirmExit] = useState(false);
  const startedAt = useRef(Date.now());
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mainRef.current?.focus();
    window.scrollTo?.(0, 0);
  }, [idx, finished]);

  if (!lesson) {
    return (
      <div className="card">
        <h2>الدرس غير موجود</h2>
        <Link className="btn primary" to="/path">
          العودة للمسار
        </Link>
      </div>
    );
  }
  const state = lessonState(progress, lesson.id);
  if (state === 'locked') {
    return (
      <div className="card">
        <h2>هذا الدرس مقفل حاليًا</h2>
        <p>{g('أكمل الدرس السابق أولًا (بنتيجة 60% أو أكثر في اختباره القصير).', 'أكملي الدرس السابق أولًا (بنتيجة 60% أو أكثر في اختباره القصير).', 'يُفتح بعد إكمال الدرس السابق بنتيجة 60% أو أكثر.')}</p>
        <Link className="btn primary" to="/path">
          العودة للمسار
        </Link>
      </div>
    );
  }

  const screen = screens[idx];
  const next = () => {
    if (idx + 1 < screens.length) setIdx(idx + 1);
    else finish();
  };

  const finish = () => {
    const quiz = outcomes.filter((o) => o.section === 'quiz');
    const score = quiz.length ? quiz.reduce((s, o) => s + gradeScore(o.grade), 0) / quiz.length : 1;
    const seconds = Math.min(1800, Math.round((Date.now() - startedAt.current) / 1000));
    update((p, now, dev) => completeLesson(p, lesson.id, score, seconds, now, dev));
    setFinished({ score, passed: score >= LESSON_PASS });
  };

  const record = (ex: Exercise | GeneratedExercise, section: Section | 'listen', r: ExerciseResult) => {
    const mode = 'mode' in ex ? ex.mode : ex.type;
    setOutcomes((o) => [...o, { exId: ex.id, section, grade: r.grade, prompt: ex.prompt, given: r.given, expected: r.expected, explain: ex.explain }]);
    update((p, now, dev) =>
      recordAttempt(p, { exerciseId: ex.id, skill: ex.skill as Skill, itemIds: ex.itemIds ?? [], mode, grade: r.grade, prompt: ex.prompt, given: r.given, expected: r.expected }, now, dev),
    );
  };

  if (finished) {
    const missed = outcomes.filter((o) => o.grade === 'again');
    const nextId = nextLessonId(lesson.id);
    return (
      <div ref={mainRef} tabIndex={-1}>
        <div className={`card ${finished.passed ? 'primary' : ''}`}>
          <h1>{finished.passed ? g('أكملت الدرس!', 'أكملتِ الدرس!', 'اكتمل الدرس!') : 'انتهى الدرس'}</h1>
          <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }} className="en">
            {Math.round(finished.score * 100)}%
          </p>
          <p className="muted" style={{ marginBottom: 0 }}>
            نتيجة اختبار الدرس. {finished.passed ? 'تم فتح الدرس التالي.' : `تحتاج ${Math.round(LESSON_PASS * 100)}% لفتح الدرس التالي.`}
          </p>
        </div>
        <div className="card soft">
          <p style={{ margin: 0 }}>
            ستظهر كلمات هذا الدرس في المراجعة على فترات متباعدة. الكلمة لا تُعتبر «متقنة» إلا بعد أن تتذكرها عدة مرات، في أنواع تمارين مختلفة، وعلى مدى أيام.
          </p>
        </div>
        {missed.length > 0 && (
          <div className="card">
            <h2>نقاط تحتاج مراجعة</h2>
            {missed.map((m, i) => (
              <div key={i} className="kv">
                <b>{m.prompt}</b>
                <div>
                  الصحيح: <span className="en" dir="ltr">{m.expected}</span>
                </div>
                {m.explain && <div className="small muted">{m.explain}</div>}
              </div>
            ))}
            <p className="small muted" style={{ marginTop: 10 }}>سُجلت في «سجل الأخطاء» وستعود إليك في المراجعة بصيغة مختلفة.</p>
          </div>
        )}
        <div className="stack">
          {finished.passed && nextId && (
            <button type="button" className="btn primary block" onClick={() => navigate(`/lesson/${nextId}`)}>
              الدرس التالي
            </button>
          )}
          {!finished.passed && (
            <button
              type="button"
              className="btn primary block"
              onClick={() => {
                setOutcomes([]);
                setFinished(null);
                setIdx(1);
                startedAt.current = Date.now();
              }}
            >
              أعد الدرس
            </button>
          )}
          <Link className="btn secondary block" to="/">
            الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const progressPct = idx / screens.length;
  const exit = () => {
    if (idx === 0) navigate('/');
    else setConfirmExit(true);
  };

  return (
    <div>
      <div className="lesson-head">
        <button type="button" className="btn ghost icon" onClick={exit} aria-label="خروج من الدرس">
          <Icon name="x" />
        </button>
        <ProgressBar value={progressPct} label="التقدم في الدرس" />
        <span className="small muted en" aria-hidden>
          {idx + 1}/{screens.length}
        </span>
      </div>
      {confirmExit && (
        <div className="banner bad" role="alertdialog" aria-label="تأكيد الخروج">
          <p style={{ marginTop: 0 }}>الخروج الآن يحفظ إجاباتك، لكن الدرس لن يُحسب مكتملًا.</p>
          <div className="row">
            <button type="button" className="btn danger small" onClick={() => navigate('/')}>
              اخرج
            </button>
            <button type="button" className="btn secondary small" autoFocus onClick={() => setConfirmExit(false)}>
              أكمل الدرس
            </button>
          </div>
        </div>
      )}
      <div ref={mainRef} tabIndex={-1} style={{ outline: 'none' }}>
        {screen.kind === 'intro' && (
          <div>
            <span className="chip">{lesson.minutes} دقائق تقريبًا</span>
            <h1 style={{ marginTop: 10 }}>{lesson.title}</h1>
            <p className="en muted" dir="ltr" style={{ textAlign: 'right' }}>
              {lesson.titleEn}
            </p>
            <div className="card soft">
              <b>هدف الدرس</b>
              <p style={{ margin: 0 }}>
                <BidiText text={lesson.goal} />
              </p>
            </div>
            <p className="small muted">
              تحتاج سماعة أو مكبر صوت. المحادثات افتراضية للتدريب، وأي أسعار فيها أمثلة فقط وليست أسعارًا حقيقية.
            </p>
            <div className="sticky-actions">
              <button type="button" className="btn primary block" onClick={next} autoFocus>
                ابدأ
              </button>
            </div>
          </div>
        )}
        {screen.kind === 'vocab' && (
          <VocabScreen
            itemId={screen.itemId}
            title={screen.title}
            onSeen={() => update((p, now) => introduceItems(p, [screen.itemId], now))}
            onNext={next}
          />
        )}
        {screen.kind === 'grammar' && (
          <>
            <GrammarView step={screen.step} />
            <div className="sticky-actions">
              <button type="button" className="btn primary block" onClick={next}>
                فهمت — التالي
              </button>
            </div>
          </>
        )}
        {screen.kind === 'listen' && (
          <ListenView
            step={screen.step}
            onAnswer={(exId, _ok, r) => {
              const ex = screen.step.questions.find((q) => q.id === exId)!;
              record(ex, 'listen', r);
            }}
            onFinish={next}
          />
        )}
        {screen.kind === 'repeat' && <RepeatView step={screen.step} onFinish={next} />}
        {screen.kind === 'exercise' && (
          <div>
            <span className="chip primary">
              {screen.title} · {screen.index + 1}/{screen.count}
            </span>
            <div style={{ marginTop: 12 }} />
            <ExerciseView
              key={`${idx}-${screen.ex.id}`}
              exercise={screen.ex}
              onDone={(r) => {
                record(screen.ex, screen.section, r);
                next();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function VocabScreen({ itemId, title, onSeen, onNext }: { itemId: string; title: string; onSeen: () => void; onNext: () => void }) {
  useEffect(() => {
    onSeen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);
  const item = VOCAB[itemId];
  return (
    <div>
      <span className="chip primary">{title}</span>
      <div style={{ marginTop: 12 }} />
      <VocabCard key={itemId} item={item} withQuiz={false} />
      <div className="sticky-actions">
        <button type="button" className="btn primary block" onClick={onNext}>
          التالي
        </button>
      </div>
    </div>
  );
}
