import type { ChoiceExercise } from './types';

export interface PlacementQuestion extends ChoiceExercise {
  tier: 1 | 2 | 3;
}

/**
 * اختبار تحديد مستوى قصير ومتدرج (12 سؤالًا كحد أقصى، ويتوقف مبكرًا للمبتدئ).
 * كل سؤال فيه خيار «لا أعرف» حتى لا يضطر المتعلم للتخمين — التخمين يفسد التقدير.
 */
export const PLACEMENT: PlacementQuestion[] = [
  // المستوى 1: التعرف على كلمات وعبارات أساسية
  { id: 'pl-1', tier: 1, type: 'choice', skill: 'vocab', prompt: 'ما معنى: Thank you', options: ['شكرًا لك', 'مرحبًا', 'آسف'], answer: 0 },
  { id: 'pl-2', tier: 1, type: 'choice', skill: 'listening', prompt: 'استمع: ما معنى ما سمعت؟', audio: 'Good morning', hideAudioText: true, options: ['صباح الخير', 'مساء الخير', 'مع السلامة'], answer: 0 },
  { id: 'pl-3', tier: 1, type: 'choice', skill: 'vocab', prompt: 'ما معنى: How much is it?', options: ['أين هو؟', 'بكم هو؟', 'ما هو؟'], answer: 1 },
  { id: 'pl-4', tier: 1, type: 'choice', skill: 'listening', prompt: 'استمع: أي رقم؟', audio: 'Fifteen', hideAudioText: true, options: ['15', '50', '5'], answer: 0, optionsDir: 'ltr' },
  // المستوى 2: قواعد أساسية جدًا
  { id: 'pl-5', tier: 2, type: 'choice', skill: 'grammar', prompt: 'اختر الكلمة الصحيحة: The phone ___ new.', options: ['am', 'is', 'are'], answer: 1, optionsDir: 'ltr' },
  { id: 'pl-6', tier: 2, type: 'choice', skill: 'grammar', prompt: 'اختر الكلمة الصحيحة: Where ___ the chargers?', options: ['is', 'are', 'be'], answer: 1, optionsDir: 'ltr' },
  { id: 'pl-7', tier: 2, type: 'choice', skill: 'grammar', prompt: 'اختر الكلمة الصحيحة: She ___ her tablet for work.', options: ['use', 'uses', 'using'], answer: 1, optionsDir: 'ltr' },
  { id: 'pl-8', tier: 2, type: 'choice', skill: 'listening', prompt: 'استمع: ماذا يريد العميل؟', audio: "I'm looking for a charger.", hideAudioText: true, options: ['يبحث عن شاحن', 'يبحث عن غطاء', 'يريد الدفع'], answer: 0 },
  // المستوى 3: فهم مواقف عمل أطول
  { id: 'pl-9', tier: 3, type: 'choice', skill: 'listening', prompt: 'استمع: ماذا يسأل العميل؟', audio: 'Which one has a better battery, this one or that one?', hideAudioText: true, options: ['أيهما أرخص', 'أيهما بطاريته أفضل', 'أيهما أخف'], answer: 1 },
  { id: 'pl-10', tier: 3, type: 'choice', skill: 'reading', prompt: 'اقرأ: “These earbuds are cheaper, but the battery doesn’t last as long.” ما المقصود؟', options: ['أرخص لكن البطارية أقصر', 'أغلى وبطاريتها أطول', 'أرخص وبطاريتها أطول'], answer: 0 },
  { id: 'pl-11', tier: 3, type: 'choice', skill: 'grammar', prompt: 'اختر الأصح: This phone is ___ than that one.', options: ['light', 'lighter', 'more light'], answer: 1, optionsDir: 'ltr' },
  { id: 'pl-12', tier: 3, type: 'choice', skill: 'conversation', prompt: 'لم تفهم كلام العميل. أفضل رد:', options: ['Could you say that again, please?', 'What you want?', 'No understand.'], answer: 0, optionsDir: 'ltr' },
];

export const DONT_KNOW = -1;

export type PlacementLevel = 'Pre-A1' | 'A1-low' | 'A1' | 'A2';

export interface PlacementResult {
  level: PlacementLevel;
  /** الدرس الذي يبدأ منه المسار */
  startLessonId: string;
  /** الدروس التي تجاوزها المتعلم (تبقى متاحة للمراجعة) */
  skippedLessonIds: string[];
  tierScores: Record<1 | 2 | 3, { correct: number; total: number }>;
  summary: string;
}

/** هل نتوقف عن الاختبار بعد هذه الإجابة؟ نوقفه مبكرًا إذا كان المستوى 1 صعبًا جدًا */
export function shouldStopPlacement(answers: Record<string, number>): boolean {
  const tier1 = PLACEMENT.filter((q) => q.tier === 1);
  const answeredTier1 = tier1.filter((q) => q.id in answers);
  if (answeredTier1.length < tier1.length) return false;
  const correct = answeredTier1.filter((q) => answers[q.id] === q.answer).length;
  if (correct <= 1) return true;
  const tier2 = PLACEMENT.filter((q) => q.tier === 2);
  const answeredTier2 = tier2.filter((q) => q.id in answers);
  if (answeredTier2.length === tier2.length) {
    const c2 = answeredTier2.filter((q) => answers[q.id] === q.answer).length;
    if (c2 <= 1) return true;
  }
  return false;
}

export function scorePlacement(answers: Record<string, number>): PlacementResult {
  const tierScores = { 1: { correct: 0, total: 0 }, 2: { correct: 0, total: 0 }, 3: { correct: 0, total: 0 } } as PlacementResult['tierScores'];
  for (const q of PLACEMENT) {
    tierScores[q.tier].total += 1;
    if (answers[q.id] === q.answer) tierScores[q.tier].correct += 1;
  }
  const pass = (t: 1 | 2 | 3) => tierScores[t].correct >= 3; // 3 من 4

  if (!pass(1)) {
    return {
      level: 'Pre-A1', startLessonId: 'u0l1', skippedLessonIds: [], tierScores,
      summary: 'سنبدأ من الأساسيات: التحية والكلمات المهمة، خطوة بخطوة.',
    };
  }
  if (!pass(2)) {
    return {
      level: 'A1-low', startLessonId: 'u0l3', skippedLessonIds: ['u0l1', 'u0l2'], tierScores,
      summary: 'تعرف كلمات أساسية جيدًا. سنبدأ ببناء الجملة (am / is / are) ثم ننتقل لمواقف العمل.',
    };
  }
  if (!pass(3)) {
    return {
      level: 'A1', startLessonId: 'u1l1', skippedLessonIds: ['u0l1', 'u0l2', 'u0l3', 'u0l4', 'u0l5', 'u0l6'], tierScores,
      summary: 'أساسياتك جيدة. سنبدأ مباشرة بمواقف العمل مع العميل، وتبقى دروس الأساسيات متاحة للمراجعة.',
    };
  }
  return {
    level: 'A2', startLessonId: 'u1l1', skippedLessonIds: ['u0l1', 'u0l2', 'u0l3', 'u0l4', 'u0l5', 'u0l6'], tierScores,
    summary: 'مستواك جيد في الفهم. ستتقدم بسرعة في مواقف العمل، وسنركز على التحدث والكتابة بثقة.',
  };
}

export const LEVEL_LABELS: Record<PlacementLevel, string> = {
  'Pre-A1': 'ما قبل A1 (مبتدئ)',
  'A1-low': 'A1 (بداية)',
  A1: 'A1',
  A2: 'A2 (تقدير أولي)',
};
