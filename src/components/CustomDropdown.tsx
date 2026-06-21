"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownOption {
  value: string;
  label: string;
  icon?: string | React.ReactNode;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  dropdownClassName?: string;
  disabled?: boolean;
}

export function CustomDropdown({
  options,
  selectedValue,
  onChange,
  placeholder = "Select an option",
  className,
  dropdownClassName,
  disabled = false,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block w-full text-left font-sans select-none", className)}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs font-semibold text-foreground transition outline-none focus:ring-2 ring-brand cursor-pointer select-none",
          disabled && "opacity-40 cursor-not-allowed",
          isOpen && "ring-2 ring-brand"
        )}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.icon && (
            <span className="shrink-0">{selectedOption.icon}</span>
          )}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown
          size={14}
          className={cn(
            "text-muted-foreground transition-transform duration-200 shrink-0 ml-2",
            isOpen && "rotate-180 text-brand"
          )}
        />
      </button>

      {/* Dropdown Options List */}
      {isOpen && (
        <div
          className={cn(
            "absolute left-0 mt-1.5 w-full rounded-xl border border-border bg-card p-1 shadow-lg z-50 animate-in fade-in slide-in-from-top-1 duration-150 max-h-60 overflow-y-auto scrollbar-hide text-left",
            dropdownClassName
          )}
        >
          {options.length === 0 ? (
            <div className="px-3.5 py-2 text-xs text-muted-foreground italic">No options available</div>
          ) : (
            options.map((opt) => {
              const isSelected = opt.value === selectedValue;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={cn(
                    "flex items-center justify-between w-full px-3.5 py-2.5 text-xs font-semibold rounded-lg transition text-left cursor-pointer",
                    isSelected
                      ? "bg-brand/10 text-brand font-bold"
                      : "text-foreground hover:bg-muted/80 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                    <span className="truncate">{opt.label}</span>
                  </div>
                  {isSelected && (
                    <Check size={12} className="text-brand shrink-0 ml-2" />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
