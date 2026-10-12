import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChoiceExercise, DialogueExercise, Exercise, FillExercise, OrderExercise, TypeExercise } from '../content/types';
import { SPEAKER_LABELS } from '../content/types';
import { checkOrder, checkText, firstLettersHint, normalize } from '../lib/answer';
import { rng, shuffle } from '../lib/exerciseGen';
import type { Grade } from '../lib/srs';
import { useG } from '../state/ProgressContext';
import { En, Icon, SpeakButton } from './ui';

export interface ExerciseResult {
  grade: Grade;
  given: string;
  expected: string;
}

interface Props {
  exercise: Exercise;
  onDone: (r: ExerciseResult) => void;
}

type Phase = 'input' | 'correct' | 'revealed';

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function expectedText(e: Exercise): string {
  switch (e.type) {
    case 'choice':
      return e.options[e.answer];
    case 'fill':
      return e.sentence.replace('___', e.answers[0]);
    case 'order':
      return e.words.join(' ');
    case 'type':
      return e.model ?? e.answers[0];
    case 'dialogue':
      return '';
  }
}

function autoHint(e: Exercise, level: number): string | null {
  const custom = e.hints?.[level];
  if (custom) return custom;
  if (e.type === 'type') return level === 0 ? `ابدأ هكذا: ${e.answers[0].split(' ').slice(0, 2).join(' ')} …` : `الحروف الأولى: ${firstLettersHint(e.answers[0])}`;
  if (e.type === 'fill') return `الكلمة تبدأ بحرف: ${e.answers[0][0]}`;
  if (e.type === 'order') return `الجملة تبدأ بـ: ${e.words[0]}`;
  if (e.type === 'choice') return e.audio ? 'استمع مرة أخرى بالسرعة البطيئة، ثم اختر. محاولة أخيرة.' : 'اقرأ الخيارات المتبقية بتمعّن. محاولة أخيرة.';
  return null;
}

export function ExerciseView({ exercise, onDone }: Props) {
  if (exercise.type === 'dialogue') return <DialogueView key={exercise.id} exercise={exercise} onDone={onDone} />;
  return <SingleExercise key={exercise.id} exercise={exercise} onDone={onDone} />;
}

function SingleExercise({ exercise: e, onDone }: Props) {
  const g = useG();
  const [phase, setPhase] = useState<Phase>('input');
  const [tries, setTries] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [typo, setTypo] = useState<string | null>(null);
  const [given, setGiven] = useState('');
  const [wrongMsg, setWrongMsg] = useState<string | null>(null);
  const maxTries = e.type === 'choice' ? 2 : 3;
  const expected = expectedText(e);
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase !== 'input' || wrongMsg) feedbackRef.current?.focus();
  }, [phase, wrongMsg]);

  const submit = (ok: boolean, givenText: string, isTypo = false, expectedOverride?: string) => {
    setGiven(givenText);
    if (ok) {
      if (isTypo) setTypo(expectedOverride ?? expected);
      setPhase('correct');
      return;
    }
    const t = tries + 1;
    setTries(t);
    if (t >= maxTries) {
      setPhase('revealed');
      setWrongMsg(null);
    } else {
      setHintUsed(true);
      setWrongMsg(autoHint(e, t - 1));
    }
  };

  const finish = () => {
    const gradeV: Grade = phase === 'revealed' ? 'again' : tries === 0 && !hintUsed && !typo ? 'good' : 'hard';
    onDone({ grade: gradeV, given, expected });
  };

  return (
    <div>
      <div className="prompt">{e.prompt}</div>

      {e.type === 'choice' && <ChoiceInput e={e} phase={phase} onSubmit={submit} />}
      {e.type === 'fill' && <FillInput e={e} phase={phase} onSubmit={submit} />}
      {e.type === 'order' && <OrderInput e={e} phase={phase} onSubmit={submit} />}
      {e.type === 'type' && <TypeInput e={e} phase={phase} onSubmit={submit} />}

      <div ref={feedbackRef} tabIndex={-1} aria-live="polite">
        {phase === 'input' && wrongMsg && (
          <div className="feedback hint">
            <h3>{g('ليس تمامًا، حاول مرة أخرى', 'ليس تمامًا، حاولي مرة أخرى', 'ليس تمامًا، جرّب مرة أخرى')}</h3>
            <p>💡 {wrongMsg}</p>
            <button type="button" className="btn ghost small" onClick={() => { setPhase('revealed'); setWrongMsg(null); }}>
              أظهر الإجابة
            </button>
          </div>
        )}
        {phase === 'correct' && (
          <div className="feedback ok">
            <h3>✓ {tries === 0 && !typo ? g('أحسنت!', 'أحسنتِ!', 'إجابة صحيحة!') : 'صحيح'}</h3>
            {typo && (
              <p>
                انتبه للإملاء: <En>{typo}</En>
              </p>
            )}
            {e.type === 'type' && e.model && normalize(given) !== normalize(e.model) && (
              <p>
                صيغة نموذجية: <En>{e.model}</En>
              </p>
            )}
            {isEnglish(expected) && <SpeakButton text={expected} compact label="استمع للإجابة" />}
          </div>
        )}
        {phase === 'revealed' && (
          <div className="feedback bad">
            <h3>الإجابة الصحيحة</h3>
            <p className={isEnglish(expected) ? 'sentence-en' : ''}>{expected}</p>
            {e.explain && <p>{e.explain}</p>}
            {!e.explain && <p className="muted small">سنعيد هذا السؤال لاحقًا في سياق مختلف.</p>}
            {isEnglish(expected) && <SpeakButton text={expected} compact label="استمع" />}
          </div>
        )}
      </div>

      {phase !== 'input' && (
        <div className="sticky-actions">
          <button type="button" className="btn primary block" onClick={finish} autoFocus>
            متابعة
          </button>
        </div>
      )}
    </div>
  );
}

function isEnglish(s: string) {
  return /[A-Za-z]/.test(s) && !/[؀-ۿ]/.test(s);
}

// ───────── اختيار من متعدد ─────────
function ChoiceInput({ e, phase, onSubmit }: { e: ChoiceExercise; phase: Phase; onSubmit: (ok: boolean, given: string) => void }) {
  const [wrongPicks, setWrongPicks] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const showAudioText = !e.hideAudioText || phase !== 'input';
  const ltr = e.optionsDir === 'ltr' || e.options.every((o) => isEnglish(o) || /^[\d,\s–-]+$/.test(o));

  const pick = (i: number) => {
    if (phase !== 'input') return;
    setPicked(i);
    if (i !== e.answer) setWrongPicks((w) => [...w, i]);
    onSubmit(i === e.answer, e.options[i]);
  };

  return (
    <>
      {e.audio && (
        <div className="card soft">
          <SpeakButton text={e.audio} autoPlay />
          {showAudioText ? (
            <p className="sentence-en" style={{ marginTop: 12 }}>
              {e.audio}
            </p>
          ) : (
            <p className="muted small" style={{ marginTop: 10, marginBottom: 0 }}>
              النص مخفي حتى تجيب — ركّز على السمع.
            </p>
          )}
        </div>
      )}
      <div className="options" role="group" aria-label="الخيارات">
        {e.options.map((o, i) => {
          const isWrong = wrongPicks.includes(i);
          const isCorrect = phase !== 'input' && i === e.answer;
          const disabled = phase !== 'input' || isWrong;
          return (
            <button
              key={i}
              type="button"
              className={`btn option${ltr ? ' en' : ''}${isCorrect ? ' correct' : ''}${isWrong ? ' wrong' : ''}${picked === i && !isWrong && !isCorrect ? ' selected' : ''}`}
              dir={ltr ? 'ltr' : undefined}
              disabled={disabled && !isCorrect}
              onClick={() => pick(i)}
              aria-pressed={picked === i}
            >
              {isCorrect && <Icon name="check" />}
              {o}
            </button>
          );
        })}
      </div>
    </>
  );
}

// ───────── إكمال الفراغ ─────────
function FillInput({ e, phase, onSubmit }: { e: FillExercise; phase: Phase; onSubmit: (ok: boolean, given: string, typo?: boolean, exp?: string) => void }) {
  const [value, setValue] = useState('');
  const [parts] = useState(() => e.sentence.split('___'));
  const check = (v: string) => {
    const r = checkText(v, e.answers);
    onSubmit(r.status !== 'wrong', v, r.status === 'typo', e.sentence.replace('___', r.expected));
  };
  return (
    <>
      <div className="card soft">
        <p className="sentence-en" style={{ marginBottom: e.ar ? 6 : 0 }}>
          {parts[0]}
          <span style={{ borderBottom: '2px solid var(--primary)', padding: '0 6px', minWidth: 48, display: 'inline-block', textAlign: 'center', color: 'var(--primary)' }}>
            {phase === 'input' ? value || '   ' : e.answers[0]}
          </span>
          {parts[1]}
        </p>
        {e.ar && <p className="muted small" style={{ margin: 0 }}>{e.ar}</p>}
      </div>
      {e.bank ? (
        <div className="wordbank" role="group" aria-label="اختر الكلمة">
          {e.bank.map((w) => (
            <button key={w} type="button" className="word" disabled={phase !== 'input'} onClick={() => { setValue(w); check(w); }}>
              {w}
            </button>
          ))}
        </div>
      ) : (
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            if (value.trim()) check(value);
          }}
        >
          <input className="input en" dir="ltr" value={value} onChange={(ev) => setValue(ev.target.value)} disabled={phase !== 'input'} autoCapitalize="off" autoComplete="off" spellCheck={false} aria-label="اكتب الكلمة" />
          {phase === 'input' && (
            <button className="btn primary block" style={{ marginTop: 12 }} disabled={!value.trim()}>
              تحقق
            </button>
          )}
        </form>
      )}
    </>
  );
}

// ───────── ترتيب الكلمات ─────────
function OrderInput({ e, phase, onSubmit }: { e: OrderExercise; phase: Phase; onSubmit: (ok: boolean, given: string) => void }) {
  const shuffled = useMemo(() => {
    const idx = e.words.map((_, i) => i);
    let s = shuffle(idx, rng(hashSeed(e.id)));
    if (s.every((v, i) => v === i)) s = [...s.slice(1), s[0]];
    return s;
  }, [e]);
  const [chosen, setChosen] = useState<number[]>([]);
  const words = chosen.map((i) => e.words[i]);
  return (
    <>
      <p className="muted">{e.ar}</p>
      <div className="answer-line" aria-label="جملتك">
        {chosen.length === 0 && <span className="muted small" dir="rtl">اضغط الكلمات بالترتيب</span>}
        {chosen.map((i, k) => (
          <button key={k} type="button" className="word" disabled={phase !== 'input'} onClick={() => setChosen((c) => c.filter((_, j) => j !== k))} aria-label={`إزالة ${e.words[i]}`}>
            {e.words[i]}
          </button>
        ))}
      </div>
      <div className="wordbank">
        {shuffled.map((i) => (
          <button key={i} type="button" className={`word${chosen.includes(i) ? ' used' : ''}`} disabled={phase !== 'input' || chosen.includes(i)} onClick={() => setChosen((c) => [...c, i])}>
            {e.words[i]}
          </button>
        ))}
      </div>
      {phase === 'input' && (
        <div className="row" style={{ marginTop: 16 }}>
          <button type="button" className="btn secondary" onClick={() => setChosen([])} disabled={!chosen.length}>
            مسح
          </button>
          <button
            type="button"
            className="btn primary"
            style={{ flex: 1 }}
            disabled={chosen.length !== e.words.length}
            onClick={() => {
              const ok = checkOrder(words, e.words, e.alternatives);
              onSubmit(ok, words.join(' '));
              if (!ok) setChosen([]);
            }}
          >
            تحقق
          </button>
        </div>
      )}
    </>
  );
}

// ───────── الكتابة ─────────
function TypeInput({ e, phase, onSubmit }: { e: TypeExercise; phase: Phase; onSubmit: (ok: boolean, given: string, typo?: boolean, exp?: string) => void }) {
  const [value, setValue] = useState(e.starter ? `${e.starter} ` : '');
  return (
    <>
      {e.context && (
        <div className="line">
          <div className="who">{SPEAKER_LABELS[e.context.speaker]}</div>
          <div className="bubble">
            <En>{e.context.en}</En>
            <div className="muted small">{e.context.ar}</div>
          </div>
        </div>
      )}
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          if (!value.trim()) return;
          const r = checkText(value, e.answers, e.requiredWords);
          onSubmit(r.status !== 'wrong', value, r.status === 'typo', r.expected);
        }}
      >
        <textarea
          className="input en"
          dir="ltr"
          value={value}
          onChange={(ev) => setValue(ev.target.value)}
          disabled={phase !== 'input'}
          autoCapitalize="sentences"
          autoComplete="off"
          spellCheck={false}
          aria-label="اكتب إجابتك بالإنجليزية"
          rows={2}
        />
        {e.starter && phase === 'input' && <p className="muted small">بدأنا لك الجملة. أكملها.</p>}
        {phase === 'input' && (
          <button className="btn primary block" style={{ marginTop: 12 }} disabled={!value.trim()}>
            تحقق
          </button>
        )}
      </form>
    </>
  );
}

// ───────── محادثة متعددة الأدوار ─────────
function DialogueView({ exercise: e, onDone }: { exercise: DialogueExercise; onDone: (r: ExerciseResult) => void }) {
  const g = useG();
  const [turn, setTurn] = useState(0);
  const [wrong, setWrong] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [anyHint, setAnyHint] = useState(false);
  const [anyRevealed, setAnyRevealed] = useState(false);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  // نتقدم تلقائيًا عبر أدوار العميل حتى نصل لدور الموظف
  useEffect(() => {
    if (turn < e.turns.length && e.turns[turn].speaker !== 'staff') {
      const t = setTimeout(() => setTurn((x) => x + 1), 50);
      return () => clearTimeout(t);
    }
  }, [turn, e.turns]);

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
  }, [turn, wrong, revealed]);

  const visible = e.turns.slice(0, turn + 1);
  const current = e.turns[turn];
  const finished = turn >= e.turns.length;
  const lastCustomer = [...visible].reverse().find((t) => t.speaker !== 'staff') as { en: string } | undefined;

  return (
    <div>
      <div className="prompt">{e.prompt}</div>
      <p className="muted small">محادثة افتراضية للتدريب.</p>
      {visible.map((t, i) => {
        if (t.speaker !== 'staff') {
          return (
            <div className="line" key={i}>
              <div className="who">{SPEAKER_LABELS[t.speaker]}</div>
              <div className="bubble">
                <En>{t.en}</En>
                <div className="muted small">{t.ar}</div>
              </div>
            </div>
          );
        }
        if (i < turn) {
          return (
            <div className="line staff" key={i}>
              <div className="who">أنت</div>
              <div className="bubble">
                <En>{t.options[t.answer]}</En>
                <div className="muted small">{t.ar}</div>
              </div>
            </div>
          );
        }
        return null;
      })}

      {!finished && current?.speaker === 'staff' && (
        <div className="card soft" aria-live="polite">
          {lastCustomer && !lastCustomer.en.startsWith('(') && <SpeakButton key={turn} text={lastCustomer.en} compact label="استمع للعميل" />}
          <p style={{ marginTop: 10, fontWeight: 600 }}>{g('اختر ردك:', 'اختاري ردك:', 'اختر الرد:')}</p>
          <div className="options">
            {current.options.map((o, i) => {
              const isWrong = wrong.includes(i);
              const isCorrect = revealed && i === current.answer;
              return (
                <button
                  key={i}
                  type="button"
                  dir="ltr"
                  className={`btn option en${isWrong ? ' wrong' : ''}${isCorrect ? ' correct' : ''}`}
                  disabled={isWrong || revealed}
                  onClick={() => {
                    if (i === current.answer) {
                      setWrong([]);
                      setRevealed(false);
                      setTurn((x) => x + 1);
                    } else {
                      setMistakes((m) => [...m, o]);
                      const w = [...wrong, i];
                      setWrong(w);
                      setAnyHint(true);
                      if (w.length >= 2 || w.length >= current.options.length - 1) {
                        setRevealed(true);
                        setAnyRevealed(true);
                      }
                    }
                  }}
                >
                  {o}
                </button>
              );
            })}
          </div>
          {wrong.length > 0 && !revealed && <p className="small" style={{ marginTop: 10 }}>💡 {current.explain ?? 'فكّر: أي رد مهذب وصحيح لغويًا يناسب ما قاله العميل؟'}</p>}
          {revealed && (
            <div className="feedback bad">
              <p style={{ margin: 0 }}>
                الرد المناسب: <En>{current.options[current.answer]}</En>
              </p>
              {current.explain && <p className="small" style={{ margin: 0 }}>{current.explain}</p>}
              <button
                type="button"
                className="btn primary small"
                style={{ marginTop: 10 }}
                onClick={() => {
                  setWrong([]);
                  setRevealed(false);
                  setTurn((x) => x + 1);
                }}
              >
                متابعة المحادثة
              </button>
            </div>
          )}
        </div>
      )}
      <div ref={endRef} />

      {finished && (
        <>
          <div className="feedback ok">
            <h3>{anyRevealed ? 'انتهت المحادثة — راجع الردود التي ظهرت لك' : anyHint ? 'أكملت المحادثة مع بعض المساعدة' : g('محادثة ممتازة!', 'محادثة ممتازة!', 'محادثة ممتازة!')}</h3>
            <p className="small" style={{ margin: 0 }}>اقرأ المحادثة كاملة بصوت مسموع مرة واحدة قبل أن تتابع.</p>
          </div>
          <div className="sticky-actions">
            <button
              type="button"
              className="btn primary block"
              autoFocus
              onClick={() =>
                onDone({
                  grade: anyRevealed ? 'again' : anyHint ? 'hard' : 'good',
                  given: mistakes.join(' | '),
                  expected: e.turns.filter((t) => t.speaker === 'staff').map((t) => ('options' in t ? t.options[t.answer] : '')).join(' / '),
                })
              }
            >
              متابعة
            </button>
          </div>
        </>
      )}
    </div>
  );
}
