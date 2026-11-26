declare global {
  interface Window {
    __FIRETOUR_APP_MODE__?: boolean;
  }
}

const APP_MODE_STORAGE_KEY = 'firetour_app_mode';

/**
 * Returns true when running inside the installed PWA (standalone/fullscreen/minimal-ui)
 * or the Android TWA / WebView app (com.firetourdr.app), and false in a regular web browser.
 */
export function isAppMode(): boolean {
  if (typeof window === 'undefined') return false;

  if (window.__FIRETOUR_APP_MODE__ === true) return true;

  try {
    const isStandaloneDisplay =
      (typeof window.matchMedia === 'function' &&
        (window.matchMedia('(display-mode: standalone)').matches ||
          window.matchMedia('(display-mode: fullscreen)').matches ||
          window.matchMedia('(display-mode: minimal-ui)').matches)) ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    const referrer = typeof document !== 'undefined' ? document.referrer || '' : '';
    const isTwaReferrer = referrer.startsWith('android-app://com.firetourdr.app');

    const params = new URLSearchParams(window.location.search || '');
    const isTwaQuery = params.get('source') === 'twa';

    const ua = window.navigator?.userAgent || '';
    const isAndroidWebViewOrTwaUa = /(;\s*wv\)|com\.firetourdr\.app|FireTourDRApp)/i.test(ua);

    let isPersistedAppSession = false;
    try {
      isPersistedAppSession = window.sessionStorage.getItem(APP_MODE_STORAGE_KEY) === '1';
    } catch {
      // sessionStorage unavailable
    }

    const detected =
      isStandaloneDisplay ||
      isTwaReferrer ||
      isTwaQuery ||
      isAndroidWebViewOrTwaUa ||
      isPersistedAppSession;

    if (detected) {
      window.__FIRETOUR_APP_MODE__ = true;
      try {
        window.sessionStorage.setItem(APP_MODE_STORAGE_KEY, '1');
      } catch {
        // ignore storage restrictions
      }
      return true;
    }
  } catch {
    return false;
  }

  return false;
}
