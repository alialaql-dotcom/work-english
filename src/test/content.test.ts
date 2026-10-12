import { describe, expect, it } from 'vitest';
import { ALL_LESSONS, UNITS } from '../content';
import { VOCAB, VOCAB_LIST } from '../content/vocab';
import { PLACEMENT } from '../content/placement';
import type { Exercise } from '../content/types';
import { makeCloze } from '../lib/exerciseGen';
import { normalize } from '../lib/answer';

function allExercises(): Exercise[] {
  const out: Exercise[] = [];
  for (const u of UNITS) {
    out.push(...u.test);
    for (const l of u.lessons)
      for (const s of l.steps) {
        if (s.kind === 'practice' || s.kind === 'quiz') out.push(...s.exercises);
        if (s.kind === 'listen') out.push(...s.questions);
      }
  }
  return out;
}

describe('سلامة المحتوى', () => {
  it('معرفات المفردات والدروس والتمارين فريدة', () => {
    expect(new Set(VOCAB_LIST.map((v) => v.id)).size).toBe(VOCAB_LIST.length);
    expect(new Set(ALL_LESSONS.map((l) => l.id)).size).toBe(ALL_LESSONS.length);
    const ex = allExercises();
    expect(new Set(ex.map((e) => e.id)).size).toBe(ex.length);
  });

  it('كل مفردة لها الحقول الأساسية للبطاقة', () => {
    for (const v of VOCAB_LIST) {
      expect(v.en, v.id).toBeTruthy();
      expect(v.ar, v.id).toBeTruthy();
      expect(v.ipa, v.id).toMatch(/^\/.*\/$/);
      expect(v.arApprox, v.id).toBeTruthy();
      expect(v.example.en, v.id).toBeTruthy();
      expect(v.example.ar, v.id).toBeTruthy();
    }
  });

  it('كلمة الإكمال موجودة فعلًا داخل المثال', () => {
    for (const v of VOCAB_LIST) if (v.cloze) expect(makeCloze(v.example.en, v.cloze), v.id).not.toBeNull();
  });

  it('كل المراجع لمفردات موجودة', () => {
    for (const l of ALL_LESSONS)
      for (const s of l.steps) {
        if (s.kind === 'vocab' || s.kind === 'drill') for (const id of s.itemIds) expect(VOCAB[id], `${l.id}:${id}`).toBeDefined();
      }
    for (const e of allExercises()) for (const id of e.itemIds ?? []) expect(VOCAB[id], `${e.id}:${id}`).toBeDefined();
  });

  it('كل مفردة تُقدَّم في درس واحد على الأقل', () => {
    const introduced = new Set(ALL_LESSONS.flatMap((l) => l.steps.flatMap((s) => (s.kind === 'vocab' ? s.itemIds : []))));
    for (const v of VOCAB_LIST) expect(introduced.has(v.id), v.id).toBe(true);
  });

  it('الإجابات الصحيحة صالحة في كل تمرين', () => {
    for (const e of allExercises()) {
      if (e.type === 'choice') {
        expect(e.answer, e.id).toBeGreaterThanOrEqual(0);
        expect(e.answer, e.id).toBeLessThan(e.options.length);
        expect(new Set(e.options).size, e.id).toBe(e.options.length);
      }
      if (e.type === 'fill') {
        expect(e.sentence, e.id).toContain('___');
        if (e.bank) expect(e.bank.map(normalize), e.id).toContain(normalize(e.answers[0]));
      }
      if (e.type === 'order') expect(e.words.length, e.id).toBeGreaterThan(1);
      if (e.type === 'type') expect(e.answers.length, e.id).toBeGreaterThan(0);
      if (e.type === 'dialogue') {
        const staff = e.turns.filter((t) => t.speaker === 'staff');
        expect(staff.length, e.id).toBeGreaterThan(0);
        for (const t of staff) if ('options' in t) expect(t.answer, e.id).toBeLessThan(t.options.length);
      }
    }
  });

  it('كل درس ضمن 10 دقائق تقريبًا ويحتوي اختبارًا', () => {
    for (const l of ALL_LESSONS) {
      expect(l.minutes, l.id).toBeLessThanOrEqual(12);
      expect(l.steps.some((s) => s.kind === 'quiz'), l.id).toBe(true);
    }
  });

  it('اختبار تحديد المستوى صالح', () => {
    for (const q of PLACEMENT) expect(q.answer).toBeLessThan(q.options.length);
    expect(PLACEMENT.filter((q) => q.tier === 1)).toHaveLength(4);
  });

  it('حجم المحتوى الحالي', () => {
    expect(VOCAB_LIST.length).toBeGreaterThanOrEqual(180);
    expect(ALL_LESSONS.length).toBe(28);
    expect(UNITS.map((u) => u.order)).toEqual([0, 1, 2, 3, 4]);
  });
});
