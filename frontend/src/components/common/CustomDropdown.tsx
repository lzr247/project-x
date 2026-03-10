import { faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useEffect, useRef, useState } from "react";

export interface DropdownOption {
  label: string;
  value: string;
  color?: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  icon?: IconDefinition;
  placeholder?: string;
  width?: string;
  fullWidth?: boolean;
}

const CustomDropdown = ({
  options,
  value,
  onChange,
  icon,
  placeholder,
  width = "w-52",
  fullWidth = false,
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);
  const selectedLabel = selectedOption?.label ?? placeholder ?? options[0]?.label;

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

  const triggerClass = `${fullWidth ? "flex w-full" : "inline-flex"} cursor-pointer items-center gap-2 rounded-xl border border-border-strong bg-surface-card px-3 py-2.5 text-sm text-content transition-all hover:border-accent/50 hover:bg-surface-hover`;

  return (
    <div ref={containerRef} className="relative">
      <button onClick={() => setIsOpen((prev) => !prev)} className={triggerClass}>
        {icon && <FontAwesomeIcon icon={icon} className="text-content-muted" />}
        {selectedOption?.color && (
          <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: selectedOption.color }} />
        )}
        <span className={`flex-1 text-left ${!selectedOption && placeholder ? "text-content-muted" : ""}`}>
          {selectedLabel}
        </span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-xs text-content-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 mt-2 ${fullWidth ? "w-full" : width} right-0 max-h-60 overflow-y-auto rounded-xl border border-border-strong bg-surface-card shadow-lg`}
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface-hover ${
                option.value === value ? "text-accent" : "text-content"
              }`}
            >
              {option.color && (
                <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: option.color }} />
              )}
              <span className="flex-1 truncate">{option.label}</span>
              {option.value === value && <FontAwesomeIcon icon={faCheck} className="text-xs text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
