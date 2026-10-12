// نموذج بيانات التقدم + دوال تحديث نقية + دمج آمن بين الأجهزة.
import type { Skill } from '../content/types';
import type { PlacementResult } from '../content/placement';
import { grade, newItem, type Grade, type ItemState } from './srs';

export type Gender = 'm' | 'f' | 'n';

export interface Mistake {
  id: string;
  at: number;
  exerciseId: string;
  itemIds: string[];
  skill: Skill;
  prompt: string;
  given: string;
  expected: string;
}

export interface LessonRecord {
  completedAt: number;
  bestScore: number; // 0..1
  lastScore: number;
  attempts: number;
  updatedAt: number;
}

export interface UnitTestRecord {
  score: number;
  passed: boolean;
  at: number;
  updatedAt: number;
}

export interface SkillStat {
  recent: number[]; // آخر 40 محاولة: 1 صحيح، 0 خطأ
  correct: number;
  total: number;
  updatedAt: number;
}

export interface DayDeviceStat {
  xp: number;
  lessons: number;
  reviews: number;
  seconds: number;
}

export interface Settings {
  rate: number; // سرعة الصوت
  voiceURI?: string;
  showTranslation: 'always' | 'after' | 'hidden';
  micEnabled: boolean;
  reminder: { enabled: boolean; window: string; time: string };
  dailyGoalMinutes: number;
  updatedAt: number;
}

export interface Progress {
  version: 1;
  profile: { name: string; gender: Gender; onboarded: boolean; updatedAt: number };
  placement?: PlacementResult & { at: number };
  lessons: Record<string, LessonRecord>;
  unitTests: Record<string, UnitTestRecord>;
  items: Record<string, ItemState>;
  mistakes: Mistake[];
  skills: Partial<Record<Skill, SkillStat>>;
  /** days[YYYY-MM-DD][deviceId] — لكل جهاز سجله حتى يكون الدمج دقيقًا */
  days: Record<string, Record<string, DayDeviceStat>>;
  settings: Settings;
  updatedAt: number;
}

export const MAX_MISTAKES = 200;

export function emptyProgress(now = Date.now()): Progress {
  return {
    version: 1,
    profile: { name: '', gender: 'n', onboarded: false, updatedAt: 0 },
    lessons: {},
    unitTests: {},
    items: {},
    mistakes: [],
    skills: {},
    days: {},
    settings: {
      rate: 0.9,
      showTranslation: 'after',
      micEnabled: true,
      reminder: { enabled: false, window: 'after-work', time: '20:00' },
      dailyGoalMinutes: 10,
      updatedAt: 0,
    },
    updatedAt: now,
  };
}

export function dayKey(t: number, tzOffsetMin = new Date(t).getTimezoneOffset()): string {
  const d = new Date(t - tzOffsetMin * 60_000);
  return d.toISOString().slice(0, 10);
}

// ───────── تحديثات ─────────

export function introduceItems(p: Progress, ids: string[], now: number): Progress {
  const items = { ...p.items };
  let changed = false;
  for (const id of ids) {
    if (!items[id]) {
      items[id] = newItem(id, now);
      changed = true;
    }
  }
  return changed ? { ...p, items, updatedAt: now } : p;
}

export interface AttemptInput {
  exerciseId: string;
  skill: Skill;
  itemIds: string[];
  mode: string;
  grade: Grade;
  prompt: string;
  given: string;
  expected: string;
}

export function recordAttempt(p: Progress, a: AttemptInput, now: number, deviceId: string): Progress {
  const items = { ...p.items };
  for (const id of a.itemIds) {
    const s = items[id];
    if (s) items[id] = grade(s, a.grade, a.mode, now); // لا نُنشئ عناصر لم تُقدَّم بعد
  }
  const ok = a.grade !== 'again';
  const prevSkill = p.skills[a.skill] ?? { recent: [], correct: 0, total: 0, updatedAt: 0 };
  const skill: SkillStat = {
    recent: [...prevSkill.recent, ok ? 1 : 0].slice(-40),
    correct: prevSkill.correct + (ok ? 1 : 0),
    total: prevSkill.total + 1,
    updatedAt: now,
  };
  let mistakes = p.mistakes;
  if (!ok) {
    const m: Mistake = {
      id: `${deviceId}:${now}:${a.exerciseId}`,
      at: now,
      exerciseId: a.exerciseId,
      itemIds: a.itemIds,
      skill: a.skill,
      prompt: a.prompt,
      given: a.given,
      expected: a.expected,
    };
    mistakes = [...mistakes, m].slice(-MAX_MISTAKES);
  }
  const withDay = bumpDay(p, now, deviceId, { xp: ok ? (a.grade === 'good' ? 2 : 1) : 0 });
  return { ...withDay, items, skills: { ...p.skills, [a.skill]: skill }, mistakes, updatedAt: now };
}

export function bumpDay(p: Progress, now: number, deviceId: string, d: Partial<DayDeviceStat>): Progress {
  const k = dayKey(now);
  const day = { ...(p.days[k] ?? {}) };
  const cur = day[deviceId] ?? { xp: 0, lessons: 0, reviews: 0, seconds: 0 };
  day[deviceId] = {
    xp: cur.xp + (d.xp ?? 0),
    lessons: cur.lessons + (d.lessons ?? 0),
    reviews: cur.reviews + (d.reviews ?? 0),
    seconds: cur.seconds + (d.seconds ?? 0),
  };
  return { ...p, days: { ...p.days, [k]: day }, updatedAt: now };
}

export function completeLesson(p: Progress, lessonId: string, score: number, seconds: number, now: number, deviceId: string): Progress {
  const prev = p.lessons[lessonId];
  const rec: LessonRecord = {
    completedAt: prev?.completedAt ?? now,
    bestScore: Math.max(prev?.bestScore ?? 0, score),
    lastScore: score,
    attempts: (prev?.attempts ?? 0) + 1,
    updatedAt: now,
  };
  const withDay = bumpDay(p, now, deviceId, { lessons: 1, xp: 10, seconds });
  return { ...withDay, lessons: { ...p.lessons, [lessonId]: rec }, updatedAt: now };
}

export const UNIT_TEST_PASS = 0.75;

export function recordUnitTest(p: Progress, unitId: string, score: number, now: number, deviceId: string): Progress {
  const prev = p.unitTests[unitId];
  const rec: UnitTestRecord = {
    score: Math.max(prev?.score ?? 0, score),
    passed: (prev?.passed ?? false) || score >= UNIT_TEST_PASS,
    at: now,
    updatedAt: now,
  };
  const withDay = bumpDay(p, now, deviceId, { xp: Math.round(score * 20) });
  return { ...withDay, unitTests: { ...p.unitTests, [unitId]: rec }, updatedAt: now };
}

export function finishReview(p: Progress, count: number, seconds: number, now: number, deviceId: string): Progress {
  return bumpDay(p, now, deviceId, { reviews: count, xp: 5, seconds });
}

// ───────── قراءات مشتقة ─────────

export function dayTotals(p: Progress, key: string): DayDeviceStat {
  const day = p.days[key] ?? {};
  return Object.values(day).reduce(
    (acc, d) => ({ xp: acc.xp + d.xp, lessons: acc.lessons + d.lessons, reviews: acc.reviews + d.reviews, seconds: acc.seconds + d.seconds }),
    { xp: 0, lessons: 0, reviews: 0, seconds: 0 },
  );
}

export function totalXp(p: Progress): number {
  return Object.keys(p.days).reduce((s, k) => s + dayTotals(p, k).xp, 0);
}

function isActive(d: DayDeviceStat) {
  return d.lessons > 0 || d.reviews > 0;
}

/** سلسلة الأيام المتتالية: تُحسب حتى اليوم، أو حتى أمس إذا لم يدرس اليوم بعد */
export function streak(p: Progress, now: number): number {
  let n = 0;
  let t = now;
  if (!isActive(dayTotals(p, dayKey(t)))) t -= 86_400_000;
  while (isActive(dayTotals(p, dayKey(t)))) {
    n += 1;
    t -= 86_400_000;
  }
  return n;
}

/** مستوى بسيط من النقاط (للتحفيز فقط، لا علاقة له بمستوى CEFR) */
export function xpLevel(xp: number): { level: number; into: number; need: number } {
  let level = 1;
  let need = 100;
  let rest = xp;
  while (rest >= need) {
    rest -= need;
    level += 1;
    need = Math.round(need * 1.25);
  }
  return { level, into: rest, need };
}

export function skillAccuracy(s?: SkillStat): number | null {
  if (!s || s.recent.length < 3) return null;
  return s.recent.reduce((a, b) => a + b, 0) / s.recent.length;
}

// ───────── الدمج بين الأجهزة ─────────

function newer<T extends { updatedAt: number }>(a: T | undefined, b: T | undefined): T | undefined {
  if (!a) return b;
  if (!b) return a;
  return b.updatedAt > a.updatedAt ? b : a;
}

function mergeRecord<T extends { updatedAt: number }>(a: Record<string, T>, b: Record<string, T>): Record<string, T> {
  const out: Record<string, T> = { ...a };
  for (const k of Object.keys(b)) out[k] = newer(a[k], b[k]) as T;
  return out;
}

/**
 * دمج تقدم جهازين دون فقد بيانات:
 * - لكل درس/عنصر/مهارة: النسخة الأحدث.
 * - الأخطاء: اتحاد حسب المعرف.
 * - الأيام: لكل (يوم، جهاز) القيمة الأكبر، فلا يتضاعف العد عند تكرار الدمج.
 */
export function mergeProgress(a: Progress, b: Progress): Progress {
  const days: Progress['days'] = {};
  for (const k of new Set([...Object.keys(a.days), ...Object.keys(b.days)])) {
    const da = a.days[k] ?? {};
    const db = b.days[k] ?? {};
    const merged: Record<string, DayDeviceStat> = {};
    for (const dev of new Set([...Object.keys(da), ...Object.keys(db)])) {
      const x = da[dev];
      const y = db[dev];
      merged[dev] = !x
        ? y
        : !y
          ? x
          : { xp: Math.max(x.xp, y.xp), lessons: Math.max(x.lessons, y.lessons), reviews: Math.max(x.reviews, y.reviews), seconds: Math.max(x.seconds, y.seconds) };
    }
    days[k] = merged;
  }
  const mistakesById = new Map<string, Mistake>();
  for (const m of [...a.mistakes, ...b.mistakes]) mistakesById.set(m.id, m);
  const mistakes = [...mistakesById.values()].sort((x, y) => x.at - y.at).slice(-MAX_MISTAKES);

  const skills: Progress['skills'] = {};
  for (const k of new Set([...Object.keys(a.skills), ...Object.keys(b.skills)]) as Set<Skill>) {
    skills[k] = newer(a.skills[k], b.skills[k]);
  }
  const placement = !a.placement ? b.placement : !b.placement ? a.placement : b.placement.at > a.placement.at ? b.placement : a.placement;

  return {
    version: 1,
    profile: newer(a.profile, b.profile)!,
    placement,
    lessons: mergeRecord(a.lessons, b.lessons),
    unitTests: mergeRecord(a.unitTests, b.unitTests),
    items: mergeRecord(a.items, b.items),
    mistakes,
    skills,
    days,
    settings: newer(a.settings, b.settings)!,
    updatedAt: Math.max(a.updatedAt, b.updatedAt),
  };
}

/** تحقق بنيوي بسيط من بيانات واردة (من التخزين المحلي أو السحابة) قبل استخدامها */
export function isProgress(x: unknown): x is Progress {
  if (!x || typeof x !== 'object') return false;
  const p = x as Partial<Progress>;
  return (
    p.version === 1 &&
    typeof p.profile === 'object' && p.profile !== null &&
    typeof p.lessons === 'object' && p.lessons !== null &&
    typeof p.items === 'object' && p.items !== null &&
    Array.isArray(p.mistakes) &&
    typeof p.days === 'object' && p.days !== null &&
    typeof p.settings === 'object' && p.settings !== null
  );
}

/** يكمل الحقول الناقصة بقيم افتراضية (للبيانات القديمة أو الناقصة) */
export function repairProgress(x: Partial<Progress>): Progress {
  const base = emptyProgress(0);
  return {
    ...base,
    ...x,
    version: 1,
    profile: { ...base.profile, ...(x.profile ?? {}) },
    settings: { ...base.settings, ...(x.settings ?? {}), reminder: { ...base.settings.reminder, ...(x.settings?.reminder ?? {}) } },
    lessons: x.lessons ?? {},
    unitTests: x.unitTests ?? {},
    items: x.items ?? {},
    mistakes: Array.isArray(x.mistakes) ? x.mistakes : [],
    skills: x.skills ?? {},
    days: x.days ?? {},
    updatedAt: x.updatedAt ?? 0,
  };
}
