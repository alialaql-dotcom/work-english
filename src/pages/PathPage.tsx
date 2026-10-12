import { Link } from 'react-router-dom';
import { UNITS, UPCOMING_UNITS } from '../content';
import { Icon } from '../components/ui';
import { lessonState, unitTestAvailable } from '../lib/path';
import { useProgress } from '../state/ProgressContext';

const STATE_LABEL = {
  done: 'مكتمل',
  current: 'الدرس الحالي',
  available: 'متاح',
  skippable: 'يمكنك تخطيه حسب اختبار المستوى',
  locked: 'مقفل',
} as const;

export function PathPage() {
  const { progress } = useProgress();
  return (
    <div>
      <h1>المسار</h1>
      <p className="muted">من الأساسيات إلى مواقف العمل، ثم نحو B1.</p>
      {UNITS.map((u) => {
        const testOpen = unitTestAvailable(progress, u.id);
        const testRec = progress.unitTests[u.id];
        return (
          <section key={u.id} style={{ marginBottom: 24 }} aria-labelledby={`unit-${u.id}`}>
            <div className="row between">
              <h2 id={`unit-${u.id}`} style={{ margin: 0 }}>
                {u.title}
              </h2>
              <span className="chip en">{u.cefr}</span>
            </div>
            <p className="small muted">{u.description}</p>
            {u.lessons.map((l, i) => {
              const st = lessonState(progress, l.id);
              const rec = progress.lessons[l.id];
              const inner = (
                <>
                  <span className="status" aria-hidden>
                    {st === 'done' ? <Icon name="check" /> : st === 'locked' ? <Icon name="lock" /> : <span className="en">{i + 1}</span>}
                  </span>
                  <span className="grow">
                    <b style={{ display: 'block' }}>{l.title}</b>
                    <span className="small muted">
                      {STATE_LABEL[st]}
                      {rec ? ` · أفضل نتيجة ${Math.round(rec.bestScore * 100)}%` : ''}
                    </span>
                  </span>
                </>
              );
              return st === 'locked' ? (
                <div key={l.id} className="list-item" aria-disabled="true">
                  {inner}
                </div>
              ) : (
                <Link key={l.id} to={`/lesson/${l.id}`} className={`list-item ${st}`}>
                  {inner}
                </Link>
              );
            })}
            {testOpen ? (
              <Link to={`/test/${u.id}`} className={`list-item${testRec?.passed ? ' done' : ''}`}>
                <span className="status" aria-hidden>
                  <Icon name={testRec?.passed ? 'check' : 'star'} />
                </span>
                <span className="grow">
                  <b style={{ display: 'block' }}>اختبار الوحدة</b>
                  <span className="small muted">{testRec ? `أفضل نتيجة ${Math.round(testRec.score * 100)}%${testRec.passed ? ' · ناجح' : ''}` : 'جاهز'}</span>
                </span>
              </Link>
            ) : (
              <div className="list-item" aria-disabled="true">
                <span className="status" aria-hidden>
                  <Icon name="lock" />
                </span>
                <span className="grow">
                  <b style={{ display: 'block' }}>اختبار الوحدة</b>
                  <span className="small muted">يُفتح بعد إكمال دروس الوحدة</span>
                </span>
              </div>
            )}
          </section>
        );
      })}
      <section>
        <h2>قريبًا</h2>
        <p className="small muted">هذه الوحدات غير متاحة بعد، وتُضاف تباعًا.</p>
        {UPCOMING_UNITS.map((u) => (
          <div key={u.title} className="list-item" aria-disabled="true">
            <span className="status" aria-hidden>
              <Icon name="lock" />
            </span>
            <span className="grow">
              <b style={{ display: 'block' }}>{u.title}</b>
              <span className="small muted en" dir="ltr" style={{ display: 'block', textAlign: 'right' }}>
                {u.titleEn} · {u.cefr}
              </span>
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}
