import { useState } from "react";

type NumberButtonsProps = {
  max: number;
  onSelect: (value: number) => void;
};

export function NumberButtons({ max, onSelect }: NumberButtonsProps) {
  const [draft, setDraft] = useState("");
  const value = draft === "" ? null : Number(draft);
  const canSubmit = value !== null && value <= max;

  function addDigit(digit: string) {
    const next = draft === "0" ? digit : `${draft}${digit}`;

    if (next.length > 2 || Number(next) > max) {
      return;
    }

    setDraft(next);
  }

  function clearDigit() {
    setDraft((current) => current.slice(0, -1));
  }

  function submitAnswer() {
    if (value === null || value > max) {
      return;
    }

    onSelect(value);
    setDraft("");
  }

  return (
    <div className="number-pad" aria-label="テンキー">
      <div className="answer-display" aria-live="polite">
        {draft || " "}
      </div>
      <div className="keypad-grid">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
          <button
            className="number-button"
            type="button"
            key={digit}
            onClick={() => addDigit(digit)}
          >
            {digit}
          </button>
        ))}
        <button
          className="number-button utility-button"
          type="button"
          onClick={clearDigit}
          disabled={draft === ""}
        >
          けす
        </button>
        <button className="number-button" type="button" onClick={() => addDigit("0")}>
          0
        </button>
        <button
          className="number-button submit-button"
          type="button"
          onClick={submitAnswer}
          disabled={!canSubmit}
        >
          こたえる
        </button>
      </div>
    </div>
  );
}
