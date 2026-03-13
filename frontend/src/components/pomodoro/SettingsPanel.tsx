import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { TimerSettings } from "../../types";

interface SettingsPanelProps {
  settings: TimerSettings;
  onSave: (settings: TimerSettings) => void;
  onClose: () => void;
}

const SettingsPanel = ({ settings, onSave, onClose }: SettingsPanelProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TimerSettings>({ defaultValues: settings });

  useEffect(() => {
    reset(settings);
  }, [settings, reset]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-content">Timer Settings</h2>
          <button
            onClick={onClose}
            className="text-content/60 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-surface hover:text-content"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="space-y-5">
          {/* Durations */}
          <div>
            <p className="text-content/50 mb-3 text-xs font-semibold uppercase tracking-wider">Durations (minutes)</p>
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  { name: "focusDuration", label: "Focus" },
                  { name: "shortBreakDuration", label: "Short Break" },
                  { name: "longBreakDuration", label: "Long Break" },
                ] as const
              ).map(({ name, label }) => (
                <div key={name} className="flex flex-col gap-1">
                  <label className="text-content/60 text-xs">{label}</label>
                  <input
                    type="number"
                    {...register(name, {
                      valueAsNumber: true,
                      required: "Required",
                      min: { value: 1, message: "Min 1" },
                      max: { value: 60, message: "Max 60" },
                    })}
                    className={`w-full rounded-lg border bg-surface px-3 py-2 text-center text-sm font-medium text-content focus:outline-none ${errors[name] ? "border-danger focus:border-danger" : "border-gray-200 focus:border-accent dark:border-gray-700"}`}
                  />
                  {errors[name] && (
                    <p className="text-center text-xs text-danger">{errors[name]?.message}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Long break interval */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-content">Long break interval</p>
              <p className="text-content/50 text-xs">Sessions before a long break</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <input
                type="number"
                {...register("longBreakInterval", {
                  valueAsNumber: true,
                  required: "Required",
                  min: { value: 1, message: "Min 1" },
                  max: { value: 10, message: "Max 10" },
                })}
                className={`w-16 rounded-lg border bg-surface px-3 py-2 text-center text-sm font-medium text-content focus:outline-none ${errors.longBreakInterval ? "border-danger focus:border-danger" : "border-gray-200 focus:border-accent dark:border-gray-700"}`}
              />
              {errors.longBreakInterval && (
                <p className="text-xs text-danger">{errors.longBreakInterval.message}</p>
              )}
            </div>
          </div>

          {/* Auto-start toggles */}
          <div>
            <p className="text-content/50 mb-3 text-xs font-semibold uppercase tracking-wider">Auto-start</p>
            <div className="space-y-3">
              {(
                [
                  { name: "autoStartBreaks", label: "Auto-start breaks" },
                  { name: "autoStartPomodoros", label: "Auto-start pomodoros" },
                ] as const
              ).map(({ name, label }) => (
                <label key={name} className="flex cursor-pointer items-center justify-between">
                  <span className="text-sm text-content">{label}</span>
                  <input type="checkbox" {...register(name)} className="peer hidden" />
                  <div className="relative h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-accent dark:bg-gray-700">
                    <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer rounded-xl bg-accent py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPanel;
