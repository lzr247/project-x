import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { faDesktop, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useThemeStore } from "../store/theme.store";

type ThemeOption = "light" | "system" | "dark";

const options: { value: ThemeOption; icon: IconDefinition; label: string }[] = [
  { value: "light", icon: faSun, label: "Light" },
  { value: "system", icon: faDesktop, label: "System" },
  { value: "dark", icon: faMoon, label: "Dark" },
];

interface ThemeToggleProps {
  collapsed?: boolean;
}

export const ThemeToggle = ({ collapsed = false }: ThemeToggleProps) => {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  if (collapsed) {
    const handleCycle = () => {
      const order: ThemeOption[] = ["light", "system", "dark"];
      const next = order[(order.indexOf(theme) + 1) % 3];
      setTheme(next);
    };
    const currentOption = options.find((o) => o.value === theme)!;

    return (
      <button
        onClick={handleCycle}
        className="flex w-full items-center justify-center rounded-xl px-3 py-3 text-sidebar-text transition-all duration-200 hover:bg-sidebar-hover hover:text-white"
        title={`Theme: ${currentOption.label}`}
      >
        <FontAwesomeIcon icon={currentOption.icon} />
      </button>
    );
  }

  return (
    <div className="flex rounded-lg bg-sidebar-hover p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition-all ${
            theme === option.value ? "bg-accent text-white shadow-sm" : "text-sidebar-text hover:text-white"
          }`}
          title={option.label}
        >
          <FontAwesomeIcon icon={option.icon} className="text-[10px]" />
          <span className="font-medium">{option.label}</span>
        </button>
      ))}
    </div>
  );
};
