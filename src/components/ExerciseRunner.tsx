import { useEffect, useRef, useState } from 'react';
import type { Exercise } from '../content/types';
import type { GeneratedExercise } from '../lib/exerciseGen';
import { ExerciseView, type ExerciseResult } from './ExerciseView';
import { Icon, ProgressBar } from './ui';

export interface RunnerOutcome {
  ex: Exercise | GeneratedExercise;
  result: ExerciseResult;
}

/** يشغّل قائمة تمارين واحدًا تلو الآخر (للمراجعة واختبار الوحدة) */
export function ExerciseRunner({
  exercises,
  title,
  onAnswer,
  onComplete,
  onExit,
}: {
  exercises: Array<Exercise | GeneratedExercise>;
  title: string;
  /** يعيد عدد التمارين التي أضافها الأب لنهاية القائمة (لإعادة الاختبار في سياق مختلف) */
  onAnswer?: (o: RunnerOutcome) => number | void;
  onComplete: (all: RunnerOutcome[]) => void;
  onExit: () => void;
}) {
  const [i, setI] = useState(0);
  const [all, setAll] = useState<RunnerOutcome[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
    window.scrollTo?.(0, 0);
  }, [i]);
  const ex = exercises[i];
  if (!ex) return null;
  return (
    <div>
      <div className="lesson-head">
        <button type="button" className="btn ghost icon" onClick={onExit} aria-label="خروج">
          <Icon name="x" />
        </button>
        <ProgressBar value={i / exercises.length} label={title} />
        <span className="small muted en" aria-hidden>
          {i + 1}/{exercises.length}
        </span>
      </div>
      <div ref={ref} tabIndex={-1} style={{ outline: 'none' }}>
        <span className="chip primary">{title}</span>
        <div style={{ marginTop: 12 }} />
        <ExerciseView
          key={`${i}-${ex.id}`}
          exercise={ex}
          onDone={(result) => {
            const o = { ex, result };
            const added = onAnswer?.(o) || 0;
            const next = [...all, o];
            setAll(next);
            if (i + 1 < exercises.length + added) setI(i + 1);
            else onComplete(next);
          }}
        />
      </div>
    </div>
  );
}
