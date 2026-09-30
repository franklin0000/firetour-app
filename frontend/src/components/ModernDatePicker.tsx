import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface ModernDatePickerProps {
  label: string;
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  minDate?: string; // YYYY-MM-DD
  disabled?: boolean;
  colorTheme?: 'secondary' | 'cyan';
  required?: boolean;
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAY_LABELS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

export default function ModernDatePicker({
  label,
  value,
  onChange,
  minDate,
  disabled = false,
  colorTheme = 'secondary',
  required = false
}: ModernDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial selected date or default to today
  const selectedDateObj = value ? new Date(value + 'T00:00:00') : new Date();
  const [viewYear, setViewYear] = useState(selectedDateObj.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDateObj.getMonth());

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // When value changes externally, update view
  useEffect(() => {
    if (value) {
      const d = new Date(value + 'T00:00:00');
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [value]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  // Helper to format date string to YYYY-MM-DD
  const formatYMD = (year: number, month: number, day: number) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  // Human friendly label for trigger button
  const formatDisplay = (val: string) => {
    if (!val) return 'Seleccionar fecha';
    const d = new Date(val + 'T00:00:00');
    if (isNaN(d.getTime())) return val;
    const day = d.getDate();
    const month = MONTH_NAMES[d.getMonth()].substring(0, 3);
    const year = d.getFullYear();
    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return `${weekDays[d.getDay()]}, ${day} ${month} ${year}`;
  };

  // Quick preset helper
  const applyPreset = (daysFromToday: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromToday);
    const ymd = formatYMD(d.getFullYear(), d.getMonth(), d.getDate());
    onChange(ymd);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
    setIsOpen(false);
  };

  // Generate calendar days
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  // Adjust so Monday is 0 and Sunday is 6
  const startOffset = (firstDayOfMonth + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const minDateObj = minDate ? new Date(minDate + 'T00:00:00') : new Date();
  minDateObj.setHours(0, 0, 0, 0);

  const themeColors = {
    secondary: {
      text: 'text-secondary',
      border: 'focus:border-secondary hover:border-secondary/50',
      activeBg: 'bg-secondary text-black font-black shadow-lg shadow-secondary/20',
      hoverBg: 'hover:bg-secondary/20 hover:text-white',
      badge: 'bg-secondary/15 text-secondary border-secondary/30'
    },
    cyan: {
      text: 'text-cyan',
      border: 'focus:border-cyan hover:border-cyan/50',
      activeBg: 'bg-cyan text-black font-black shadow-lg shadow-cyan/20',
      hoverBg: 'hover:bg-cyan/20 hover:text-white',
      badge: 'bg-cyan/15 text-cyan border-cyan/30'
    }
  }[colorTheme];

  return (
    <div className="flex flex-col gap-2 relative" ref={containerRef}>
      <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest flex items-center gap-1.5">
        <CalendarIcon className={`w-3.5 h-3.5 ${themeColors.text}`} /> {label}
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full bg-bgDark border border-outline rounded-xl py-3 px-4 text-left flex items-center justify-between text-sm font-bold text-white transition ${
          themeColors.border
        } ${disabled ? 'opacity-40 cursor-not-allowed bg-surface/10' : 'cursor-pointer hover:bg-surface/30'}`}
      >
        <span className={value ? 'text-white' : 'text-gray-500'}>
          {formatDisplay(value)}
        </span>
        <CalendarIcon className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
      </button>

      {/* Hidden native input for form validation */}
      <input
        type="hidden"
        value={value}
        required={required}
      />

      {/* Dropdown Popover Calendar */}
      {isOpen && (
        <div className="absolute top-[72px] left-0 sm:left-auto sm:right-0 bg-[#0d131f]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-2xl z-[100] w-[310px] sm:w-[330px] animate-fadeIn">
          
          {/* Header: Month and Navigation */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition"
              aria-label="Mes anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-black font-display uppercase tracking-wider text-white">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition"
              aria-label="Mes siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 no-scrollbar text-[10px]">
            <button
              type="button"
              onClick={() => applyPreset(0)}
              className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/15 text-gray-300 transition whitespace-nowrap"
            >
              Hoy
            </button>
            <button
              type="button"
              onClick={() => applyPreset(1)}
              className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/15 text-gray-300 transition whitespace-nowrap"
            >
              Mañana
            </button>
            <button
              type="button"
              onClick={() => applyPreset(7)}
              className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/15 text-gray-300 transition whitespace-nowrap"
            >
              +7 días
            </button>
            <button
              type="button"
              onClick={() => applyPreset(14)}
              className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/15 text-gray-300 transition whitespace-nowrap"
            >
              +14 días
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
            {DAY_LABELS.map(d => (
              <span key={d} className="text-[10px] font-bold text-gray-400 py-0.5">
                {d}
              </span>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty slots before first day */}
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = formatYMD(viewYear, viewMonth, day);
              const isSelected = value === dateStr;
              
              const dayDate = new Date(viewYear, viewMonth, day);
              dayDate.setHours(0, 0, 0, 0);
              const isPast = dayDate < minDateObj;

              return (
                <button
                  key={day}
                  type="button"
                  disabled={isPast}
                  onClick={() => {
                    onChange(dateStr);
                    setIsOpen(false);
                  }}
                  className={`h-8 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                    isSelected
                      ? themeColors.activeBg
                      : isPast
                      ? 'text-gray-600 cursor-not-allowed opacity-35'
                      : `text-gray-200 ${themeColors.hoverBg}`
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400">
            <span>Zona horaria: Local</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-white hover:text-secondary transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
