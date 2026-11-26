import React, { useEffect, useRef, useState } from 'react';
import { Loader } from 'lucide-react';
import {
  type AuthUser,
  fetchGoogleClientId,
  loadGoogleIdentityScript,
  setStoredUser,
} from '../utils/auth';

interface GoogleSignInButtonProps {
  onSuccess?: (user: AuthUser) => void;
  onError?: (message: string) => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  width?: number;
  className?: string;
}

export default function GoogleSignInButton({
  onSuccess,
  onError,
  text = 'continue_with',
  theme = 'filled_black',
  size = 'large',
  width = 300,
  className = '',
}: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [unavailable, setUnavailable] = useState(false);

  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  useEffect(() => {
    let cancelled = false;

    async function initGoogle() {
      const clientId = await fetchGoogleClientId();
      if (cancelled) return;
      if (!clientId) {
        setUnavailable(true);
        setLoading(false);
        return;
      }

      const loaded = await loadGoogleIdentityScript();
      if (cancelled) return;
      const gsi = (window as any).google?.accounts?.id;
      if (!loaded || !gsi || !containerRef.current) {
        setErrorMsg('No se pudo cargar el inicio de sesión de Google.');
        setLoading(false);
        return;
      }

      try {
        gsi.initialize({
          client_id: clientId,
          callback: async (response: { credential?: string }) => {
            if (!response?.credential) {
              const msg = 'No se recibió credencial de Google.';
              setErrorMsg(msg);
              onErrorRef.current?.(msg);
              return;
            }
            setSubmitting(true);
            setErrorMsg('');
            try {
              const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: response.credential }),
              });
              const data = await res.json();
              if (!res.ok || !data.user) {
                throw new Error(data.error || 'Error al verificar tu cuenta de Google.');
              }
              setStoredUser(data.user);
              onSuccessRef.current?.(data.user);
            } catch (err: any) {
              const msg = err.message || 'Error de conexión al iniciar sesión con Google.';
              setErrorMsg(msg);
              onErrorRef.current?.(msg);
            } finally {
              setSubmitting(false);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        containerRef.current.innerHTML = '';
        gsi.renderButton(containerRef.current, {
          type: 'standard',
          theme,
          size,
          text,
          shape: 'pill',
          locale: 'es',
          width: Math.min(width, containerRef.current.parentElement?.clientWidth || width),
        });
      } catch (err) {
        console.error('[Google Sign-In Init Error]', err);
        setErrorMsg('No se pudo inicializar el botón de Google.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    initGoogle();
    return () => {
      cancelled = true;
    };
  }, [text, theme, size, width]);

  if (unavailable) return null;

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      {loading && (
        <div className="h-[44px] w-full max-w-[300px] rounded-full bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-xs text-gray-400">
          <Loader className="w-3.5 h-3.5 animate-spin text-cyan" />
          <span>Cargando Google...</span>
        </div>
      )}

      {submitting && (
        <div className="h-[44px] w-full max-w-[300px] rounded-full bg-cyan/15 border border-cyan/30 flex items-center justify-center gap-2 text-xs font-bold text-cyan">
          <Loader className="w-3.5 h-3.5 animate-spin" />
          <span>Verificando cuenta de Google...</span>
        </div>
      )}

      <div
        ref={containerRef}
        className={`flex justify-center ${loading || submitting ? 'hidden' : ''}`}
      />

      {errorMsg && (
        <p className="text-[11px] text-red-400 font-semibold text-center">{errorMsg}</p>
      )}
    </div>
  );
}
