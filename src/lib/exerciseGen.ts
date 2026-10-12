// توليد تمارين من بطاقات المفردات — بدون أي ذكاء اصطناعي، بقواعد ثابتة قابلة للاختبار.
import type { ChoiceExercise, Exercise, FillExercise, TypeExercise, VocabItem } from '../content/types';
import { VOCAB_LIST, VOCAB } from '../content/vocab';
import { isStruggling, type ItemState } from './srs';

export type GenMode = 'meaning' | 'reverse' | 'listen' | 'cloze' | 'produce';

export type GeneratedExercise = Exercise & { mode: GenMode; itemId: string };

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function distractors(item: VocabItem, n: number, rand: () => number, key: 'en' | 'ar'): string[] {
  const sameKind = VOCAB_LIST.filter((v) => v.id !== item.id && v.kind === item.kind && v[key] !== item[key]);
  const pool = sameKind.length >= n ? sameKind : VOCAB_LIST.filter((v) => v.id !== item.id && v[key] !== item[key]);
  return shuffle(pool, rand).slice(0, n).map((v) => v[key]);
}

function choice(item: VocabItem, mode: 'meaning' | 'reverse' | 'listen', rand: () => number): GeneratedExercise {
  const key = mode === 'reverse' ? 'en' : 'ar';
  const opts = shuffle([item[key], ...distractors(item, 2, rand, key)], rand);
  const base: ChoiceExercise = {
    id: `gen:${mode}:${item.id}`,
    type: 'choice',
    skill: mode === 'listen' ? 'listening' : 'vocab',
    itemIds: [item.id],
    prompt:
      mode === 'meaning' ? `ما معنى: ${item.en}` : mode === 'reverse' ? `كيف تقول بالإنجليزية: «${item.ar}»؟` : 'استمع: ما المعنى؟',
    audio: mode === 'reverse' ? undefined : item.en,
    hideAudioText: mode === 'listen',
    options: opts,
    answer: opts.indexOf(item[key]),
    optionsDir: mode === 'reverse' ? 'ltr' : 'rtl',
    explain: `${item.en} = ${item.ar}${item.usage ? ` — ${item.usage}` : ''}`,
  };
  return { ...base, mode, itemId: item.id };
}

/** يستبدل أول ظهور لكلمة الإكمال في المثال بفراغ (بدون حساسية لحالة الأحرف) */
export function makeCloze(sentence: string, word: string): string | null {
  const i = sentence.toLowerCase().indexOf(word.toLowerCase());
  if (i < 0) return null;
  return sentence.slice(0, i) + '___' + sentence.slice(i + word.length);
}

function cloze(item: VocabItem, rand: () => number): GeneratedExercise | null {
  if (!item.cloze) return null;
  const sentence = makeCloze(item.example.en, item.cloze);
  if (!sentence) return null;
  const answer = item.example.en.substr(item.example.en.toLowerCase().indexOf(item.cloze.toLowerCase()), item.cloze.length);
  const others = shuffle(
    VOCAB_LIST.filter((v) => v.cloze && v.id !== item.id && v.cloze.toLowerCase() !== item.cloze!.toLowerCase()),
    rand,
  )
    .slice(0, 2)
    .map((v) => v.cloze!);
  const ex: FillExercise = {
    id: `gen:cloze:${item.id}`,
    type: 'fill',
    skill: 'vocab',
    itemIds: [item.id],
    prompt: 'أكمل الجملة',
    sentence,
    ar: item.example.ar,
    answers: [answer],
    bank: shuffle([answer, ...others], rand),
    explain: `${item.example.en} — ${item.example.ar}`,
    hints: [`الكلمة تعني: ${item.ar}`],
  };
  return { ...ex, mode: 'cloze', itemId: item.id };
}

function produce(item: VocabItem): GeneratedExercise {
  const ex: TypeExercise = {
    id: `gen:produce:${item.id}`,
    type: 'type',
    skill: 'writing',
    itemIds: [item.id],
    prompt: `اكتب بالإنجليزية: «${item.ar}»`,
    answers: [item.en.replace(/\s*…\??/g, '').trim()],
    hints: [`تبدأ بـ: ${item.en.split(' ')[0]}`],
    explain: `${item.en} = ${item.ar}`,
  };
  return { ...ex, mode: 'produce', itemId: item.id };
}

export function generate(item: VocabItem, mode: GenMode, rand: () => number): GeneratedExercise {
  if (mode === 'cloze') return cloze(item, rand) ?? choice(item, 'meaning', rand);
  if (mode === 'produce') {
    // لا نطلب كتابة عبارات طويلة جدًا أو قوالب ناقصة (فيها …) من الذاكرة
    if (item.en.includes('…') || item.en.includes('/') || item.en.split(' ').length > 6) return cloze(item, rand) ?? choice(item, 'reverse', rand);
    return produce(item);
  }
  return choice(item, mode, rand);
}

/** تمارين درس: نوع مختلف لكل كلمة لتنويع السياق، بحد أقصى 6 */
export function lessonDrill(itemIds: string[], seed: number): GeneratedExercise[] {
  const rand = rng(seed);
  const cycle: GenMode[] = ['meaning', 'listen', 'cloze', 'reverse'];
  const ids = itemIds.slice(0, 6);
  return shuffle(
    ids.map((id, i) => generate(VOCAB[id], cycle[i % cycle.length], rand)),
    rand,
  );
}

/** اختيار نوع التمرين في المراجعة بحسب حالة العنصر */
export function pickReviewMode(s: ItemState, rand: () => number): GenMode {
  if (isStruggling(s)) return 'meaning'; // تقسيم المهارة: نبدأ بالتعرف قبل الإنتاج
  const early: GenMode[] = ['meaning', 'listen', 'reverse'];
  const late: GenMode[] = ['cloze', 'produce', 'listen', 'reverse'];
  const pool = (s.reps < 2 ? early : late).filter((m) => m !== s.lastMode);
  return pool[Math.floor(rand() * pool.length)] ?? 'meaning';
}

export function reviewSession(states: ItemState[], seed: number): GeneratedExercise[] {
  const rand = rng(seed);
  return states
    .filter((s) => VOCAB[s.id])
    .map((s) => generate(VOCAB[s.id], pickReviewMode(s, rand), rand));
}
