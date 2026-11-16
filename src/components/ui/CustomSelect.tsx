import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  icon?: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  icon,
  className = '',
  fullWidth = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative ${fullWidth ? 'w-full' : 'w-auto'} ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2.5 bg-white border rounded-xl px-3.5 py-2 text-xs font-semibold text-[#041B38] transition-all cursor-pointer ${
          isOpen
            ? 'border-[#1863DC] ring-3 ring-[#1863DC]/10 shadow-xs'
            : 'border-[#E2E8F0] hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="text-[#1863DC] shrink-0">{icon}</span>}
          <span className="truncate">{selectedOption?.label}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#1863DC]' : 'text-slate-400'
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 left-0 sm:left-auto z-40 mt-1.5 min-w-full sm:min-w-[220px] bg-white border border-[#E2E8F0] rounded-xl shadow-xl p-1.5 space-y-0.5">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 text-[#1863DC] font-bold'
                    : 'text-slate-600 font-medium hover:bg-slate-50 hover:text-[#041B38]'
                }`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#1863DC] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
