export type DropdownSelectProps<T extends object> = {
  data: readonly T[];
  dataId: Extract<keyof T, string>;
  selectedId?: string;
  onSelect: (selectedId: string) => void;
  getOptionLabel?: (item: T) => string;
  inputId?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  errorMessage?: string;
};

const isSelectableId = (value: unknown): value is string | number =>
  typeof value === "string" || typeof value === "number";

export default function DropdownSelect<T extends object>({
  data,
  dataId,
  selectedId = "",
  onSelect,
  getOptionLabel = (item) => String(item[dataId]),
  inputId,
  label,
  placeholder = "Select an option",
  disabled = false,
  required = false,
  errorMessage,
}: DropdownSelectProps<T>) {
  const options = data.flatMap((item) => {
    const id = item[dataId];

    return isSelectableId(id)
      ? [{ id: String(id), label: getOptionLabel(item) }]
      : [];
  });

  const select = (
    <select
      id={inputId}
      name={inputId}
      value={selectedId}
      onChange={(event) => onSelect(event.target.value)}
      className={`w-full rounded-lg border bg-zinc-900 px-3 py-2 text-zinc-100 focus:border-zinc-500 focus:outline-none ${errorMessage ? "border-red-700" : "border-zinc-700"}`}
      disabled={disabled}
      required={required}
    >
      <option value="">{placeholder}</option>
      {options.map(({ id, label }) => (
        <option key={id} value={id}>
          {label}
        </option>
      ))}
    </select>
  );

  if (!label) {
    return (
      <>
        {select}
        {errorMessage && (
          <span className="text-red-400 text-sm pl-1">{errorMessage}</span>
        )}
      </>
    );
  }

  return (
    <label htmlFor={inputId} className="uppercase text-sm text-gray-400">
      {label}:
      {select}
      {errorMessage && (
        <span className="text-red-400 text-sm pl-1">{errorMessage}</span>
      )}
    </label>
  );
}
