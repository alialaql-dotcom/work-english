// حالة المسار: أي درس متاح، وأيها مكتمل، وما الدرس التالي.
import { ALL_LESSONS, UNITS } from '../content';
import type { Progress } from './progress';

/** نسبة الاختبار القصير المطلوبة لاعتبار الدرس مكتملًا وفتح ما بعده */
export const LESSON_PASS = 0.6;

export type LessonState = 'done' | 'current' | 'available' | 'skippable' | 'locked';

export function isLessonDone(p: Progress, id: string): boolean {
  return (p.lessons[id]?.bestScore ?? 0) >= LESSON_PASS;
}

function isSkipped(p: Progress, id: string): boolean {
  return !!p.placement?.skippedLessonIds.includes(id);
}

export function currentLessonId(p: Progress): string | undefined {
  const start = p.placement?.startLessonId;
  const startIdx = start ? ALL_LESSONS.findIndex((l) => l.id === start) : 0;
  for (let i = Math.max(0, startIdx); i < ALL_LESSONS.length; i++) {
    if (!isLessonDone(p, ALL_LESSONS[i].id)) return ALL_LESSONS[i].id;
  }
  // كل ما بعد نقطة البداية مكتمل: نقترح أي درس سابق غير مكتمل
  return ALL_LESSONS.find((l) => !isLessonDone(p, l.id) && !isSkipped(p, l.id))?.id;
}

export function lessonState(p: Progress, id: string): LessonState {
  if (isLessonDone(p, id)) return 'done';
  if (id === currentLessonId(p)) return 'current';
  if (isSkipped(p, id)) return 'skippable';
  const i = ALL_LESSONS.findIndex((l) => l.id === id);
  if (i <= 0) return 'available';
  const prev = ALL_LESSONS[i - 1].id;
  if (isLessonDone(p, prev) || isSkipped(p, prev) || p.lessons[id]) return 'available';
  return 'locked';
}

export function unitTestAvailable(p: Progress, unitId: string): boolean {
  const u = UNITS.find((x) => x.id === unitId);
  if (!u) return false;
  return u.lessons.every((l) => isLessonDone(p, l.id) || isSkipped(p, l.id));
}

export function curriculumProgress(p: Progress): { done: number; total: number } {
  const total = ALL_LESSONS.length;
  const done = ALL_LESSONS.filter((l) => isLessonDone(p, l.id) || isSkipped(p, l.id)).length;
  return { done, total };
}
