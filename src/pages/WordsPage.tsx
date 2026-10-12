import { useState } from 'react';
import { VOCAB_LIST } from '../content/vocab';
import { VocabCard } from '../components/LessonParts';
import { itemStatus } from '../lib/srs';
import { useProgress } from '../state/ProgressContext';

const STATUS = { new: 'جديدة', learning: 'قيد التعلم', struggling: 'متعثرة', mastered: 'متقنة' } as const;
const CHIP = { new: '', learning: 'primary', struggling: 'warn', mastered: 'ok' } as const;

export function WordsPage() {
  const { progress } = useProgress();
  const [open, setOpen] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const seen = VOCAB_LIST.filter((v) => progress.items[v.id]);
  const list = seen.filter((v) => !q || v.en.toLowerCase().includes(q.toLowerCase()) || v.ar.includes(q));
  return (
    <div>
      <h1>بطاقاتي</h1>
      <p className="muted">
        {seen.length} من {VOCAB_LIST.length} كلمة وعبارة في المنهج الحالي.
      </p>
      {seen.length > 0 && <input className="input" placeholder="ابحث بالعربية أو الإنجليزية" value={q} onChange={(e) => setQ(e.target.value)} aria-label="بحث" style={{ marginBottom: 12 }} />}
      {seen.length === 0 && <div className="card soft">ستظهر البطاقات هنا بعد أن تتعلمها في الدروس.</div>}
      {list.map((v) => {
        const st = itemStatus(progress.items[v.id]);
        return open === v.id ? (
          <div key={v.id}>
            <VocabCard item={v} />
            <button type="button" className="btn ghost small" onClick={() => setOpen(null)} style={{ marginTop: -6, marginBottom: 10 }}>
              إغلاق البطاقة
            </button>
          </div>
        ) : (
          <button key={v.id} type="button" className="list-item" onClick={() => setOpen(v.id)}>
            <span className="grow">
              <b className="en" dir="ltr" style={{ display: 'block', textAlign: 'right' }}>
                {v.en}
              </b>
              <span className="small muted">{v.ar}</span>
            </span>
            <span className={`chip ${CHIP[st]}`}>{STATUS[st]}</span>
          </button>
        );
      })}
    </div>
  );
}
