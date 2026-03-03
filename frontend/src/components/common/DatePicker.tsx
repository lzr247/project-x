import { faCalendarAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  value?: string;
  onChange: (date: string | null) => void;
  placeholder?: string;
  minDate?: Date;
}

const DatePicker = ({ value, onChange, placeholder = "Pick a date", minDate }: DatePickerProps) => {
  const selected = value ? new Date(value) : null;

  return (
    <div className="relative">
      <ReactDatePicker
        selected={selected}
        onChange={(date: Date | null) => onChange(date ? date.toISOString().split("T")[0] : null)}
        minDate={minDate}
        placeholderText={placeholder}
        dateFormat="MMM d, yyyy"
        wrapperClassName="w-full"
        className="focus:ring-accent/20 w-full cursor-pointer rounded-xl border border-border-strong bg-surface-card py-3 pl-10 pr-10 text-content outline-none transition-all focus:border-accent focus:ring-2"
        popperClassName="z-50"
      />
      <FontAwesomeIcon
        icon={faCalendarAlt}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-content-muted"
      />
      {selected && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-content-muted transition-colors hover:text-content"
        >
          <FontAwesomeIcon icon={faTimes} className="text-xs" />
        </button>
      )}
    </div>
  );
};

export default DatePicker;
