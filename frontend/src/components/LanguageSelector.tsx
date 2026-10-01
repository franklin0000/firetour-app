import React, { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'es', name: 'Español', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'Inglés', nativeName: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Francés', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Alemán', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru', name: 'Ruso', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'it', name: 'Italiano', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portugués', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'zh-CN', name: 'Chino', nativeName: '中文', flag: '🇨🇳' },
  { code: 'pl', name: 'Polaco', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'nl', name: 'Holandés', nativeName: 'Nederlands', flag: '🇳🇱' },
];

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string>('es');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize selected language from cookie or localStorage
  useEffect(() => {
    try {
      const match = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/);
      if (match && match[1]) {
        setSelectedLang(match[1]);
      } else {
        const saved = localStorage.getItem('firetour_lang');
        if (saved) setSelectedLang(saved);
      }
    } catch (e) {}

    // Close on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ensure Google Translate script is loaded
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).googleTranslateElementInit) {
      (window as any).googleTranslateElementInit = () => {
        if ((window as any).google && (window as any).google.translate) {
          new (window as any).google.translate.TranslateElement({
            pageLanguage: 'es',
            includedLanguages: 'en,fr,de,ru,it,pt,zh-CN,pl,nl,es,ja,ar,sv',
            autoDisplay: false,
          }, 'google_translate_element');
        }
      };

      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.type = 'text/javascript';
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, []);

  const handleSelectLanguage = (langCode: string) => {
    setSelectedLang(langCode);
    setIsOpen(false);
    try {
      localStorage.setItem('firetour_lang', langCode);

      const domain = window.location.hostname === 'localhost' ? '' : `;domain=${window.location.hostname}`;
      
      if (langCode === 'es') {
        // Reset to original language
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;${domain}`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      } else {
        document.cookie = `googtrans=/es/${langCode}; path=/;${domain}`;
        document.cookie = `googtrans=/es/${langCode}; path=/;`;
      }

      // Try triggering Google's select element directly
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
      } else {
        // Reload to apply Google Translate cookie
        window.location.reload();
      }
    } catch (err) {
      console.error('[Language Switch Error]', err);
    }
  };

  const currentOption = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Hidden container for Google Translate element */}
      <div id="google_translate_element" style={{ display: 'none' }} />

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-cyan/40 text-gray-200 hover:text-white px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm group"
        aria-label="Seleccionar idioma"
        title="Cambiar idioma / Change language"
      >
        <span className="text-sm">{currentOption.flag}</span>
        <span className="font-display uppercase tracking-wider text-[11px] font-black text-gray-300 group-hover:text-cyan transition-colors hidden xs:inline">
          {currentOption.code.toUpperCase()}
        </span>
        <ChevronDown className={`w-3 h-3 text-gray-400 group-hover:text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-surface/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn overflow-hidden">
          <div className="px-3.5 py-2 border-b border-white/10 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan font-display flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan" /> Idioma / Language
            </span>
          </div>

          <div className="max-h-64 overflow-y-auto py-1 space-y-0.5 custom-scrollbar">
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected 
                      ? 'bg-cyan/15 text-cyan font-bold' 
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{lang.flag}</span>
                    <span className="font-medium">{lang.nativeName}</span>
                    <span className="text-[10px] text-gray-500 uppercase">({lang.code})</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-cyan" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
