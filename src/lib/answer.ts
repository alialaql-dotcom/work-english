// مقارنة إجابات المتعلم المكتوبة بتسامح معقول: لا نعاقب على علامات الترقيم أو حالة الأحرف أو الاختصارات.

const CONTRACTIONS: Array<[RegExp, string]> = [
  [/\bi'm\b/g, 'i am'],
  [/\bit's\b/g, 'it is'],
  [/\bwhat's\b/g, 'what is'],
  [/\bthat's\b/g, 'that is'],
  [/\bthere's\b/g, 'there is'],
  [/\bhe's\b/g, 'he is'],
  [/\bshe's\b/g, 'she is'],
  [/\byou're\b/g, 'you are'],
  [/\bwe're\b/g, 'we are'],
  [/\bthey're\b/g, 'they are'],
  [/\bisn't\b/g, 'is not'],
  [/\baren't\b/g, 'are not'],
  [/\bdon't\b/g, 'do not'],
  [/\bdoesn't\b/g, 'does not'],
  [/\bdidn't\b/g, 'did not'],
  [/\bcan't\b/g, 'cannot'],
  [/\bcan not\b/g, 'cannot'],
  [/\bi'll\b/g, 'i will'],
  [/\byou'll\b/g, 'you will'],
  [/\bi'd\b/g, 'i would'],
  [/\bcolour\b/g, 'color'],
];

export function normalize(s: string): string {
  let t = s
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[“”]/g, '"')
    .trim();
  for (const [re, rep] of CONTRACTIONS) t = t.replace(re, rep);
  return t
    .replace(/[.,!?;:"()…]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

export type CheckStatus = 'correct' | 'typo' | 'wrong';

export interface CheckResult {
  status: CheckStatus;
  /** الإجابة النموذجية الأقرب لعرضها */
  expected: string;
}

/** نسمح بخطأ إملائي بسيط واحد لكل 8 أحرف تقريبًا، بحد أقصى 2 */
function typoBudget(len: number): number {
  if (len < 4) return 0;
  return Math.min(2, Math.floor(len / 8) + 1);
}

export function checkText(input: string, answers: string[], requiredWords?: string[][]): CheckResult {
  const n = normalize(input);
  const expected = answers[0] ?? '';
  if (!n) return { status: 'wrong', expected };
  let best = { d: Infinity, a: expected };
  for (const a of answers) {
    const na = normalize(a);
    if (na === n) return { status: 'correct', expected: a };
    const d = levenshtein(na, n);
    if (d < best.d) best = { d, a };
  }
  // ردود حرة: مقبولة إذا احتوت على كل مجموعات الكلمات المطلوبة (يكفي كلمة من كل مجموعة)
  if (requiredWords && requiredWords.length > 0) {
    const padded = ` ${n} `;
    const ok = requiredWords.every((group) => group.some((w) => padded.includes(` ${normalize(w)} `)));
    if (ok) return { status: 'correct', expected: best.a };
  }
  if (best.d <= typoBudget(normalize(best.a).length)) return { status: 'typo', expected: best.a };
  return { status: 'wrong', expected: best.a };
}

export function checkOrder(chosen: string[], correct: string[], alternatives?: string[][]): boolean {
  const join = (w: string[]) => normalize(w.join(' '));
  const c = join(chosen);
  return c === join(correct) || (alternatives ?? []).some((alt) => c === join(alt));
}

/** تلميح تلقائي: أول حرف من كل كلمة */
export function firstLettersHint(answer: string): string {
  return answer
    .split(' ')
    .map((w) => {
      const letters = w.replace(/[^A-Za-z']/g, '');
      if (letters.length <= 1) return w;
      return w[0] + '_'.repeat(letters.length - 1) + w.slice(letters.length);
    })
    .join(' ');
}
