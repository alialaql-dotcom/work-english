import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { ExerciseView } from '../components/ExerciseView';
import { unit0 } from '../content/unit0';
import { unit1 } from '../content/unit1';
import type { Exercise } from '../content/types';
import { loadLocal } from '../lib/sync';
import { ProgressProvider } from '../state/ProgressContext';

function renderApp(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </MemoryRouter>,
  );
}

function findEx(id: string): Exercise {
  for (const u of [unit0, unit1]) {
    for (const e of u.test) if (e.id === id) return e;
    for (const l of u.lessons)
      for (const s of l.steps) {
        if (s.kind === 'practice' || s.kind === 'quiz') for (const e of s.exercises) if (e.id === id) return e;
        if (s.kind === 'listen') for (const e of s.questions) if (e.id === id) return e;
      }
  }
  throw new Error(id);
}

const btn = (name: string | RegExp) => screen.queryByRole('button', { name });

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  vi.spyOn(window, 'confirm').mockReturnValue(true);
});
afterEach(() => cleanup());

describe('التمارين: الإجابة الصحيحة والخاطئة', () => {
  const run = (ex: Exercise) => {
    const onDone = vi.fn();
    render(
      <ProgressProvider>
        <ExerciseView exercise={ex} onDone={onDone} />
      </ProgressProvider>,
    );
    return onDone;
  };

  it('اختيار صحيح من أول مرة = good', () => {
    const ex = findEx('u0l1-q1');
    const onDone = run(ex);
    fireEvent.click(screen.getByRole('button', { name: /Good morning! Welcome\./ }));
    expect(screen.getByText(/أحسنت|إجابة صحيحة/)).toBeInTheDocument();
    fireEvent.click(btn('متابعة')!);
    expect(onDone).toHaveBeenCalledWith(expect.objectContaining({ grade: 'good' }));
  });

  it('خطأ ثم صواب بعد التلميح = hard، والخيار الخاطئ يُعطَّل', () => {
    const ex = findEx('u0l1-q1');
    const onDone = run(ex);
    const wrong = screen.getByRole('button', { name: 'Good night!' });
    fireEvent.click(wrong);
    expect(wrong).toBeDisabled();
    expect(screen.getByText(/ليس تمامًا/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Good morning! Welcome\./ }));
    fireEvent.click(btn('متابعة')!);
    expect(onDone).toHaveBeenCalledWith(expect.objectContaining({ grade: 'hard' }));
  });

  it('خطآن في الاختيار = عرض الحل والشرح العربي = again', () => {
    const ex = findEx('u0l2-q1');
    const onDone = run(ex);
    fireEvent.click(screen.getByRole('button', { name: 'Welcome to the store.' }));
    fireEvent.click(screen.getByRole('button', { name: 'Excuse me.' }));
    expect(screen.getByText('الإجابة الصحيحة')).toBeInTheDocument();
    expect(screen.getByText(/الرد على الشكر/)).toBeInTheDocument();
    fireEvent.click(btn('متابعة')!);
    expect(onDone).toHaveBeenCalledWith(expect.objectContaining({ grade: 'again' }));
  });

  it('إكمال الفراغ من بنك الكلمات', () => {
    const onDone = run(findEx('u0l3-p1'));
    fireEvent.click(screen.getByRole('button', { name: 'is' }));
    fireEvent.click(btn('متابعة')!);
    expect(onDone).toHaveBeenCalledWith(expect.objectContaining({ grade: 'good' }));
  });

  it('ترتيب الكلمات: الخطأ يفرّغ الجملة، والصحيح يُقبل', () => {
    const ex = findEx('u0l4-q2') as Extract<Exercise, { type: 'order' }>;
    const onDone = run(ex);
    const bank = () => document.querySelectorAll('.wordbank .word:not(.used)');
    // ترتيب خاطئ: بالعكس
    for (const w of [...ex.words].reverse()) fireEvent.click(within(document.querySelector('.wordbank') as HTMLElement).getByRole('button', { name: w }));
    fireEvent.click(btn('تحقق')!);
    expect(screen.getByText(/الجملة تبدأ بـ/)).toBeInTheDocument();
    expect(bank().length).toBe(ex.words.length);
    for (const w of ex.words) fireEvent.click(within(document.querySelector('.wordbank') as HTMLElement).getByRole('button', { name: w }));
    fireEvent.click(btn('تحقق')!);
    fireEvent.click(btn('متابعة')!);
    expect(onDone).toHaveBeenCalledWith(expect.objectContaining({ grade: 'hard' }));
  });

  it('الكتابة الحرة تُقبل بالكلمات المطلوبة وتعرض الصيغة النموذجية', () => {
    const onDone = run(findEx('u1l2-q2'));
    const box = screen.getByRole('textbox');
    fireEvent.change(box, { target: { value: 'Just a moment please' } });
    fireEvent.click(btn('تحقق')!);
    expect(screen.getByText(/صحيح|أحسنت/)).toBeInTheDocument();
    fireEvent.click(btn('متابعة')!);
    expect(onDone).toHaveBeenCalledWith(expect.objectContaining({ grade: 'good' }));
  });

  it('خطأ إملائي بسيط = صحيح مع تنبيه (hard)', () => {
    const onDone = run(findEx('u1l5-q3'));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'What is your budjet' } });
    fireEvent.click(btn('تحقق')!);
    expect(screen.getByText(/انتبه للإملاء/)).toBeInTheDocument();
    fireEvent.click(btn('متابعة')!);
    expect(onDone).toHaveBeenCalledWith(expect.objectContaining({ grade: 'hard' }));
  });

  it('المحادثة الكاملة بالردود الصحيحة', async () => {
    const ex = findEx('u1l1-d1') as Extract<Exercise, { type: 'dialogue' }>;
    const onDone = run(ex);
    for (const t of ex.turns) {
      if (t.speaker !== 'staff') continue;
      await act(async () => {
        await new Promise((r) => setTimeout(r, 80));
      });
      fireEvent.click(screen.getByRole('button', { name: t.options[t.answer] }));
    }
    await act(async () => {
      await new Promise((r) => setTimeout(r, 80));
    });
    fireEvent.click(btn('متابعة')!);
    expect(onDone).toHaveBeenCalledWith(expect.objectContaining({ grade: 'good' }));
  });
});

describe('التدفق الكامل', () => {
  it('مستخدم جديد: تعارف ← تخطي الاختبار ← درس كامل بإجابات خاطئة ← حفظ النتيجة والأخطاء دون فتح الدرس التالي', async () => {
    renderApp('/');
    // إعادة توجيه لصفحة الترحيب
    fireEvent.click(btn('ابدأ')!);
    fireEvent.change(screen.getByLabelText(/الاسم/), { target: { value: 'سعد' } });
    fireEvent.click(screen.getByLabelText(/بصيغة المذكر/));
    fireEvent.click(btn('التالي')!);
    fireEvent.click(btn(/تخطَّ/)!);
    expect(await screen.findByText(/صباح الخير يا سعد|مساء الخير يا سعد/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('link', { name: /ابدأ الدرس/ }));
    expect(screen.getByRole('heading', { name: 'التحية' })).toBeInTheDocument();

    for (let guard = 0; guard < 400; guard++) {
      await act(async () => {
        await new Promise((r) => setTimeout(r, 60));
      });
      if (screen.queryByText(/انتهى الدرس|أكملت الدرس/)) break;
      const next = btn(/^(ابدأ|التالي|فهمت — التالي|متابعة|متابعة المحادثة|كرّرتها — التالي|أظهر النص والترجمة|اختبر فهمك \(بدون نص\))$/);
      if (next) {
        fireEvent.click(next);
        continue;
      }
      const opts = [...document.querySelectorAll<HTMLButtonElement>('.option:not([disabled])')];
      if (opts.length) {
        fireEvent.click(opts[opts.length - 1]);
        continue;
      }
      const words = [...document.querySelectorAll<HTMLButtonElement>('.wordbank .word:not([disabled])')];
      if (words.length) {
        fireEvent.click(words[0]);
        const check = btn('تحقق');
        if (check && !check.hasAttribute('disabled')) fireEvent.click(check);
        continue;
      }
      const box = screen.queryByRole('textbox');
      if (box) {
        fireEvent.change(box, { target: { value: 'zzz qqq' } });
        fireEvent.click(btn('تحقق')!);
        continue;
      }
      throw new Error('شاشة غير متوقعة: ' + document.body.textContent?.slice(0, 300));
    }
    expect(screen.getByText(/انتهى الدرس|أكملت الدرس/)).toBeInTheDocument();
    const p = loadLocal();
    expect(p.lessons.u0l1).toBeDefined();
    expect(p.lessons.u0l1.attempts).toBe(1);
    expect(Object.keys(p.items)).toEqual(expect.arrayContaining(['hello', 'good-morning', 'im-fine']));
    expect(p.mistakes.length).toBeGreaterThan(0);
    expect(p.profile.name).toBe('سعد');

    if (p.lessons.u0l1.bestScore < 0.6) {
      expect(screen.getByRole('button', { name: 'أعد الدرس' })).toBeInTheDocument();
      cleanup();
      renderApp('/lesson/u0l2');
      expect(screen.getByText('هذا الدرس مقفل حاليًا')).toBeInTheDocument();
    }
  });

  it('الصفحات الرئيسية تعمل بعد الإعداد', () => {
    renderApp('/welcome');
    fireEvent.click(btn('ابدأ')!);
    fireEvent.click(btn('التالي')!);
    fireEvent.click(btn(/تخطَّ/)!);
    for (const [link, heading] of [
      ['المسار', 'المسار'],
      ['المراجعة', 'المراجعة'],
      ['التقدم', 'التقدم'],
      ['الإعدادات', 'الإعدادات'],
    ]) {
      fireEvent.click(screen.getAllByRole('link', { name: new RegExp(link) })[0]);
      expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
    }
    // الحساب: السحابة غير مهيأة في الاختبار، ويجب أن يقول ذلك بوضوح
    fireEvent.click(screen.getByRole('link', { name: 'الحساب والمزامنة' }));
    expect(screen.getByText(/غير مهيأين في هذه النسخة/)).toBeInTheDocument();
  });

  it('اختبار تحديد المستوى يحدد نقطة البداية ويتوقف مبكرًا للمبتدئ', () => {
    renderApp('/welcome');
    fireEvent.click(btn('ابدأ')!);
    fireEvent.click(btn('التالي')!);
    fireEvent.click(btn('ابدأ الاختبار')!);
    for (let i = 0; i < 4; i++) fireEvent.click(btn('لا أعرف')!);
    expect(screen.getByText(/ما قبل A1/)).toBeInTheDocument();
    expect(loadLocal().placement?.startLessonId).toBe('u0l1');
  });

  it('الدروس المقفلة والوحدات القادمة معرّفة بوضوح في المسار', () => {
    renderApp('/welcome');
    fireEvent.click(btn('ابدأ')!);
    fireEvent.click(btn('التالي')!);
    fireEvent.click(btn(/تخطَّ/)!);
    fireEvent.click(screen.getAllByRole('link', { name: /المسار/ })[0]);
    expect(screen.getAllByText('مقفل').length).toBeGreaterThan(5);
    expect(screen.getByText('قريبًا')).toBeInTheDocument();
    expect(screen.getByText('التواصل مع الزملاء والمدير')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'المقارنة بين المنتجات' })).toBeInTheDocument();
  });
});
