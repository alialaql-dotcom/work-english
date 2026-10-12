import { useEffect, useState } from 'react';
import type { Line, Step, VocabItem } from '../content/types';
import { SPEAKER_LABELS } from '../content/types';
import { compareWords, listenOnce, recognitionSupported, type RecognitionError } from '../lib/speech';
import { generate, rng } from '../lib/exerciseGen';
import { useG, useProgress } from '../state/ProgressContext';
import { ExerciseView } from './ExerciseView';
import { En, Icon, SpeakButton } from './ui';

// ───────── بطاقة مفردة ─────────
export function VocabCard({ item, withQuiz = true }: { item: VocabItem; withQuiz?: boolean }) {
  const [quiz, setQuiz] = useState<null | ReturnType<typeof generate>>(null);
  const [quizDone, setQuizDone] = useState<null | boolean>(null);
  return (
    <article className="card vocab-card" aria-label={`بطاقة ${item.en}`}>
      <div className="row between" style={{ alignItems: 'flex-start' }}>
        <div>
          <div className="big-en">{item.en}</div>
          <div className="ipa small">{item.ipa}</div>
        </div>
        <span className="chip">{item.kind === 'phrase' ? 'عبارة' : 'كلمة'}</span>
      </div>
      <p style={{ fontSize: '1.15rem', fontWeight: 600, margin: '10px 0 4px' }}>{item.ar}</p>
      <p className="small muted" style={{ marginBottom: 12 }}>
        تقريب عربي مساعد: «{item.arApprox}» — <span>للاستئناس فقط؛ اعتمد على الصوت.</span>
      </p>
      <SpeakButton text={item.en} />

      <div className="kv">
        <b>مثال من بيئة العمل (افتراضي)</b>
        <div className="row" style={{ gap: 6, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <En className="sentence-en">{item.example.en}</En>
            <div className="muted small">{item.example.ar}</div>
          </div>
          <SpeakButton text={item.example.en} compact label="استمع للمثال" />
        </div>
      </div>
      {item.usage && (
        <div className="kv">
          <b>الاستخدام</b>
          {item.usage}
        </div>
      )}
      {item.mistake && (
        <div className="kv">
          <b>⚠️ خطأ شائع</b>
          {item.mistake}
        </div>
      )}
      {item.related && item.related.length > 0 && (
        <div className="kv">
          <b>كلمات وتعبيرات مرتبطة</b>
          <div className="row" style={{ gap: 6 }}>
            {item.related.map((r) => (
              <span key={r} className="chip en" dir="ltr">
                {r}
              </span>
            ))}
          </div>
        </div>
      )}
      {withQuiz && (
        <div className="kv">
          {!quiz && (
            <button type="button" className="btn secondary small" onClick={() => { setQuizDone(null); setQuiz(generate(item, item.cloze ? 'cloze' : 'reverse', rng(Date.now()))); }}>
              اختبر نفسك في هذه الكلمة
            </button>
          )}
          {quiz && quizDone === null && <ExerciseView exercise={quiz} onDone={(r) => setQuizDone(r.grade !== 'again')} />}
          {quizDone !== null && (
            <div className="row between">
              <span className={`chip ${quizDone ? 'ok' : 'warn'}`}>{quizDone ? 'تمام ✓' : 'نراجعها لاحقًا'}</span>
              <button type="button" className="btn ghost small" onClick={() => { setQuiz(null); setQuizDone(null); }}>
                إغلاق
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

// ───────── شرح القاعدة ─────────
export function GrammarView({ step }: { step: Extract<Step, { kind: 'grammar' }> }) {
  return (
    <div>
      <span className="chip primary">قاعدة</span>
      <h2 style={{ marginTop: 10 }}>{step.title}</h2>
      <div className="card soft">
        <p className="en" dir="ltr" style={{ fontWeight: 700, margin: 0, textAlign: /[؀-ۿ]/.test(step.pattern) ? 'right' : 'left' }}>
          {step.pattern}
        </p>
      </div>
      <ul style={{ paddingInlineStart: 20 }}>
        {step.explanation.map((x, i) => (
          <li key={i} style={{ marginBottom: 6 }}>
            {x}
          </li>
        ))}
      </ul>
      <h3>أمثلة</h3>
      {step.examples.map((ex, i) => (
        <div className="card" key={i} style={{ padding: 14 }}>
          <div className="row" style={{ alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <En className="sentence-en">{ex.en}</En>
              <div className="muted small">{ex.ar}</div>
            </div>
            <SpeakButton text={ex.en} compact />
          </div>
        </div>
      ))}
      {step.note && <div className="banner">{step.note}</div>}
    </div>
  );
}

// ───────── الاستماع: صوت أولًا، ثم النص والترجمة، ثم أسئلة بلا نص ─────────
export function ListenView({
  step,
  onAnswer,
  onFinish,
}: {
  step: Extract<Step, { kind: 'listen' }>;
  onAnswer: (exId: string, ok: boolean, r: import('./ExerciseView').ExerciseResult) => void;
  onFinish: () => void;
}) {
  const { progress } = useProgress();
  const [phase, setPhase] = useState<'blind' | 'text' | 'questions'>('blind');
  const [q, setQ] = useState(0);
  const all = step.lines.map((l) => l.en).join(' ');
  const showAr = progress.settings.showTranslation !== 'hidden';

  if (phase === 'questions') {
    const ex = step.questions[q];
    return (
      <div>
        <span className="chip primary">
          سؤال {q + 1} من {step.questions.length} — بدون نص
        </span>
        <div style={{ marginTop: 12 }} />
        <div className="card soft">
          <SpeakButton text={all} label="أعد الاستماع للمحادثة" />
        </div>
        <ExerciseView
          key={ex.id}
          exercise={ex}
          onDone={(r) => {
            onAnswer(ex.id, r.grade !== 'again', r);
            if (q + 1 < step.questions.length) setQ(q + 1);
            else onFinish();
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <span className="chip primary">استماع</span>
      <h2 style={{ marginTop: 10 }}>{step.title}</h2>
      <p className="muted">{step.situation}</p>
      <div className="card soft">
        <SpeakButton text={all} autoPlay={phase === 'blind'} label={phase === 'blind' ? 'شغّل المحادثة' : 'أعد التشغيل'} />
        {phase === 'blind' && <p className="small muted" style={{ marginTop: 10, marginBottom: 0 }}>استمع مرة أو مرتين قبل أن ترى النص. حاول أن تلتقط الكلمات التي تعرفها.</p>}
      </div>
      {phase === 'text' && (
        <div>
          {step.lines.map((l, i) => (
            <DialogueLine key={i} line={l} showAr={showAr} />
          ))}
          {!showAr && <p className="small muted">الترجمة مخفية حسب إعداداتك.</p>}
        </div>
      )}
      <div className="sticky-actions">
        {phase === 'blind' ? (
          <button type="button" className="btn primary block" onClick={() => setPhase('text')}>
            <Icon name="eye" /> أظهر النص والترجمة
          </button>
        ) : (
          <button type="button" className="btn primary block" onClick={() => setPhase('questions')}>
            اختبر فهمك (بدون نص)
          </button>
        )}
      </div>
    </div>
  );
}

export function DialogueLine({ line, showAr = true }: { line: Line; showAr?: boolean }) {
  return (
    <div className={`line${line.speaker === 'staff' ? ' staff' : ''}`}>
      <div className="who">{SPEAKER_LABELS[line.speaker]}</div>
      <div className="bubble">
        <div className="row" style={{ alignItems: 'flex-start', gap: 6 }}>
          <div style={{ flex: 1 }}>
            <En>{line.en}</En>
            {showAr && <div className="muted small">{line.ar}</div>}
          </div>
          <SpeakButton text={line.en} compact minimal label="استمع للجملة" />
        </div>
      </div>
    </div>
  );
}

// ───────── استمع وكرّر (مع ميكروفون اختياري) ─────────
const MIC_ERRORS: Record<RecognitionError, string> = {
  'not-supported': 'متصفحك لا يدعم التعرف على الكلام. كرّر بصوت مسموع ثم تابع.',
  'not-allowed': 'لم يُسمح باستخدام الميكروفون. يمكنك السماح به من إعدادات المتصفح، أو التكرار بصوتك دون تسجيل.',
  'no-speech': 'لم نلتقط صوتًا. اقترب من الميكروفون وحاول مرة أخرى.',
  network: 'التعرف على الكلام يحتاج اتصالًا بالإنترنت في هذا المتصفح.',
  aborted: 'توقف التسجيل.',
  other: 'تعذر التعرف على الكلام هذه المرة.',
};

export function RepeatView({ step, onFinish }: { step: Extract<Step, { kind: 'repeat' }>; onFinish: () => void }) {
  const { progress } = useProgress();
  const g = useG();
  const [i, setI] = useState(0);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState<{ word: string; heard: boolean }[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const phrase = step.phrases[i];
  const micOk = progress.settings.micEnabled && recognitionSupported();

  useEffect(() => {
    setHeard(null);
    setErr(null);
  }, [i]);

  const record = async () => {
    setErr(null);
    setHeard(null);
    setListening(true);
    try {
      const r = await listenOnce('en-US').promise;
      setHeard(compareWords(phrase.en, r.transcripts));
    } catch (e) {
      setErr(MIC_ERRORS[(e as RecognitionError) ?? 'other'] ?? MIC_ERRORS.other);
    } finally {
      setListening(false);
    }
  };

  return (
    <div>
      <span className="chip primary">
        استمع وكرّر — {i + 1} / {step.phrases.length}
      </span>
      <div className="card" style={{ marginTop: 12 }}>
        <div className="big-en" style={{ fontSize: '1.35rem' }}>
          {phrase.en}
        </div>
        <p className="muted">{phrase.ar}</p>
        <SpeakButton key={i} text={phrase.en} autoPlay />
        <p className="small" style={{ marginTop: 12 }}>
          {g('كرّر الجملة بصوت مسموع مرتين أو ثلاثًا، مقلّدًا الإيقاع والنبرة.', 'كرّري الجملة بصوت مسموع مرتين أو ثلاثًا، مقلّدةً الإيقاع والنبرة.', 'كرّر الجملة بصوت مسموع مرتين أو ثلاثًا مع تقليد الإيقاع والنبرة.')}
        </p>
        {micOk && (
          <div className="kv">
            <button type="button" className="btn secondary" onClick={record} disabled={listening} aria-live="polite">
              <Icon name="mic" /> {listening ? 'أستمع إليك…' : 'سجّل وتحقق من الكلمات'}
            </button>
            {heard && (
              <div style={{ marginTop: 10 }}>
                <div className="mic-words" aria-label="الكلمات التي تعرّف عليها المتصفح">
                  {heard.map((h, k) => (
                    <span key={k} className={h.heard ? 'yes' : 'no'}>
                      {h.word}
                    </span>
                  ))}
                </div>
                <p className="small muted" style={{ marginTop: 6 }}>
                  الأخضر = كلمات تعرّف عليها المتصفح. هذا ليس تقييمًا لدقة نطقك؛ المتصفح قد يفهم نطقًا غير دقيق أو يخطئ في نطق سليم.
                </p>
              </div>
            )}
            {err && <p className="small" style={{ color: 'var(--bad)', marginTop: 8 }}>{err}</p>}
          </div>
        )}
        {!micOk && <p className="small muted">{progress.settings.micEnabled ? MIC_ERRORS['not-supported'] : 'الميكروفون متوقف من الإعدادات. كرّر بصوتك ثم تابع.'}</p>}
      </div>
      <div className="sticky-actions">
        <button type="button" className="btn primary block" onClick={() => (i + 1 < step.phrases.length ? setI(i + 1) : onFinish())}>
          {g('كرّرتها — التالي', 'كرّرتُها — التالي', 'تم التكرار — التالي')}
        </button>
      </div>
    </div>
  );
}
