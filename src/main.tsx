import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { ProgressProvider } from './state/ProgressContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </HashRouter>
  </StrictMode>,
);

// العمل دون اتصال: Service Worker في النسخة المنشورة فقط
if (import.meta.env.PROD && import.meta.env.MODE !== 'preview' && 'serviceWorker' in navigator && window.isSecureContext) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      /* المتصفح رفض التسجيل — الموقع يعمل بدونه */
    });
  });
}
