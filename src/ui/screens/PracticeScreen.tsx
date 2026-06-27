import type {
  LearningStage,
  Problem,
  ProblemStep
} from "../../domain/problemTypes";
import { CherryDiagram } from "../components/CherryDiagram";
import { EquationPanel } from "../components/EquationPanel";
import { NumberButtons } from "../components/NumberButtons";
import {
  getCherryLeftValue,
  getCherryParent,
  getCherryRightValue,
  getModeLabel,
  getStageLabel
} from "../practiceDisplay";

export type Feedback = "correct" | "incorrect" | null;

type PracticeScreenProps = {
  problem: Problem;
  currentStep?: ProblemStep;
  stage: LearningStage;
  displayedAnswers: Record<string, number>;
  feedback: Feedback;
  hint: string;
  problemCompleted: boolean;
  problemIndex: number;
  problemCount: number;
  stepIndex: number;
  stepCount: number;
  onAnswer: (value: number) => void;
  onNextProblem: () => void;
};

export function PracticeScreen({
  problem,
  currentStep,
  stage,
  displayedAnswers,
  feedback,
  hint,
  problemCompleted,
  problemIndex,
  problemCount,
  stepIndex,
  stepCount,
  onAnswer,
  onNextProblem
}: PracticeScreenProps) {
  return (
    <main className="app-shell">
      <section className="practice-surface" aria-label="さくらんぼ計算の練習">
        <header className="practice-header">
          <div>
            <p className="mode-label">{getModeLabel(problem.operation)}</p>
            <p className="stage-label">{getStageLabel(stage)}</p>
            <h1>
              {problem.left} {problem.operation === "addition" ? "+" : "-"}{" "}
              {problem.right}
            </h1>
          </div>
          <div className="progress-stack">
            <div className="step-pill">
              {problemCompleted ? "できた" : `${stepIndex + 1} / ${stepCount}`}
            </div>
            <div className="question-progress">
              {problemIndex + 1} / {problemCount} もん
            </div>
          </div>
        </header>

        <div className="work-area">
          <CherryDiagram
            parent={getCherryParent(problem)}
            leftValue={getCherryLeftValue(problem, displayedAnswers)}
            rightValue={getCherryRightValue(problem, displayedAnswers)}
            activeTarget={currentStep?.visualTarget}
          />

          <EquationPanel
            problem={problem}
            currentStep={currentStep}
            completed={problemCompleted}
            answers={displayedAnswers}
            stage={stage}
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

        <div className="feedback-row" aria-live="polite">
          {feedback === "correct" && <div className="feedback correct">○</div>}
          {feedback === "incorrect" && <div className="feedback incorrect">×</div>}
          {!feedback && hint && <div className="hint-box">{hint}</div>}
          {!feedback && !hint && <div className="hint-placeholder"> </div>}
        </div>

        {problemCompleted ? (
          <div className="complete-actions">
            <button className="primary-action" type="button" onClick={onNextProblem}>
              {problemIndex + 1 >= problemCount ? "おしまい" : "つぎへ"}
            </button>
          </div>
        ) : (
          <NumberButtons max={18} onSelect={onAnswer} />
        )}
      </section>
    </main>
  );
}
