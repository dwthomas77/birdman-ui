import { disabledInputStyles } from "../../styles/formStyles";

interface TextInputProps {
  inputId: string;
  label: string;
  required?: boolean;
  size?: number;
  value?: string;
  errorMessage?: string;
  onChangeHandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export default function TextInput(props: TextInputProps) {
  const {
    inputId,
    label,
    required = undefined,
    value = "",
    errorMessage = null,
    onChangeHandler = () => {},
    disabled = false,
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

  return (
    <>
      <label htmlFor={inputId} className="uppercase text-sm text-gray-400">
        {label}:
      </label>
      <input
        type="text"
        id={inputId}
        name={inputId}
        required={required}
        value={value}
        onChange={onChangeHandler}
        className={`${styles} ${disabled ? disabledInputStyles : ""}`}
        disabled={disabled}
      />
      {errorMessage && (
        <span className="text-red-400 text-sm pl-1">{errorMessage}</span>
      )}
    </>
  );
}
