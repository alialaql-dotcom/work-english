import type { Lesson, Unit } from './types';
import { unit0 } from './unit0';
import { unit1 } from './unit1';

export const UNITS: Unit[] = [unit0, unit1];

/** الوحدات القادمة (معروضة على أنها غير متاحة بعد، حتى لا يظن المتعلم أن المنهج اكتمل) */
export const UPCOMING_UNITS = [
  { title: 'شرح المواصفات', titleEn: 'Explaining specs', cefr: 'A1–A2' },
  { title: 'المقارنة بين المنتجات', titleEn: 'Comparing products', cefr: 'A2' },
  { title: 'السعر والتوفر والاعتراضات', titleEn: 'Price, availability & objections', cefr: 'A2' },
  { title: 'التواصل مع الزملاء والمدير', titleEn: 'Talking with colleagues & manager', cefr: 'A2' },
  { title: 'نحو B1: مواقف أطول وتقييم شامل', titleEn: 'Towards B1', cefr: 'B1' },
];

export const ALL_LESSONS: Lesson[] = UNITS.flatMap((u) => u.lessons);

export function findLesson(id: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}

export function findUnit(id: string): Unit | undefined {
  return UNITS.find((u) => u.id === id);
}

export function nextLessonId(id: string): string | undefined {
  const i = ALL_LESSONS.findIndex((l) => l.id === id);
  return i >= 0 ? ALL_LESSONS[i + 1]?.id : undefined;
}

export function lessonIndex(id: string): number {
  return ALL_LESSONS.findIndex((l) => l.id === id);
}

/** كل معرفات المفردات التي تُقدَّم في درس معين */
export function lessonVocabIds(lesson: Lesson): string[] {
  return lesson.steps.flatMap((s) => (s.kind === 'vocab' ? s.itemIds : []));
}
