import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Diagnostic overlay strictly scoped to Development mode (stripped out in production builds)
if (import.meta.env.DEV) {
  window.onunhandledrejection = function(event) {
    const div = document.createElement('div');
    div.id = 'promise-diagnostic-panel';
    div.style.position = 'fixed';
    div.style.top = '0';
    div.style.left = '0';
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.overflow = 'auto';
    div.style.backgroundColor = '#581c87';
    div.style.color = '#f3e8ff';
    div.style.padding = '30px';
    div.style.zIndex = '999999';
    div.style.fontSize = '14px';
    div.style.fontFamily = 'monospace';
    div.style.whiteSpace = 'pre-wrap';
    div.style.boxSizing = 'border-box';

    const apiUrl = import.meta.env.VITE_API_URL || '';
    const apiTarget = apiUrl || 'servidor local configurado';

    div.innerHTML = '<h1 style="font-size:24px;margin-bottom:15px;font-weight:bold;">🔮 PROMESA NO CAPTURADA (MODO DEV)</h1>' +
                    '<strong>Razón:</strong> ' + event.reason + '<br><br>' +
                    '<strong>Pila de Llamadas:</strong><br>' + (event.reason && (event.reason as any).stack ? (event.reason as any).stack : 'No disponible') + '<br><br>' +
                    '<div style="background:#4c1d95;padding:15px;border-radius:8px;margin-top:15px;">' +
                    '💡 <strong>Recomendación:</strong> Asegúrate de que el backend (' + apiTarget + ') esté activo y no existan bloqueos de red o CORS.' +
                    '</div>';

    if (document.body) {
      document.body.appendChild(div);
    } else {
      window.addEventListener('DOMContentLoaded', function() {
        document.body.appendChild(div);
      });
    }
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

