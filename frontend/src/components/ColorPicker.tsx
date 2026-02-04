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
          className={`h-8 w-8 rounded-full transition-all duration-200 ${
            value === color ? "scale-110 ring-2 ring-content ring-offset-2" : "hover:scale-110"
          }`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};
