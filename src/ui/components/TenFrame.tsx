type TenFrameProps = {
  value: number;
  label: string;
  mutedFrom?: number;
};

export function TenFrame({ value, label, mutedFrom }: TenFrameProps) {
  return (
    <div className="ten-frame-block" aria-label={`${label}: ${value}`}>
      <div className="ten-frame-label">{label}</div>
      <div className="ten-frame">
        {Array.from({ length: 10 }, (_, index) => {
          const filled = index < value;
          const muted = mutedFrom !== undefined && index >= mutedFrom && index < value;

          return (
            <span
              className={`ten-frame-cell ${filled ? "filled" : ""} ${
                muted ? "muted" : ""
              }`}
              key={index}
            />
          );
        })}
      </div>
    </div>
  );
}
