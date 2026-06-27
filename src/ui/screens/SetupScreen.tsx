import type { PracticeMode } from "../../domain/problemTypes";
import { RadioOption } from "../components/RadioOption";

type SetupScreenProps = {
  mode: PracticeMode;
  questionCount: number;
  questionCountOptions: number[];
  onModeChange: (mode: PracticeMode) => void;
  onQuestionCountChange: (count: number) => void;
  onStart: () => void;
};

export function SetupScreen({
  mode,
  questionCount,
  questionCountOptions,
  onModeChange,
  onQuestionCountChange,
  onStart
}: SetupScreenProps) {
  return (
    <main className="app-shell">
      <section className="practice-surface setup-surface" aria-label="練習の設定">
        <header className="practice-header">
          <div>
            <p className="mode-label">さくらんぼ計算</p>
            <h1>れんしゅう</h1>
          </div>
        </header>

        <div className="setup-panel">
          <fieldset>
            <legend>もんだい</legend>
            <RadioOption
              name="mode"
              value="addition"
              checked={mode === "addition"}
              onChange={() => onModeChange("addition")}
              label="たしざん"
            />
            <RadioOption
              name="mode"
              value="subtraction"
              checked={mode === "subtraction"}
              onChange={() => onModeChange("subtraction")}
              label="ひきざん"
            />
            <RadioOption
              name="mode"
              value="mixed"
              checked={mode === "mixed"}
              onChange={() => onModeChange("mixed")}
              label="まぜる"
            />
          </fieldset>

          <fieldset>
            <legend>なんもん</legend>
            {questionCountOptions.map((count) => (
              <RadioOption
                key={count}
                name="question-count"
                value={String(count)}
                checked={questionCount === count}
                onChange={() => onQuestionCountChange(count)}
                label={`${count}もん`}
              />
            ))}
          </fieldset>

        </div>

        <button className="primary-action" type="button" onClick={onStart}>
          はじめる
        </button>
      </section>
    </main>
  );
}
