// واجهات الصوت المجانية في المتصفح.
// - النطق (Text-to-Speech): speechSynthesis — مدعوم في أغلب المتصفحات الحديثة.
// - التعرف على الكلام: SpeechRecognition — مدعوم في Chrome وEdge وSafari الحديث، وغير مدعوم في Firefox.
// مهم: التعرف على الكلام يخبرنا بالكلمات التي فهمها المتصفح، وليس تقييمًا لجودة النطق.

export function ttsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

let cachedVoices: SpeechSynthesisVoice[] = [];

export function englishVoices(): SpeechSynthesisVoice[] {
  if (!ttsSupported()) return [];
  const v = window.speechSynthesis.getVoices().filter((x) => x.lang.toLowerCase().startsWith('en'));
  if (v.length) cachedVoices = v;
  return cachedVoices;
}

export function onVoicesChanged(cb: () => void): () => void {
  if (!ttsSupported()) return () => {};
  const handler = () => cb();
  window.speechSynthesis.addEventListener?.('voiceschanged', handler);
  return () => window.speechSynthesis.removeEventListener?.('voiceschanged', handler);
}

function pickVoice(voiceURI?: string): SpeechSynthesisVoice | undefined {
  const voices = englishVoices();
  if (voiceURI) {
    const v = voices.find((x) => x.voiceURI === voiceURI);
    if (v) return v;
  }
  return voices.find((x) => x.lang === 'en-US') ?? voices.find((x) => x.lang === 'en-GB') ?? voices[0];
}

export interface SpeakOptions {
  rate?: number;
  voiceURI?: string;
  onEnd?: () => void;
}

export function speak(text: string, opts: SpeakOptions = {}): boolean {
  if (!ttsSupported()) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  // نزيل الأقواس التوضيحية والرموز حتى لا تُقرأ
  const clean = text.replace(/\(.*?\)/g, '').replace(/[“”«»—…]/g, ' ').trim();
  if (!clean) return false;
  const u = new SpeechSynthesisUtterance(clean);
  const v = pickVoice(opts.voiceURI);
  if (v) u.voice = v;
  u.lang = v?.lang ?? 'en-US';
  u.rate = Math.min(1.3, Math.max(0.5, opts.rate ?? 0.9));
  u.onend = () => opts.onEnd?.();
  u.onerror = () => opts.onEnd?.();
  synth.speak(u);
  return true;
}

export function stopSpeaking() {
  if (ttsSupported()) window.speechSynthesis.cancel();
}

// ───────── التعرف على الكلام ─────────

type RecognitionCtor = new () => {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string; confidence: number }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
};

function recognitionCtor(): RecognitionCtor | undefined {
  if (typeof window === 'undefined') return undefined;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export function recognitionSupported(): boolean {
  return !!recognitionCtor();
}

export interface RecognitionResult {
  transcripts: string[];
}

export type RecognitionError = 'not-supported' | 'not-allowed' | 'no-speech' | 'network' | 'aborted' | 'other';

export interface RecognitionHandle {
  promise: Promise<RecognitionResult>;
  stop: () => void;
}

export function listenOnce(lang = 'en-US', timeoutMs = 8000): RecognitionHandle {
  const Ctor = recognitionCtor();
  if (!Ctor) return { promise: Promise.reject<RecognitionResult>('not-supported' as RecognitionError), stop: () => {} };
  const rec = new Ctor();
  rec.lang = lang;
  rec.interimResults = false;
  rec.maxAlternatives = 3;
  rec.continuous = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const promise = new Promise<RecognitionResult>((resolve, reject) => {
    let done = false;
    rec.onresult = (e) => {
      done = true;
      const first = e.results[0];
      const transcripts: string[] = [];
      for (let i = 0; i < first.length; i++) transcripts.push(first[i].transcript);
      resolve({ transcripts });
    };
    rec.onerror = (e) => {
      done = true;
      const map: Record<string, RecognitionError> = {
        'not-allowed': 'not-allowed',
        'service-not-allowed': 'not-allowed',
        'no-speech': 'no-speech',
        network: 'network',
        aborted: 'aborted',
      };
      reject(map[e.error] ?? 'other');
    };
    rec.onend = () => {
      if (timer) clearTimeout(timer);
      if (!done) reject('no-speech' as RecognitionError);
    };
    try {
      rec.start();
      timer = setTimeout(() => rec.stop(), timeoutMs);
    } catch {
      reject('other' as RecognitionError);
    }
  });
  return { promise, stop: () => rec.stop() };
}

/** يقارن الكلمات المستهدفة بما تعرّف عليه المتصفح. هذا ليس تقييمًا للنطق. */
export function compareWords(target: string, transcripts: string[]): { word: string; heard: boolean }[] {
  const clean = (s: string) =>
    s
      .toLowerCase()
      .replace(/[’']/g, "'")
      .replace(/[^a-z0-9' ]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
  const heard = new Set(transcripts.flatMap(clean));
  // نقبل أيضًا الصيغة الموسعة للاختصارات
  const expand: Record<string, string[]> = { "i'm": ['im', 'i', 'am'], "it's": ['its', 'it', 'is'], "you're": ['youre', 'you', 'are'], "isn't": ['isnt'], "didn't": ['didnt'], "i'll": ['ill', 'i', 'will'], "don't": ['dont'] };
  return target
    .replace(/\(.*?\)/g, '')
    .split(/\s+/)
    .filter((w) => /[A-Za-z0-9]/.test(w))
    .map((w) => {
      const k = clean(w)[0] ?? '';
      const ok = heard.has(k) || (expand[k] ?? []).some((x) => heard.has(x));
      return { word: w, heard: ok };
    });
}
