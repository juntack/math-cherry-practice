import type {
  LearningStage,
  Problem,
  ProblemStep
} from "../../domain/problemTypes";
import { CherryDiagram } from "./CherryDiagram";
import { EquationPanel } from "./EquationPanel";
import { TenFrame } from "./TenFrame";
import {
  getCherryLeftValue,
  getCherryParent,
  getCherryRightValue
} from "../practiceDisplay";

type FocusPanelProps = {
  problem: Problem;
  currentStep?: ProblemStep;
  completed: boolean;
  answers: Record<string, number>;
  stage: LearningStage;
};

export function FocusPanel({
  problem,
  currentStep,
  completed,
  answers,
  stage
}: FocusPanelProps) {
  const visualFocus = currentStep?.visualFocus ?? "combine_equation";

  if (visualFocus === "split_cherry") {
    return (
      <div className="focus-panel">
        <CherryDiagram
          parent={getCherryParent(problem)}
          leftValue={getCherryLeftValue(problem, answers)}
          rightValue={getCherryRightValue(problem, answers)}
          activeTarget={currentStep?.visualTarget}
        />
      </div>
    );
  }

  if (visualFocus === "base_ten_frame" && problem.strategy.type === "addition_make_ten") {
    return (
      <div className="focus-panel ten-frame-focus">
        <TenFrame
          label={`${problem.strategy.base}を10にする`}
          value={problem.strategy.base}
        />
      </div>
    );
  }

  if (
    visualFocus === "subtract_ten_frame" &&
    problem.strategy.type === "subtraction_split_minuend"
  ) {
    return (
      <div className="focus-panel ten-frame-focus">
        <TenFrame
          label={`10から${problem.strategy.subtrahend}をひく`}
          value={10}
          mutedFrom={problem.strategy.remainingAfterSubtractFromTen}
        />
      </div>
    );
  }

  return (
    <EquationPanel
      problem={problem}
      currentStep={currentStep}
      completed={completed}
      answers={answers}
      stage={stage}
    />
  );
}
