// أنواع المحتوى التعليمي. كل المحتوى ثابت ويعمل دون اتصال وبدون أي خدمة ذكاء اصطناعي.

export type Skill = 'vocab' | 'grammar' | 'listening' | 'reading' | 'writing' | 'speaking' | 'conversation';

export const SKILL_LABELS: Record<Skill, string> = {
  vocab: 'المفردات',
  grammar: 'القواعد',
  listening: 'الاستماع',
  reading: 'القراءة',
  writing: 'الكتابة',
  speaking: 'النطق والتكرار',
  conversation: 'المحادثة العملية',
};

export interface VocabItem {
  id: string;
  en: string;
  ar: string;
  kind: 'word' | 'phrase';
  /** نطق صوتي تقريبي بالرموز الدولية */
  ipa: string;
  /** تقريب عربي مساعد فقط، ليس نطقًا دقيقًا */
  arApprox: string;
  example: { en: string; ar: string };
  related?: string[];
  usage?: string;
  mistake?: string;
  /** كلمة واحدة أو أكثر من المثال تُخفى في تمرين الإكمال */
  cloze?: string;
}

export interface Line {
  speaker: 'customer' | 'staff' | 'colleague' | 'manager';
  en: string;
  ar: string;
}

export const SPEAKER_LABELS: Record<Line['speaker'], string> = {
  customer: 'العميل',
  staff: 'أنت',
  colleague: 'الزميل',
  manager: 'المدير',
};

interface ExerciseBase {
  id: string;
  skill: Skill;
  /** عناصر المفردات أو القواعد المرتبطة لتسجيل الأداء والمراجعة */
  itemIds?: string[];
  /** شرح عربي يظهر عند الخطأ */
  explain?: string;
  /** تلميحات تدريجية */
  hints?: string[];
}

export interface ChoiceExercise extends ExerciseBase {
  type: 'choice';
  prompt: string;
  /** نص إنجليزي يُشغَّل صوتيًا (لتمارين الاستماع) */
  audio?: string;
  /** إخفاء النص المسموع حتى الإجابة */
  hideAudioText?: boolean;
  options: string[];
  answer: number;
  /** اتجاه الخيارات: ltr للإنجليزية */
  optionsDir?: 'ltr' | 'rtl';
}

export interface FillExercise extends ExerciseBase {
  type: 'fill';
  prompt: string;
  /** الجملة مع ___ مكان الفراغ */
  sentence: string;
  ar?: string;
  answers: string[];
  /** خيارات بنك الكلمات (اختيارية) */
  bank?: string[];
}

export interface OrderExercise extends ExerciseBase {
  type: 'order';
  prompt: string;
  ar: string;
  words: string[]; // الترتيب الصحيح
  /** ترتيبات أخرى مقبولة */
  alternatives?: string[][];
}

export interface TypeExercise extends ExerciseBase {
  type: 'type';
  prompt: string;
  /** سياق: ما قاله العميل مثلًا */
  context?: Line;
  answers: string[];
  /** بداية جاهزة لمساعدة المتعلم */
  starter?: string;
  /** إن كان الرد حرًا: يُقبل أي رد يحتوي الكلمات المطلوبة */
  requiredWords?: string[][];
  model?: string;
}

export interface DialogueExercise extends ExerciseBase {
  type: 'dialogue';
  prompt: string;
  turns: Array<
    | { speaker: Exclude<Line['speaker'], 'staff'>; en: string; ar: string }
    | { speaker: 'staff'; options: string[]; answer: number; ar: string; explain?: string }
  >;
}

export type Exercise = ChoiceExercise | FillExercise | OrderExercise | TypeExercise | DialogueExercise;

export type Step =
  | { kind: 'review'; title?: string }
  | { kind: 'vocab'; title: string; itemIds: string[] }
  | {
      kind: 'grammar';
      id: string;
      title: string;
      pattern: string;
      explanation: string[];
      examples: Array<{ en: string; ar: string }>;
      note?: string;
    }
  | {
      kind: 'listen';
      title: string;
      situation: string;
      lines: Line[];
      questions: ChoiceExercise[];
    }
  | { kind: 'repeat'; title: string; phrases: Array<{ en: string; ar: string }> }
  /** تمارين تُولَّد تلقائيًا من المفردات (معنى، استماع، إكمال) */
  | { kind: 'drill'; title: string; itemIds: string[] }
  | { kind: 'practice'; title: string; exercises: Exercise[] }
  | { kind: 'quiz'; title: string; exercises: Exercise[] };

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  titleEn: string;
  goal: string;
  minutes: number;
  steps: Step[];
}

export interface Unit {
  id: string;
  order: number;
  title: string;
  titleEn: string;
  description: string;
  cefr: 'Pre-A1' | 'A1' | 'A2' | 'B1';
  lessons: Lesson[];
  /** اختبار الوحدة */
  test: Exercise[];
}

export interface GrammarPoint {
  id: string;
  title: string;
}
