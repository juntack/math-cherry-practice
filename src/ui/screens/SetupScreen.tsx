import type {
  LearningStage,
  PracticeMode,
  SupportLevel
} from "../../domain/problemTypes";
import { RadioOption } from "../components/RadioOption";

type SetupScreenProps = {
  mode: PracticeMode;
  questionCount: number;
  questionCountOptions: number[];
  stage: LearningStage;
  stageOptions: Array<{ value: LearningStage; label: string }>;
  supportLevel: SupportLevel;
  supportOptions: Array<{ value: SupportLevel; label: string }>;
  onModeChange: (mode: PracticeMode) => void;
  onQuestionCountChange: (count: number) => void;
  onStageChange: (stage: LearningStage) => void;
  onSupportLevelChange: (supportLevel: SupportLevel) => void;
  onStart: () => void;
};

export function SetupScreen({
  mode,
  questionCount,
  questionCountOptions,
  stage,
  stageOptions,
  supportLevel,
  supportOptions,
  onModeChange,
  onQuestionCountChange,
  onStageChange,
  onSupportLevelChange,
  onStart
}: SetupScreenProps) {
  return (
    <main className="app-shell">
      <section className="practice-surface setup-surface" aria-label="れんしゅうのせってい">
        <header className="practice-header">
          <div>
            <p className="mode-label">さくらんぼけいさん</p>
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
              label="どちらも"
            />
          </fieldset>

          <fieldset>
            <legend>もんだいすう</legend>
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

          <fieldset>
            <legend>やりかた</legend>
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

          <fieldset>
            <legend>ヒントのりょう</legend>
            {supportOptions.map((option) => (
              <RadioOption
                key={option.value}
                name="support-level"
                value={option.value}
                checked={supportLevel === option.value}
                onChange={() => onSupportLevelChange(option.value)}
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
