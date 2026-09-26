import { disabledInputStyles } from "../../styles/formStyles";

interface TextInputProps {
  inputId: string;
  label: string;
  required?: boolean;
  size?: number;
  value?: string;
  errorMessage?: string;
  onChangeHandler?: (value: string) => void;
  disabled?: boolean;
  numericOnly?: boolean;
}

const sanitizeNumericInput = (value: string): string => {
  // Keep only digits and periods
  let cleaned = value.replace(/[^\d.]/g, "");

  // Keep only the first decimal point
  const firstDot = cleaned.indexOf(".");
  if (firstDot !== -1) {
    cleaned =
      cleaned.slice(0, firstDot + 1) +
      cleaned.slice(firstDot + 1).replace(/\./g, "");
  }

  // Enforce XXX.XX pattern
  const [whole = "", decimal = ""] = cleaned.split(".");

  const limitedWhole = whole.slice(0, 3);
  const limitedDecimal = decimal.slice(0, 2);

  return cleaned.includes(".")
    ? `${limitedWhole}.${limitedDecimal}`
    : limitedWhole;
};

export default function TextInput(props: TextInputProps) {
  const {
    inputId,
    label,
    required = undefined,
    value = "",
    errorMessage = null,
    onChangeHandler = () => {},
    disabled = false,
    numericOnly = false,
  } = props;

  const styles = `
    w-full
    rounded-lg
    border
    ${errorMessage ? 'border-red-700' : 'border-zinc-700'}
    bg-zinc-900
    px-3
    py-2
    text-zinc-100
    placeholder-zinc-500
    transition-colors
    focus:border-zinc-500
    focus:outline-none`;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!numericOnly) {
      onChangeHandler(event.target.value);
      return;
    }
    onChangeHandler(sanitizeNumericInput(event.target.value));
    return;
   
  };

  return (
    <div>
      <label htmlFor={inputId} className="uppercase text-sm text-gray-400">
        {label}:
      </label>
      <input
        type="text"
        id={inputId}
        name={inputId}
        required={required}
        value={value}
        onChange={handleChange}
        className={`${styles} ${disabled ? disabledInputStyles : ""}`}
        disabled={disabled}
      />
      {errorMessage && (
        <span className="text-red-400 text-sm pl-1">{errorMessage}</span>
      )}
    </div>
  );
}
