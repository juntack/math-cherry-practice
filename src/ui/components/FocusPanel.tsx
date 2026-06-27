import type {
  LearningStage,
  Problem,
  ProblemStep,
  SupportLevel
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
  supportLevel: SupportLevel;
};

export function FocusPanel({
  problem,
  currentStep,
  completed,
  answers,
  stage,
  supportLevel
}: FocusPanelProps) {
  if (supportLevel === "less") {
    return (
      <ReducedSupportPanel
        problem={problem}
        currentStep={currentStep}
        completed={completed}
        answers={answers}
      />
    );
  }

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

function ReducedSupportPanel({
  problem,
  currentStep,
  completed,
  answers
}: {
  problem: Problem;
  currentStep?: ProblemStep;
  completed: boolean;
  answers: Record<string, number>;
}) {
  return (
    <div className="focus-panel reduced-focus-panel" aria-label="すくないほじょ">
      <div className="reduced-equation">
        {getReducedEquation(problem, currentStep, completed, answers)}
      </div>
    </div>
  );
}

function getReducedEquation(
  problem: Problem,
  currentStep: ProblemStep | undefined,
  completed: boolean,
  answers: Record<string, number>
): string {
  if (completed) {
    const operator = problem.operation === "addition" ? "+" : "-";
    return `${problem.left} ${operator} ${problem.right} = ${problem.answer}`;
  }

  if (!currentStep) {
    return "";
  }

  if (problem.strategy.type === "addition_make_ten") {
    const needed = answers["needed-to-ten"];
    const remainder = answers.remainder;

    if (currentStep.id === "needed-to-ten") {
      return `${problem.strategy.base} + □ = 10`;
    }

    if (currentStep.id === "remainder") {
      return `${problem.strategy.addend} = ${problem.strategy.neededToTen} + □`;
    }

    return `10 + ${remainder ?? "□"} = □`;
  }

  const ones = answers["subtraction-ones"];
  const remaining = answers["subtract-from-ten"];

  if (currentStep.id === "subtraction-ones") {
    return `${problem.strategy.minuend} = 10 + □`;
  }

  if (currentStep.id === "subtract-from-ten") {
    return `10 - ${problem.strategy.subtrahend} = □`;
  }

  return `${remaining ?? "□"} + ${ones ?? "□"} = □`;
}
