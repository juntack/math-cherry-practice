import type {
  LearningStage,
  Problem,
  ProblemStep,
  SupportLevel
} from "../../domain/problemTypes";
import { FocusPanel } from "../components/FocusPanel";
import { NumberButtons } from "../components/NumberButtons";
import {
  getModeLabel
} from "../practiceDisplay";

export type Feedback = "correct" | "incorrect" | null;

type PracticeScreenProps = {
  problem: Problem;
  currentStep?: ProblemStep;
  stage: LearningStage;
  supportLevel: SupportLevel;
  displayedAnswers: Record<string, number>;
  feedback: Feedback;
  hint: string;
  problemCompleted: boolean;
  problemIndex: number;
  problemCount: number;
  stepIndex: number;
  stepCount: number;
  onAnswer: (value: number) => void;
  onBackToSetup: () => void;
  onNextProblem: () => void;
};

export function PracticeScreen({
  problem,
  currentStep,
  stage,
  supportLevel,
  displayedAnswers,
  feedback,
  hint,
  problemCompleted,
  problemIndex,
  problemCount,
  stepIndex,
  stepCount,
  onAnswer,
  onBackToSetup,
  onNextProblem
}: PracticeScreenProps) {
  return (
    <main className="app-shell">
      <section className="practice-surface" aria-label="さくらんぼけいさんのれんしゅう">
        <header className="practice-header">
          <div>
            <p className="mode-label">{getModeLabel(problem.operation, stage)}</p>
            <h1>
              {problem.left} {problem.operation === "addition" ? "+" : "-"}{" "}
              {problem.right}
            </h1>
          </div>
          <div className="progress-stack">
            <button className="top-button" type="button" onClick={onBackToSetup}>
              トップへ
            </button>
            <div className="step-pill">
              {problemCompleted ? "せいかい" : `${stepIndex + 1} / ${stepCount}`}
            </div>
            <div className="question-progress">
              {problemIndex + 1} / {problemCount} もん
            </div>
          </div>
        </header>

        <div className="work-area focus-work-area">
          <FocusPanel
            problem={problem}
            currentStep={currentStep}
            completed={problemCompleted}
            answers={displayedAnswers}
            stage={stage}
            supportLevel={supportLevel}
          />
        </div>

        <div className="prompt-row">
          {problemCompleted ? (
            <p>
              {problem.left} {problem.operation === "addition" ? "+" : "-"}{" "}
              {problem.right} = {problem.answer}
            </p>
          ) : (
            <p>{currentStep?.prompt}</p>
          )}
        </div>

        <div
          className="step-track"
          aria-label={`${stepCount}このうち${Math.min(stepIndex + 1, stepCount)}こめ`}
        >
          {Array.from({ length: stepCount }, (_, index) => (
            <span
              key={index}
              className={[
                "step-dot",
                index < stepIndex || problemCompleted ? "done" : "",
                index === stepIndex && !problemCompleted ? "current" : ""
              ]
                .filter(Boolean)
                .join(" ")}
            />
          ))}
        </div>

        {problemCompleted ? (
          <div className="completion-card" aria-live="polite">
            <div className="completion-mark">○</div>
            <p>このもんだい せいかい</p>
          </div>
        ) : (
          <div className="feedback-row" aria-live="polite">
            {feedback === "correct" && <div className="feedback correct">○</div>}
            {feedback === "incorrect" && <div className="feedback incorrect">×</div>}
            {!feedback && hint && <div className="hint-box">{hint}</div>}
            {!feedback && !hint && <div className="hint-placeholder"> </div>}
          </div>
        )}

        {problemCompleted ? (
          <div className="complete-actions">
            <button className="primary-action" type="button" onClick={onNextProblem}>
              {problemIndex + 1 >= problemCount ? "おしまい" : "つぎへ"}
            </button>
          </div>
        ) : (
          <NumberButtons max={19} onSelect={onAnswer} />
        )}
      </section>
    </main>
  );
}
