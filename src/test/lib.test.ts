import { describe, expect, it } from 'vitest';
import { checkOrder, checkText, firstLettersHint, normalize } from '../lib/answer';
import { CRAM_WINDOW, DAY, dueItems, grade, isStruggling, itemStatus, newItem } from '../lib/srs';
import {
  completeLesson, dayKey, emptyProgress, introduceItems, isProgress, mergeProgress, recordAttempt, repairProgress, streak, totalXp, xpLevel,
} from '../lib/progress';
import { scorePlacement, shouldStopPlacement, PLACEMENT, DONT_KNOW } from '../content/placement';
import { generate, lessonDrill, pickReviewMode, reviewSession, rng } from '../lib/exerciseGen';
import { VOCAB_LIST } from '../content/vocab';
import { buildIcs, suggestTime, isValidTime } from '../lib/reminders';
import { looksSecret } from '../lib/supabase';
import { compareWords } from '../lib/speech';

const T0 = Date.UTC(2026, 9, 12, 9, 0, 0);

describe('مقارنة الإجابات', () => {
  it('يتجاهل علامات الترقيم والحروف الكبيرة والاختصارات', () => {
    expect(normalize("I'm here to help!")).toBe('i am here to help');
    expect(checkText('i am here to help', ["I'm here to help."]).status).toBe('correct');
    expect(checkText('What’s your budget', ['What is your budget?']).status).toBe('correct');
  });
  it('يقبل خطأ إملائيًا بسيطًا ويصنفه typo', () => {
    expect(checkText('What is your budjet?', ['What is your budget?']).status).toBe('typo');
  });
  it('يرفض إجابة خاطئة أو فارغة', () => {
    expect(checkText('', ['Hello']).status).toBe('wrong');
    expect(checkText('Goodbye', ['Hello']).status).toBe('wrong');
  });
  it('الكلمات القصيرة لا تقبل أخطاء إملائية', () => {
    expect(checkText('ar', ['are']).status).toBe('wrong');
  });
  it('الرد الحر يُقبل إذا احتوى الكلمات المطلوبة', () => {
    const req = [['good morning', 'hello'], ['help']];
    expect(checkText('Hello, can I help you today?', ['Good morning! How can I help you?'], req).status).toBe('correct');
    expect(checkText('Hello there', ['Good morning! How can I help you?'], req).status).toBe('wrong');
  });
  it('ترتيب الكلمات', () => {
    expect(checkOrder(['Thank', 'you', 'for', 'waiting.'], ['Thank', 'you', 'for', 'waiting.'])).toBe(true);
    expect(checkOrder(['you', 'Thank', 'for', 'waiting.'], ['Thank', 'you', 'for', 'waiting.'])).toBe(false);
  });
  it('تلميح الحروف الأولى', () => {
    expect(firstLettersHint('Thank you')).toBe('T____ y__');
  });
});

describe('المراجعة المتباعدة', () => {
  it('عنصر جديد يستحق المراجعة بعد 12 ساعة', () => {
    const s = newItem('hello', T0);
    expect(dueItems({ hello: s }, T0)).toHaveLength(0);
    expect(dueItems({ hello: s }, T0 + 13 * 3600_000)).toHaveLength(1);
  });
  it('الفواصل تكبر مع النجاح وتنهار مع الخطأ', () => {
    let s = newItem('x', T0);
    s = grade(s, 'good', 'meaning', T0);
    expect(s.interval).toBe(1);
    s = grade(s, 'good', 'listen', T0 + DAY);
    expect(s.interval).toBe(3);
    s = grade(s, 'good', 'cloze', T0 + 4 * DAY);
    expect(s.interval).toBeGreaterThan(6);
    s = grade(s, 'again', 'produce', T0 + 12 * DAY);
    expect(s.interval).toBe(0);
    expect(s.streak).toBe(0);
    expect(s.lapses).toBe(1);
    expect(s.due).toBeLessThan(T0 + 12 * DAY + 3600_000);
  });
  it('النجاح المتكرر في نفس الجلسة لا يرفع الفاصل (لا حفظ مؤقت)', () => {
    let s = newItem('x', T0);
    s = grade(s, 'good', 'meaning', T0);
    const after1 = s.interval;
    s = grade(s, 'good', 'listen', T0 + 60_000);
    s = grade(s, 'good', 'cloze', T0 + 120_000);
    expect(s.interval).toBe(after1);
    expect(s.streak).toBe(1);
    expect(s.contexts).toEqual(['meaning', 'listen', 'cloze']);
    expect(s.mastered).toBe(false);
    // بعد انتهاء نافذة الحفظ المؤقت يعود التقدم
    s = grade(s, 'good', 'produce', T0 + CRAM_WINDOW + 1);
    expect(s.streak).toBe(2);
  });
  it('الإتقان يتطلب نجاحًا متباعدًا في سياقين مختلفين', () => {
    let s = newItem('x', T0);
    // نجاح متباعد لكن بنوع تمرين واحد فقط
    let t = T0;
    for (let i = 0; i < 5; i++) {
      s = grade(s, 'good', 'meaning', t);
      t += (s.interval + 0.1) * DAY;
    }
    expect(s.interval).toBeGreaterThanOrEqual(7);
    expect(s.mastered).toBe(false);
    s = grade(s, 'good', 'produce', t);
    expect(s.mastered).toBe(true);
    expect(itemStatus(s)).toBe('mastered');
  });
  it('اكتشاف التعثر واختيار تمرين أسهل', () => {
    let s = newItem('x', T0);
    s = grade(s, 'again', 'cloze', T0);
    s = grade(s, 'again', 'produce', T0 + DAY);
    expect(isStruggling(s)).toBe(true);
    expect(pickReviewMode(s, rng(1))).toBe('meaning');
  });
  it('المتعثر يأتي أولًا في المراجعة', () => {
    const a = { ...newItem('a', T0), due: T0 - 5 * DAY };
    let b = newItem('b', T0);
    b = grade(b, 'again', 'x', T0);
    b = grade(b, 'again', 'y', T0 + 1000);
    const list = dueItems({ a, b }, T0 + DAY);
    expect(list[0].id).toBe('b');
  });
});

describe('التقدم والدمج', () => {
  it('المحاولة على عنصر لم يُقدَّم لا تُنشئه، لكنها تُحسب في المهارة', () => {
    let p = emptyProgress(T0);
    p = recordAttempt(p, { exerciseId: 'e', skill: 'grammar', itemIds: ['hello'], mode: 'choice', grade: 'again', prompt: 'p', given: 'g', expected: 'x' }, T0, 'd1');
    expect(p.items.hello).toBeUndefined();
    expect(p.skills.grammar?.total).toBe(1);
    expect(p.mistakes).toHaveLength(1);
  });
  it('تسجيل المحاولة يحدّث حالة العنصر وسجل اليوم', () => {
    let p = introduceItems(emptyProgress(T0), ['hello'], T0);
    p = recordAttempt(p, { exerciseId: 'e', skill: 'vocab', itemIds: ['hello'], mode: 'meaning', grade: 'good', prompt: '', given: '', expected: '' }, T0, 'd1');
    expect(p.items.hello.reps).toBe(1);
    expect(totalXp(p)).toBe(2);
  });
  it('الدمج بين جهازين لا يفقد بيانات ولا يضاعف العد', () => {
    const base = introduceItems(emptyProgress(T0), ['hello', 'hi'], T0);
    let a = completeLesson(base, 'u0l1', 0.8, 300, T0 + 1000, 'phone');
    a = recordAttempt(a, { exerciseId: 'e1', skill: 'vocab', itemIds: ['hello'], mode: 'meaning', grade: 'again', prompt: '', given: '', expected: '' }, T0 + 2000, 'phone');
    let b = completeLesson(base, 'u0l2', 0.9, 300, T0 + 1500, 'pc');
    b = recordAttempt(b, { exerciseId: 'e2', skill: 'vocab', itemIds: ['hi'], mode: 'meaning', grade: 'good', prompt: '', given: '', expected: '' }, T0 + 2500, 'pc');

    const m1 = mergeProgress(a, b);
    const m2 = mergeProgress(m1, b); // دمج مكرر
    const m3 = mergeProgress(b, a); // ترتيب معكوس
    expect(Object.keys(m1.lessons).sort()).toEqual(['u0l1', 'u0l2']);
    expect(m1.items.hello.lapses).toBe(1);
    expect(m1.items.hi.reps).toBe(1);
    expect(m1.mistakes).toHaveLength(1);
    expect(totalXp(m2)).toBe(totalXp(m1));
    expect(totalXp(m3)).toBe(totalXp(m1));
    expect(totalXp(m1)).toBe(10 + 0 + 10 + 2);
  });
  it('السلسلة اليومية', () => {
    let p = emptyProgress(T0);
    expect(streak(p, T0)).toBe(0);
    p = completeLesson(p, 'u0l1', 1, 60, T0 - 2 * DAY, 'd');
    p = completeLesson(p, 'u0l2', 1, 60, T0 - DAY, 'd');
    expect(streak(p, T0)).toBe(2); // لم يدرس اليوم بعد: تبقى السلسلة حتى أمس
    p = completeLesson(p, 'u0l3', 1, 60, T0, 'd');
    expect(streak(p, T0)).toBe(3);
    expect(streak(p, T0 + 2 * DAY)).toBe(0);
  });
  it('مفتاح اليوم يحترم المنطقة الزمنية', () => {
    // 23:30 في الرياض (UTC+3) = 20:30 UTC من نفس اليوم
    expect(dayKey(Date.UTC(2026, 9, 12, 20, 30), -180)).toBe('2026-10-12');
    // 01:00 في الرياض = 22:00 UTC من اليوم السابق
    expect(dayKey(Date.UTC(2026, 9, 11, 22, 0), -180)).toBe('2026-10-12');
  });
  it('إصلاح البيانات الناقصة والتحقق منها', () => {
    expect(isProgress({ foo: 1 })).toBe(false);
    const r = repairProgress({ lessons: { u0l1: { completedAt: 1, bestScore: 1, lastScore: 1, attempts: 1, updatedAt: 1 } } });
    expect(isProgress(r)).toBe(true);
    expect(r.settings.rate).toBe(0.9);
  });
  it('مستويات النقاط', () => {
    expect(xpLevel(0).level).toBe(1);
    expect(xpLevel(100).level).toBe(2);
  });
});

describe('اختبار تحديد المستوى', () => {
  const answerTiers = (correct: Record<number, number>) => {
    const a: Record<string, number> = {};
    for (const t of [1, 2, 3] as const) {
      const qs = PLACEMENT.filter((q) => q.tier === t);
      qs.forEach((q, i) => (a[q.id] = i < (correct[t] ?? 0) ? q.answer : DONT_KNOW));
    }
    return a;
  };
  it('مبتدئ تمامًا يبدأ من الدرس الأول', () => {
    const r = scorePlacement(answerTiers({ 1: 1 }));
    expect(r.level).toBe('Pre-A1');
    expect(r.startLessonId).toBe('u0l1');
  });
  it('يعرف الكلمات ولا يركّب الجمل', () => {
    const r = scorePlacement(answerTiers({ 1: 4, 2: 1 }));
    expect(r.level).toBe('A1-low');
    expect(r.startLessonId).toBe('u0l3');
  });
  it('أساسيات جيدة يبدأ بمواقف العمل', () => {
    expect(scorePlacement(answerTiers({ 1: 4, 2: 3, 3: 1 })).startLessonId).toBe('u1l1');
    expect(scorePlacement(answerTiers({ 1: 4, 2: 4, 3: 4 })).level).toBe('A2');
  });
  it('يتوقف مبكرًا للمبتدئ', () => {
    const a = answerTiers({ 1: 1 });
    const onlyTier1 = Object.fromEntries(Object.entries(a).filter(([k]) => PLACEMENT.find((q) => q.id === k)!.tier === 1));
    expect(shouldStopPlacement(onlyTier1)).toBe(true);
    expect(shouldStopPlacement({})).toBe(false);
  });
});

describe('توليد التمارين', () => {
  it('كل مفردة تولد تمارين صالحة بكل الأنواع', () => {
    const rand = rng(42);
    for (const v of VOCAB_LIST) {
      for (const mode of ['meaning', 'reverse', 'listen', 'cloze', 'produce'] as const) {
        const e = generate(v, mode, rand);
        expect(e.itemIds).toEqual([v.id]);
        if (e.type === 'choice') {
          expect(e.options.length).toBe(3);
          expect(e.answer).toBeGreaterThanOrEqual(0);
          expect(new Set(e.options).size).toBe(3);
        }
        if (e.type === 'fill') expect(e.bank).toContain(e.answers[0]);
        if (e.type === 'type') expect(e.answers[0]).not.toContain('…');
      }
    }
  });
  it('تدريب الدرس متنوع ومحدود العدد وقابل للتكرار بنفس البذرة', () => {
    const ids = ['hello', 'hi', 'good-morning', 'good-evening', 'welcome', 'how-are-you', 'im-fine'];
    const a = lessonDrill(ids, 7);
    expect(a.length).toBe(6);
    expect(new Set(a.map((e) => e.mode)).size).toBeGreaterThan(2);
    expect(lessonDrill(ids, 7).map((e) => e.id)).toEqual(a.map((e) => e.id));
  });
  it('المراجعة تتجنب تكرار نفس نوع التمرين السابق', () => {
    let s = newItem('budget', T0);
    s = grade(s, 'good', 'meaning', T0);
    s = grade(s, 'good', 'listen', T0 + 2 * DAY);
    s = grade(s, 'good', 'cloze', T0 + 6 * DAY);
    for (let i = 0; i < 20; i++) expect(reviewSession([s], i)[0].mode).not.toBe('cloze');
  });
});

describe('التذكير', () => {
  it('يقترح وقتًا داخل النافذة', () => {
    expect(suggestTime('after-work')).toBe('19:15');
    expect(suggestTime('before-sleep')).toBe('22:15');
    expect(isValidTime('25:00')).toBe(false);
  });
  it('ملف التقويم صالح ومتكرر يوميًا مع تنبيه', () => {
    const ics = buildIcs('20:00', 'https://example.app/', new Date(2026, 9, 12, 21, 0));
    expect(ics).toContain('RRULE:FREQ=DAILY');
    expect(ics).toContain('BEGIN:VALARM');
    expect(ics).toContain('DTSTART:20261013T200000'); // الوقت فات اليوم، فيبدأ غدًا
    expect(() => buildIcs('99:00', 'x')).toThrow();
  });
});

describe('الأمان والصوت', () => {
  it('يرفض المفاتيح السرية في الواجهة', () => {
    const fakeJwt = (role: string) => `x.${btoa(JSON.stringify({ role }))}.y`;
    expect(looksSecret(fakeJwt('service_role'))).toBe(true);
    expect(looksSecret(fakeJwt('anon'))).toBe(false);
    expect(looksSecret('sb_secret_abc')).toBe(true);
    expect(looksSecret('sb_publishable_abc')).toBe(false);
  });
  it('مقارنة الكلمات المسموعة (تعرّف وليس تقييم نطق)', () => {
    const r = compareWords("I'm fine, thanks.", ['I am fine thank you']);
    expect(r.map((x) => x.heard)).toEqual([true, true, false]);
  });
});
