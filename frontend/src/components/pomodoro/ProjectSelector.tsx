import { faChevronDown, faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import type { Project } from "../../types";

interface Props {
  projects: Project[];
  value: string;
  onChange: (id: string) => void;
}

export const ProjectSelector = ({ projects, value, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = projects.find((p) => p.id === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full max-w-xs">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-gray-200 bg-surface px-4 py-2.5 text-sm text-content transition-colors hover:border-accent dark:border-gray-700"
      >
        <span className="flex items-center gap-2">
          {selected ? (
            <>
              <span
                className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                style={{ backgroundColor: selected.color }}
              />
              <span className="font-medium">{selected.title}</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faFolder} className="text-content/40" />
              <span className="text-content/50">No project</span>
            </>
          )}
        </span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-xs text-content/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <button
            type="button"
            onClick={() => handleSelect("")}
            className={`flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-surface ${
              !value ? "font-medium text-accent" : "text-content"
            }`}
          >
            <FontAwesomeIcon icon={faFolder} className="text-content/40" />
            No project
          </button>

          {projects.length > 0 && (
            <div className="mx-3 border-t border-gray-100 dark:border-gray-800" />
          )}

          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelect(p.id)}
              className={`flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-surface ${
                value === p.id ? "font-medium text-accent" : "text-content"
              }`}
            >
              <span
                className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              {p.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
