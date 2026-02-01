import { PRESET_COLORS } from "../consts";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {PRESET_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={`w-8 h-8 rounded-full transition-all duration-200 ${
            value === color
              ? "ring-2 ring-offset-2 ring-content scale-110"
              : "hover:scale-110"
          }`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};
