import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Icon } from './components/ui';
import { dueItems } from './lib/srs';
import { dayKey, dayTotals } from './lib/progress';
import { notificationsSupported, scheduleInAppReminder } from './lib/reminders';
import { AccountPage } from './pages/AccountPage';
import { HomePage } from './pages/HomePage';
import { LessonPage } from './pages/LessonPage';
import { OnboardingPage, PlacementFlow } from './pages/OnboardingPage';
import { PathPage } from './pages/PathPage';
import { ReviewPage } from './pages/ReviewPage';
import { SettingsPage } from './pages/SettingsPage';
import { StatsPage } from './pages/StatsPage';
import { UnitTestPage } from './pages/UnitTestPage';
import { WordsPage } from './pages/WordsPage';
import { useProgress } from './state/ProgressContext';

function Tabbar() {
  const { progress } = useProgress();
  const due = dueItems(progress.items, Date.now(), 99).length;
  const tabs = [
    { to: '/', label: 'الرئيسية', icon: 'home', end: true },
    { to: '/path', label: 'المسار', icon: 'path' },
    { to: '/review', label: 'المراجعة', icon: 'review', badge: due },
    { to: '/stats', label: 'التقدم', icon: 'chart' },
    { to: '/settings', label: 'الإعدادات', icon: 'settings' },
  ];
  return (
    <nav className="tabbar" aria-label="التنقل الرئيسي">
      <div className="tabbar-inner">
        {tabs.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}>
            <Icon name={t.icon} />
            <span>{t.label}</span>
            {!!t.badge && (
              <span className="dot" aria-label={`${t.badge} مستحقة`}>
                {t.badge > 99 ? '99+' : t.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

function RequireSetup({ children }: { children: ReactNode }) {
  const { progress } = useProgress();
  if (!progress.profile.onboarded) return <Navigate to="/welcome" replace />;
  if (!progress.placement) return <Navigate to="/placement" replace />;
  return <>{children}</>;
}

function KeyedLesson() {
  const { lessonId } = useParams();
  return <LessonPage key={lessonId} />;
}

function PlacementRoute() {
  const navigate = useNavigate();
  return <PlacementFlow onDone={() => navigate('/')} />;
}

function useOnline() {
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
}

/** تذكير داخل الموقع: إشعار متصفح إن سُمح به، وإلا لافتة — فقط والموقع مفتوح */
function useInAppReminder(): boolean {
  const { progress } = useProgress();
  const [fired, setFired] = useState(false);
  const r = progress.settings.reminder;
  const today = dayTotals(progress, dayKey(Date.now()));
  const doneToday = today.lessons > 0 || today.reviews > 0;
  useEffect(() => {
    if (!r.enabled || doneToday) return;
    return scheduleInAppReminder(r.time, () => {
      setFired(true);
      if (notificationsSupported() && Notification.permission === 'granted') {
        try {
          new Notification('وقت درس الإنجليزي', { body: '10 دقائق فقط. درس اليوم بانتظارك.', tag: 'daily-lesson' });
        } catch {
          /* بعض المتصفحات تمنع الإنشاء المباشر */
        }
      }
    });
  }, [r.enabled, r.time, doneToday]);
  return fired && !doneToday;
}

export default function App() {
  const location = useLocation();
  const { passwordRecovery } = useProgress();
  const online = useOnline();
  const reminder = useInAppReminder();
  const focus = /^\/(lesson|test|welcome|placement)/.test(location.pathname);

  if (passwordRecovery && location.pathname !== '/account') return <Navigate to="/account" replace />;

  return (
    <>
      {!focus && <Tabbar />}
      <main className={`app${focus ? ' focus-mode' : ''}`} id="main">
        {!online && <div className="banner">أنت دون اتصال. الدروس والمراجعة تعمل، وسيُزامن تقدمك عند عودة الإنترنت.</div>}
        {reminder && !focus && <div className="banner info">⏰ هذا وقت درسك اليومي.</div>}
        <Routes>
          <Route path="/welcome" element={<OnboardingPage />} />
          <Route path="/placement" element={<PlacementRoute />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/" element={<RequireSetup><HomePage /></RequireSetup>} />
          <Route path="/path" element={<RequireSetup><PathPage /></RequireSetup>} />
          <Route path="/lesson/:lessonId" element={<RequireSetup><KeyedLesson /></RequireSetup>} />
          <Route path="/test/:unitId" element={<RequireSetup><UnitTestPage /></RequireSetup>} />
          <Route path="/review" element={<RequireSetup><ReviewPage /></RequireSetup>} />
          <Route path="/stats" element={<RequireSetup><StatsPage /></RequireSetup>} />
          <Route path="/words" element={<RequireSetup><WordsPage /></RequireSetup>} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
