// يمر على كل الدروس وكل اختبارات الوحدات من البداية للنهاية للتأكد أنها تعمل دون أعطال وتحفظ النتيجة.
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { ALL_LESSONS, UNITS } from '../content';
import { emptyProgress } from '../lib/progress';
import { loadLocal, saveLocal } from '../lib/sync';
import { ProgressProvider } from '../state/ProgressContext';
import { APP_VERSION, CHANGELOG } from '../version';

const NEXT = /^(ابدأ|ابدأ الاختبار|التالي|فهمت — التالي|متابعة|متابعة المحادثة|كرّرتها — التالي|أظهر النص والترجمة|اختبر فهمك \(بدون نص\))$/;

function seedAllDone() {
  const p = emptyProgress(Date.now());
  p.profile = { name: 'T', gender: 'm', onboarded: true, updatedAt: 1 };
  p.placement = { level: 'A1', startLessonId: 'u0l1', skippedLessonIds: [], tierScores: { 1: { correct: 4, total: 4 }, 2: { correct: 4, total: 4 }, 3: { correct: 0, total: 4 } }, summary: '', at: 1 };
  for (const l of ALL_LESSONS) p.lessons[l.id] = { completedAt: 1, bestScore: 1, lastScore: 1, attempts: 1, updatedAt: 1 };
  saveLocal(p);
}

async function walk(doneText: RegExp) {
  let idle = 0;
  for (let guard = 0; guard < 800; guard++) {
    await act(async () => {
      await new Promise((r) => setTimeout(r, 15));
    });
    if (screen.queryByText(doneText)) return;
    const next = screen.queryByRole('button', { name: NEXT });
    if (next) {
      fireEvent.click(next);
      idle = 0;
      continue;
    }
    const opts = [...document.querySelectorAll<HTMLButtonElement>('.option:not([disabled])')];
    if (opts.length) {
      fireEvent.click(opts[0]);
      idle = 0;
      continue;
    }
    const words = [...document.querySelectorAll<HTMLButtonElement>('.wordbank .word:not([disabled])')];
    if (words.length) {
      fireEvent.click(words[0]);
      const check = screen.queryByRole('button', { name: 'تحقق' });
      if (check && !check.hasAttribute('disabled')) fireEvent.click(check);
      continue;
    }
    const box = screen.queryByRole('textbox');
    if (box) {
      fireEvent.change(box, { target: { value: 'test answer' } });
      fireEvent.click(screen.getByRole('button', { name: 'تحقق' }));
      continue;
    }
    // انتظار انتقال تلقائي (مثل أدوار العميل في المحادثة)
    if (++idle > 20) throw new Error('شاشة غير متوقعة: ' + document.body.textContent?.slice(0, 300));
    continue;
  }
  throw new Error('لم ينتهِ');
}

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  seedAllDone();
});
afterEach(() => cleanup());

describe('كل الدروس تعمل من البداية للنهاية', () => {
  for (const l of ALL_LESSONS) {
    it(`${l.id} ${l.title}`, async () => {
      render(
        <MemoryRouter initialEntries={[`/lesson/${l.id}`]}>
          <ProgressProvider>
            <App />
          </ProgressProvider>
        </MemoryRouter>,
      );
      expect(screen.getByRole('heading', { name: l.title })).toBeInTheDocument();
      await walk(/انتهى الدرس|أكملت الدرس/);
      expect(loadLocal().lessons[l.id].attempts).toBe(2);
    });
  }
  for (const u of UNITS) {
    it(`اختبار الوحدة ${u.id}`, async () => {
      render(
        <MemoryRouter initialEntries={[`/test/${u.id}`]}>
          <ProgressProvider>
            <App />
          </ProgressProvider>
        </MemoryRouter>,
      );
      await walk(/نجحت في اختبار الوحدة|لم تكتمل الوحدة بعد/);
      expect(loadLocal().unitTests[u.id]).toBeDefined();
    });
  }
});

describe('الإصدار', () => {
  it('رقم الإصدار متطابق في التطبيق وسجل التغييرات وذاكرة العمل دون اتصال', () => {
    expect(CHANGELOG[0].version).toBe(APP_VERSION);
    const sw = readFileSync(resolve(__dirname, '../../public/sw.js'), 'utf8');
    expect(sw).toContain(`'we-${APP_VERSION}'`);
    const pkg = JSON.parse(readFileSync(resolve(__dirname, '../../package.json'), 'utf8'));
    expect(pkg.version).toBe(APP_VERSION);
  });
});
