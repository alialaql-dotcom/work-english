import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DONT_KNOW, LEVEL_LABELS, PLACEMENT, scorePlacement, shouldStopPlacement, type PlacementResult } from '../content/placement';
import { findLesson } from '../content';
import { En, SpeakButton } from '../components/ui';
import type { Gender } from '../lib/progress';
import { useProgress } from '../state/ProgressContext';

export function OnboardingPage() {
  const { progress, update, cloudAvailable } = useProgress();
  const navigate = useNavigate();
  const [step, setStep] = useState<'welcome' | 'profile' | 'placement'>(progress.profile.onboarded ? 'placement' : 'welcome');
  const [name, setName] = useState(progress.profile.name);
  const [gender, setGender] = useState<Gender>(progress.profile.gender);

  if (step === 'welcome')
    return (
      <div>
        <div className="brand" style={{ marginBottom: 20 }}>
          <span className="brand-mark">EN</span> إنجليزي العمل
        </div>
        <h1>تعلّم الإنجليزية التي تحتاجها في قسم الإلكترونيات</h1>
        <p>دروس قصيرة (حوالي 10 دقائق يوميًا) تبدأ من مستواك الفعلي: الترحيب بالعميل، فهم احتياجه، الأجهزة والإكسسوارات، الميزانية، وما تقوله عندما لا تفهم.</p>
        <div className="card soft small">
          <b>قبل أن تبدأ، بوضوح:</b>
          <ul style={{ margin: '6px 0 0', paddingInlineStart: 18 }}>
            <li>المحادثات افتراضية للتدريب، وأي أسعار فيها أمثلة وليست أسعار جرير أو سياساته.</li>
            <li>الموقع يشغّل الصوت ويتعرف على الكلمات المنطوقة إن دعم متصفحك ذلك، لكنه لا يقيّم دقة نطقك.</li>
            <li>المنهج الحالي يغطي الأساسيات ووحدة الترحيب وفهم الاحتياج. بقية الوحدات حتى B1 قادمة.</li>
            <li>{cloudAvailable ? 'يُحفظ تقدمك على جهازك، وتستطيع إنشاء حساب لمزامنته بين الهاتف والكمبيوتر.' : 'يُحفظ تقدمك على هذا الجهاز فقط في هذه النسخة.'}</li>
          </ul>
        </div>
        <button type="button" className="btn primary block" onClick={() => setStep('profile')}>
          ابدأ
        </button>
        {cloudAvailable && (
          <button type="button" className="btn ghost block" onClick={() => navigate('/account')}>
            لدي حساب — تسجيل الدخول
          </button>
        )}
      </div>
    );

  if (step === 'profile')
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          update((p, now) => ({ ...p, profile: { name: name.trim().slice(0, 40), gender, onboarded: true, updatedAt: now }, updatedAt: now }));
          setStep('placement');
        }}
      >
        <h1>تعارف سريع</h1>
        <label className="field">
          <span>الاسم (اختياري)</span>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} autoComplete="given-name" />
        </label>
        <fieldset className="field" style={{ border: 0, padding: 0, margin: '0 0 14px' }}>
          <span style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: 6 }}>كيف تفضّل أن نخاطبك؟</span>
          <div className="options">
            {(
              [
                ['m', 'بصيغة المذكر (أحسنت)'],
                ['f', 'بصيغة المؤنث (أحسنتِ)'],
                ['n', 'صيغة محايدة قدر الإمكان'],
              ] as const
            ).map(([k, label]) => (
              <label key={k} className={`btn option${gender === k ? ' selected' : ''}`}>
                <input type="radio" name="gender" value={k} checked={gender === k} onChange={() => setGender(k)} style={{ accentColor: 'var(--primary)' }} />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <button className="btn primary block">التالي</button>
      </form>
    );

  return <PlacementFlow onDone={() => navigate('/')} />;
}

export function PlacementFlow({ onDone }: { onDone: () => void }) {
  const { update } = useProgress();
  const [phase, setPhase] = useState<'intro' | 'test' | 'result'>('intro');
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<PlacementResult | null>(null);

  const save = (r: PlacementResult) => {
    update((p, now) => ({ ...p, placement: { ...r, at: now }, updatedAt: now }));
  };

  const finish = (a: Record<string, number>) => {
    const r = scorePlacement(a);
    setResult(r);
    save(r);
    setPhase('result');
  };

  if (phase === 'intro')
    return (
      <div>
        <h1>اختبار تحديد المستوى</h1>
        <p>أسئلة قصيرة (12 كحد أقصى، وأقل إذا كنت مبتدئًا) لنعرف من أين نبدأ. لا يوجد نجاح أو رسوب.</p>
        <div className="banner info">
          إذا لم تعرف الإجابة، اضغط <b>«لا أعرف»</b> بدل التخمين — هذا يجعل مسارك أدق.
        </div>
        <button type="button" className="btn primary block" onClick={() => setPhase('test')}>
          ابدأ الاختبار
        </button>
        <button
          type="button"
          className="btn ghost block"
          onClick={() => {
            const r = scorePlacement({});
            save({ ...r, summary: 'اخترت البدء من الأساسيات مباشرة.' });
            onDone();
          }}
        >
          تخطَّ — ابدأ من الأساسيات
        </button>
      </div>
    );

  if (phase === 'result' && result) {
    const start = findLesson(result.startLessonId);
    return (
      <div>
        <h1>نتيجتك</h1>
        <div className="card primary">
          <p className="small" style={{ margin: 0, opacity: 0.85 }}>
            تقدير أولي
          </p>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{LEVEL_LABELS[result.level]}</p>
        </div>
        <p>{result.summary}</p>
        <div className="card soft">
          <b>نقطة البداية:</b> {start?.title}
        </div>
        <p className="small muted">هذا تقدير من اختبار قصير بالاختيار من متعدد، وليس شهادة مستوى. سيتحسن التقدير مع نتائج الدروس واختبارات الوحدات.</p>
        <button type="button" className="btn primary block" onClick={onDone}>
          إلى الصفحة الرئيسية
        </button>
      </div>
    );
  }

  const q = PLACEMENT[i];
  const answer = (v: number) => {
    const a = { ...answers, [q.id]: v };
    setAnswers(a);
    if (i + 1 >= PLACEMENT.length || shouldStopPlacement(a)) finish(a);
    else setI(i + 1);
  };
  const ltr = q.optionsDir === 'ltr';
  return (
    <div>
      <div className="row between" style={{ marginBottom: 14 }}>
        <span className="chip primary">
          سؤال {i + 1}
        </span>
        <span className="small muted">تحديد المستوى</span>
      </div>
      <div className="prompt">{q.prompt}</div>
      {q.audio && (
        <div className="card soft">
          <SpeakButton key={q.id} text={q.audio} autoPlay />
        </div>
      )}
      <div className="options" key={q.id}>
        {q.options.map((o, k) => (
          <button key={k} type="button" className={`btn option${ltr ? ' en' : ''}`} dir={ltr ? 'ltr' : undefined} onClick={() => answer(k)}>
            {ltr ? <En>{o}</En> : o}
          </button>
        ))}
        <button type="button" className="btn secondary" onClick={() => answer(DONT_KNOW)}>
          لا أعرف
        </button>
      </div>
    </div>
  );
}
