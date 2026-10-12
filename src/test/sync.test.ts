import { beforeEach, describe, expect, it } from 'vitest';
import { completeLesson, emptyProgress, totalXp, type Progress } from '../lib/progress';
import { loadLocal, saveLocal, syncNow, type ProgressBackend } from '../lib/sync';

function memoryBackend(): ProgressBackend & { rows: Map<string, string> } {
  const rows = new Map<string, string>();
  return {
    rows,
    async fetch(uid) {
      const r = rows.get(uid);
      return r ? (JSON.parse(r) as Progress) : null;
    },
    async push(uid, p) {
      rows.set(uid, JSON.stringify(p));
    },
    async remove(uid) {
      rows.delete(uid);
    },
  };
}

const T = Date.UTC(2026, 9, 12, 9);

describe('المزامنة بين الأجهزة', () => {
  beforeEach(() => localStorage.clear());

  it('التخزين المحلي يحفظ ويستعيد، ويتعامل مع البيانات التالفة', () => {
    const p = completeLesson(emptyProgress(T), 'u0l1', 1, 60, T, 'd');
    saveLocal(p);
    expect(loadLocal().lessons.u0l1.bestScore).toBe(1);
    localStorage.setItem('we:progress:v1', '{not json');
    expect(Object.keys(loadLocal().lessons)).toHaveLength(0);
  });

  it('جهازان يدرسان دون اتصال ثم يتزامنان دون فقد', async () => {
    const backend = memoryBackend();
    const phone = completeLesson(emptyProgress(T), 'u0l1', 0.8, 300, T, 'phone');
    const pc = completeLesson(emptyProgress(T), 'u0l2', 0.9, 300, T + 1000, 'pc');

    const afterPhone = await syncNow(backend, 'user-1', phone);
    expect(Object.keys(afterPhone.lessons)).toEqual(['u0l1']);

    const afterPc = await syncNow(backend, 'user-1', pc);
    expect(Object.keys(afterPc.lessons).sort()).toEqual(['u0l1', 'u0l2']);

    // الهاتف يتزامن مرة أخرى فيستلم درس الكمبيوتر
    const phoneAgain = await syncNow(backend, 'user-1', afterPhone);
    expect(Object.keys(phoneAgain.lessons).sort()).toEqual(['u0l1', 'u0l2']);
    expect(totalXp(phoneAgain)).toBe(20);
  });

  it('أول تسجيل دخول يرفع التقدم المحلي للسحابة', async () => {
    const backend = memoryBackend();
    const local = completeLesson(emptyProgress(T), 'u0l1', 1, 60, T, 'd');
    await syncNow(backend, 'new-user', local);
    expect(backend.rows.has('new-user')).toBe(true);
  });

  it('فشل الشبكة لا يمس التقدم المحلي', async () => {
    const failing: ProgressBackend = {
      fetch: async () => {
        throw new Error('offline');
      },
      push: async () => {},
      remove: async () => {},
    };
    const local = completeLesson(emptyProgress(T), 'u0l1', 1, 60, T, 'd');
    saveLocal(local);
    await expect(syncNow(failing, 'u', local)).rejects.toThrow('offline');
    expect(loadLocal().lessons.u0l1).toBeDefined();
  });
});
