// التذكير اليومي.
// الطريقة الموثوقة بدون خادم: حدث متكرر في تقويم الهاتف (ملف .ics) مع تنبيه — يعمل حتى والموقع مغلق.
// إشعارات المتصفح: تعمل فقط والموقع مفتوح (أو تبويبه في الخلفية). الإشعارات مع إغلاق الموقع تحتاج
// خادم Push (Web Push + VAPID) وهي غير مفعلة في هذه النسخة.

export interface ReminderWindow {
  id: string;
  label: string;
  start: string; // HH:MM
  end: string;
}

export const WINDOWS: ReminderWindow[] = [
  { id: 'before-work', label: 'قبل الدوام', start: '07:00', end: '09:00' },
  { id: 'break', label: 'في الاستراحة', start: '13:00', end: '15:00' },
  { id: 'after-work', label: 'بعد الدوام', start: '19:00', end: '22:00' },
  { id: 'before-sleep', label: 'قبل النوم', start: '22:00', end: '23:59' },
];

function toMin(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function toHHMM(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** اقتراح وقت داخل النافذة: بعد بدايتها بـ 15 دقيقة (وقت كافٍ للاستقرار)، مقرّبًا لأقرب 5 دقائق */
export function suggestTime(windowId: string): string {
  const w = WINDOWS.find((x) => x.id === windowId) ?? WINDOWS[2];
  const s = toMin(w.start);
  const e = toMin(w.end);
  const t = Math.min(s + 15, Math.max(s, e - 10));
  return toHHMM(Math.round(t / 5) * 5);
}

export function isValidTime(hhmm: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(hhmm);
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

/** ملف تقويم بحدث يومي متكرر مدته 10 دقائق مع تنبيه عند الموعد */
export function buildIcs(time: string, appUrl: string, now = new Date()): string {
  if (!isValidTime(time)) throw new Error('invalid time');
  const [h, m] = time.split(':').map(Number);
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
  if (start.getTime() < now.getTime()) start.setDate(start.getDate() + 1);
  const end = new Date(start.getTime() + 10 * 60_000);
  const local = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const uid = `daily-english-${start.getTime()}@jarir-english.local`;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Work English//Daily Reminder//AR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${local(start)}`,
    `DTEND:${local(end)}`,
    'RRULE:FREQ=DAILY',
    'SUMMARY:درس الإنجليزي اليومي (10 دقائق)',
    `DESCRIPTION:افتح المنصة وابدأ درس اليوم: ${appUrl}`,
    `URL:${appUrl}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:وقت درس الإنجليزي',
    'TRIGGER:-PT0M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}

export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/** يجدول إشعارًا للوقت المحدد اليوم ما دام الموقع مفتوحًا. يعيد دالة للإلغاء. */
export function scheduleInAppReminder(time: string, onFire: () => void, now = new Date()): () => void {
  if (!isValidTime(time)) return () => {};
  const [h, m] = time.split(':').map(Number);
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
  const ms = target.getTime() - now.getTime();
  if (ms <= 0 || ms > 24 * 3600_000) return () => {};
  const id = setTimeout(onFire, ms);
  return () => clearTimeout(id);
}
