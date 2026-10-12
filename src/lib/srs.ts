// نظام مراجعة متباعدة متكيف (مستوحى من SM-2 مع شروط إتقان أشد).
// الإتقان لا يُعلن بنسبة الإجابات الصحيحة وحدها: يلزم نجاح متتالٍ، في سياقين مختلفين على الأقل،
// وعلى فترات متباعدة فعلًا (فاصل 7 أيام فأكثر).

export const HOUR = 3600_000;
export const DAY = 24 * HOUR;

export type Grade = 'again' | 'hard' | 'good';

export interface ItemState {
  id: string;
  introducedAt: number;
  due: number;
  /** الفاصل الحالي بالأيام */
  interval: number;
  ease: number;
  reps: number;
  lapses: number;
  /** عدد مرات النجاح المتتالية */
  streak: number;
  /** أنواع التمارين التي نجح فيها (سياقات مختلفة) */
  contexts: string[];
  lastMode?: string;
  lastSuccess?: number;
  lastSeen?: number;
  history: Array<{ t: number; g: Grade; m: string }>;
  mastered: boolean;
  updatedAt: number;
}

/** نجاح خلال هذه المدة من آخر نجاح لا يزيد الفاصل (منع الحفظ المؤقت) */
export const CRAM_WINDOW = 6 * HOUR;

export function newItem(id: string, now: number): ItemState {
  return {
    id,
    introducedAt: now,
    due: now + 12 * HOUR,
    interval: 0,
    ease: 2.3,
    reps: 0,
    lapses: 0,
    streak: 0,
    contexts: [],
    history: [],
    mastered: false,
    updatedAt: now,
  };
}

export function isMastered(s: Pick<ItemState, 'streak' | 'contexts' | 'interval'>): boolean {
  return s.streak >= 3 && s.contexts.length >= 2 && s.interval >= 7;
}

/** متعثر: أخطأ مرارًا مؤخرًا — نقسّم المهارة لخطوات أسهل */
export function isStruggling(s: ItemState): boolean {
  const recent = s.history.slice(-5);
  const fails = recent.filter((h) => h.g === 'again').length;
  return fails >= 2 && s.streak < 2;
}

export function grade(prev: ItemState, g: Grade, mode: string, now: number): ItemState {
  const s: ItemState = { ...prev, contexts: [...prev.contexts], history: [...prev.history] };
  s.lastSeen = now;
  s.lastMode = mode;
  s.updatedAt = now;
  s.history.push({ t: now, g, m: mode });
  if (s.history.length > 12) s.history = s.history.slice(-12);

  if (g === 'again') {
    s.lapses += 1;
    s.streak = 0;
    s.ease = Math.max(1.3, s.ease - 0.2);
    s.interval = 0;
    s.due = now + 10 * 60_000; // أعد اختباره قريبًا (في نفس الجلسة أو التالية)
    s.mastered = false;
    return s;
  }

  if (!s.contexts.includes(mode)) s.contexts.push(mode);
  const crammed = s.lastSuccess !== undefined && now - s.lastSuccess < CRAM_WINDOW;

  if (crammed) {
    // نجاح متكرر في نفس الجلسة: نسجله، لكن لا نعتبره دليل حفظ طويل المدى
    s.due = Math.max(s.due, now + (s.interval > 0 ? s.interval : 1) * DAY);
    if (g === 'hard') s.ease = Math.max(1.3, s.ease - 0.05);
    s.mastered = isMastered(s);
    return s;
  }

  s.streak += 1;
  s.reps += 1;
  if (g === 'hard') {
    s.ease = Math.max(1.3, s.ease - 0.15);
    s.interval = Math.max(1, Math.round(s.interval * 1.2 * 10) / 10);
  } else {
    s.ease = Math.min(2.8, s.ease + 0.05);
    if (s.reps === 1) s.interval = 1;
    else if (s.reps === 2) s.interval = 3;
    else s.interval = Math.round(s.interval * s.ease * 10) / 10;
  }
  s.interval = Math.min(s.interval, 120);
  s.due = now + s.interval * DAY;
  s.lastSuccess = now;
  s.mastered = isMastered(s);
  return s;
}

export function isDue(s: ItemState, now: number): boolean {
  return s.due <= now;
}

/** ترتيب العناصر المستحقة: المتعثرة أولًا ثم الأكثر تأخرًا */
export function dueItems(items: Record<string, ItemState>, now: number, limit = 20): ItemState[] {
  return Object.values(items)
    .filter((s) => isDue(s, now))
    .sort((a, b) => {
      const sa = isStruggling(a) ? 0 : 1;
      const sb = isStruggling(b) ? 0 : 1;
      if (sa !== sb) return sa - sb;
      return a.due - b.due;
    })
    .slice(0, limit);
}

export type ItemStatus = 'new' | 'learning' | 'struggling' | 'mastered';

export function itemStatus(s: ItemState): ItemStatus {
  if (s.mastered) return 'mastered';
  if (isStruggling(s)) return 'struggling';
  if (s.reps === 0) return 'new';
  return 'learning';
}
