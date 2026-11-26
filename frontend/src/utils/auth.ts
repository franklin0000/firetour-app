export interface AuthUser {
  id: number | string;
  name: string;
  email: string;
  picture?: string;
  authProvider?: 'google' | 'email';
}

export const AUTH_CHANGE_EVENT = 'ftdr-auth-change';

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('user') || localStorage.getItem('firetour_user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.email) return parsed;
  } catch {
    return null;
  }
  return null;
}

export function setStoredUser(user: AuthUser): void {
  if (typeof window === 'undefined') return;
  const payload = JSON.stringify(user);
  localStorage.setItem('user', payload);
  localStorage.setItem('firetour_user', payload);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function clearStoredUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
  localStorage.removeItem('firetour_user');
  try {
    (window as any).google?.accounts?.id?.disableAutoSelect?.();
  } catch {}
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

let cachedClientIdPromise: Promise<string | null> | null = null;

export function fetchGoogleClientId(): Promise<string | null> {
  if (cachedClientIdPromise) return cachedClientIdPromise;
  cachedClientIdPromise = fetch('/api/auth/google/config')
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => (data && typeof data.clientId === 'string' && data.clientId.trim() ? data.clientId.trim() : null))
    .catch(() => null);
  return cachedClientIdPromise;
}

let gsiScriptPromise: Promise<boolean> | null = null;

export function loadGoogleIdentityScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if ((window as any).google?.accounts?.id) return Promise.resolve(true);
  if (gsiScriptPromise) return gsiScriptPromise;

  gsiScriptPromise = new Promise((resolve) => {
    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true), { once: true });
      existing.addEventListener('error', () => resolve(false), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
  return gsiScriptPromise;
}
