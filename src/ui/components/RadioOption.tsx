type RadioOptionProps = {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: string;
};

export function RadioOption({
  name,
  value,
  checked,
  onChange,
  label
}: RadioOptionProps) {
  return (
    <label className="radio-card">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <span>{label}</span>
    </label>
  );
}
