import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { findUnit } from '../content';
import { SKILL_LABELS, type Skill } from '../content/types';
import { ExerciseRunner, type RunnerOutcome } from '../components/ExerciseRunner';
import { recordAttempt, recordUnitTest, UNIT_TEST_PASS } from '../lib/progress';
import { unitTestAvailable } from '../lib/path';
import { gradeScore } from './LessonPage';
import { useG, useProgress } from '../state/ProgressContext';

export function UnitTestPage() {
  const { unitId = '' } = useParams();
  const unit = findUnit(unitId);
  const { progress, update } = useProgress();
  const g = useG();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'intro' | 'run' | 'done'>('intro');
  const [result, setResult] = useState<{ score: number; bySkill: Record<string, { s: number; n: number }> } | null>(null);

  if (!unit) return <p>الوحدة غير موجودة.</p>;
  if (!unitTestAvailable(progress, unit.id))
    return (
      <div className="card">
        <h2>اختبار الوحدة غير متاح بعد</h2>
        <p>يُفتح بعد إكمال كل دروس الوحدة.</p>
        <Link className="btn primary" to="/path">
          المسار
        </Link>
      </div>
    );

  if (phase === 'intro')
    return (
      <div>
        <h1>اختبار الوحدة: {unit.title}</h1>
        <div className="card soft">
          <p>{unit.test.length} أسئلة تجمع الاستماع والقراءة والقواعد والكتابة والمحادثة. بدون شرح مسبق.</p>
          <p style={{ margin: 0 }}>النجاح: {Math.round(UNIT_TEST_PASS * 100)}% أو أكثر. يمكنك الإعادة في أي وقت.</p>
        </div>
        <button type="button" className="btn primary block" onClick={() => setPhase('run')}>
          ابدأ الاختبار
        </button>
      </div>
    );

  if (phase === 'run')
    return (
      <ExerciseRunner
        exercises={unit.test}
        title={`اختبار ${unit.title}`}
        onExit={() => navigate('/path')}
        onAnswer={(o: RunnerOutcome) => {
          update((p, t, dev) =>
            recordAttempt(p, { exerciseId: o.ex.id, skill: o.ex.skill, itemIds: o.ex.itemIds ?? [], mode: `test:${o.ex.type}`, grade: o.result.grade, prompt: o.ex.prompt, given: o.result.given, expected: o.result.expected }, t, dev),
          );
        }}
        onComplete={(all) => {
          const score = all.reduce((s, o) => s + gradeScore(o.result.grade), 0) / all.length;
          const bySkill: Record<string, { s: number; n: number }> = {};
          for (const o of all) {
            const k = o.ex.skill;
            bySkill[k] = bySkill[k] ?? { s: 0, n: 0 };
            bySkill[k].s += gradeScore(o.result.grade);
            bySkill[k].n += 1;
          }
          update((p, t, dev) => recordUnitTest(p, unit.id, score, t, dev));
          setResult({ score, bySkill });
          setPhase('done');
        }}
      />
    );

  const passed = (result?.score ?? 0) >= UNIT_TEST_PASS;
  return (
    <div>
      <div className={`card ${passed ? 'primary' : ''}`}>
        <h1>{passed ? g('نجحت في اختبار الوحدة!', 'نجحتِ في اختبار الوحدة!', 'تم اجتياز اختبار الوحدة!') : 'لم تكتمل الوحدة بعد'}</h1>
        <p className="en" style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
          {Math.round((result?.score ?? 0) * 100)}%
        </p>
      </div>
      <div className="card">
        <h2>حسب المهارة</h2>
        {Object.entries(result?.bySkill ?? {}).map(([k, v]) => (
          <div key={k} className="row between">
            <span>{SKILL_LABELS[k as Skill]}</span>
            <span className="en">
              {Math.round((v.s / v.n) * 100)}%
            </span>
          </div>
        ))}
      </div>
      {!passed && <p>راجع الدروس التي تعثرت فيها، ثم أعد الاختبار. المراجعة اليومية تساعدك أكثر من إعادة الاختبار مباشرة.</p>}
      <Link to="/path" className="btn primary block">
        المسار
      </Link>
    </div>
  );
}
