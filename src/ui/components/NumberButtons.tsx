type NumberButtonsProps = {
  max: number;
  onSelect: (value: number) => void;
};

export function NumberButtons({ max, onSelect }: NumberButtonsProps) {
  return (
    <div className="number-grid" aria-label="すうじボタン">
      {Array.from({ length: max + 1 }, (_, value) => (
        <button
          className="number-button"
          type="button"
          key={value}
          onClick={() => onSelect(value)}
        >
          {value}
        </button>
      ))}
    </div>
  );
}
