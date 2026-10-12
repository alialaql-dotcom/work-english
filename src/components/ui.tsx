import { useEffect, useState, type ReactNode } from 'react';
import { speak, stopSpeaking, ttsSupported } from '../lib/speech';
import { useProgress } from '../state/ProgressContext';

const paths: Record<string, ReactNode> = {
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  path: (
    <>
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5" />
    </>
  ),
  review: (
    <>
      <path d="M4 12a8 8 0 1 0 2.3-5.6" />
      <path d="M4 4v4h4" />
      <path d="M12 8v4l3 2" />
    </>
  ),
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </>
  ),
  play: <path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none" />,
  stop: <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none" />,
  slow: (
    <>
      <path d="M3 17h14a4 4 0 0 0 0-8h-1" />
      <path d="M3 17c0-4 2.5-8 7-8s5 3 5 5" />
      <circle cx="19" cy="9" r="1.5" />
    </>
  ),
  check: <path d="M5 12.5 10 17l9-10" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </>
  ),
  flame: <path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-3.5 2-5 .5 1.5 1.5 2 2 2 0-2.5 0-4.5 1-7z" />,
  back: <path d="M9 6l6 6-6 6" />,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
  cloud: <path d="M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 9.5a4 4 0 0 1-.5 8.5z" />,
  book: (
    <>
      <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" />
      <path d="M4 19V5" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
};

export function Icon({ name, label }: { name: keyof typeof paths | string; label?: string }) {
  return (
    <svg width="1.15em" height="1.15em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden={label ? undefined : true} role={label ? 'img' : undefined} aria-label={label}>
      {paths[name]}
    </svg>
  );
}

export function ProgressBar({ value, accent, label }: { value: number; accent?: boolean; label?: string }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div className={`bar${accent ? ' accent' : ''}`} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}

/** زر صوت مع إعادة وإبطاء وإيقاف. يعتمد على صوت المتصفح المجاني. */
export function SpeakButton({ text, autoPlay, compact, minimal, label = 'استمع' }: { text: string; autoPlay?: boolean; compact?: boolean; minimal?: boolean; label?: string }) {
  const { progress } = useProgress();
  const [playing, setPlaying] = useState(false);
  const supported = ttsSupported();
  const play = (rate: number) => {
    const ok = speak(text, { rate, voiceURI: progress.settings.voiceURI, onEnd: () => setPlaying(false) });
    setPlaying(ok);
  };
  useEffect(() => {
    if (autoPlay && supported) {
      const t = setTimeout(() => play(progress.settings.rate), 250);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, autoPlay]);
  useEffect(() => () => stopSpeaking(), []);

  if (!supported) {
    return <span className="chip warn">الصوت غير مدعوم في هذا المتصفح</span>;
  }
  return (
    <div className="audio-controls">
      <button type="button" className={`btn ${compact ? 'small secondary' : 'primary'}`} onClick={() => play(progress.settings.rate)} aria-label={`${label}: تشغيل`}>
        <Icon name="play" />
        {!compact && (playing ? 'يعمل…' : label)}
      </button>
      {!minimal && <button type="button" className="btn small secondary" onClick={() => play(Math.max(0.5, progress.settings.rate - 0.3))} aria-label="تشغيل ببطء">
        <Icon name="slow" />
        {!compact && 'ببطء'}
      </button>}
      {playing && (
        <button
          type="button"
          className="btn small secondary icon"
          onClick={() => {
            stopSpeaking();
            setPlaying(false);
          }}
          aria-label="إيقاف"
        >
          <Icon name="stop" />
        </button>
      )}
    </div>
  );
}

export function En({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`en ${className}`} lang="en" dir="ltr">
      {children}
    </span>
  );
}

export function Spinner({ label = 'جارٍ التحميل' }: { label?: string }) {
  return (
    <div role="status">
      <div className="spinner" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

/** تأكيد داخل الصفحة بدل نوافذ المتصفح (التي قد تُحجب في بعض البيئات) */
export function ConfirmButton({
  children,
  message,
  confirmLabel,
  onConfirm,
  className = 'btn danger block',
}: {
  children: ReactNode;
  message: string;
  confirmLabel: string;
  onConfirm: () => void | Promise<void>;
  className?: string;
}) {
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);
  if (!asking)
    return (
      <button type="button" className={className} onClick={() => setAsking(true)}>
        {children}
      </button>
    );
  return (
    <div className="banner bad" role="alertdialog" aria-label={message}>
      <p style={{ marginTop: 0 }}>{message}</p>
      <div className="row">
        <button
          type="button"
          className="btn danger small"
          disabled={busy}
          autoFocus
          onClick={async () => {
            setBusy(true);
            try {
              await onConfirm();
            } finally {
              setBusy(false);
              setAsking(false);
            }
          }}
        >
          {confirmLabel}
        </button>
        <button type="button" className="btn secondary small" onClick={() => setAsking(false)}>
          إلغاء
        </button>
      </div>
    </div>
  );
}

/** نص عربي فيه جمل إنجليزية: يعزل كل مقطع إنجليزي حتى لا تختلط الاتجاهات وعلامات الترقيم */
export function BidiText({ text }: { text: string }) {
  const parts = text.split(/([A-Za-z][A-Za-z0-9 .,'’?!\-…/:]*[A-Za-z0-9.?!…])/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <bdi key={i} dir="ltr" lang="en" className="en">
            {p}
          </bdi>
        ) : (
          p
        ),
      )}
    </>
  );
}
