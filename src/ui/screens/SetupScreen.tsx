import type { LearningStage, PracticeMode } from "../../domain/problemTypes";
import { RadioOption } from "../components/RadioOption";

type SetupScreenProps = {
  mode: PracticeMode;
  stage: LearningStage;
  questionCount: number;
  questionCountOptions: number[];
  stageOptions: Array<{ value: LearningStage; label: string }>;
  onModeChange: (mode: PracticeMode) => void;
  onStageChange: (stage: LearningStage) => void;
  onQuestionCountChange: (count: number) => void;
  onStart: () => void;
};

export function SetupScreen({
  mode,
  stage,
  questionCount,
  questionCountOptions,
  stageOptions,
  onModeChange,
  onStageChange,
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

          <fieldset className="wide-fieldset">
            <legend>れんしゅう</legend>
            {stageOptions.map((option) => (
              <RadioOption
                key={option.value}
                name="stage"
                value={option.value}
                checked={stage === option.value}
                onChange={() => onStageChange(option.value)}
                label={option.label}
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
