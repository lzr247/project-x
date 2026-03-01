import { faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useEffect, useRef, useState } from "react";

interface DropdownOption {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  icon?: IconDefinition;
  placeholder?: string;
  width?: string;
}

const CustomDropdown = ({ options, value, onChange, icon, placeholder, width = "w-52" }: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? placeholder ?? options[0]?.label;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border-strong bg-surface-card px-3 py-2.5 text-sm text-content transition-all hover:border-accent/50 hover:bg-surface-hover"
      >
        {icon && <FontAwesomeIcon icon={icon} className="text-content-muted" />}
        <span>{selectedLabel}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-xs text-content-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className={`absolute right-0 z-50 mt-2 ${width} overflow-hidden rounded-xl border border-border-strong bg-surface-card shadow-lg`}>
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface-hover ${
                option.value === value ? "text-accent" : "text-content"
              }`}
            >
              {option.label}
              {option.value === value && <FontAwesomeIcon icon={faCheck} className="text-xs text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
