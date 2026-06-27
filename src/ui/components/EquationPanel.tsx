import type {
  LearningStage,
  Problem,
  ProblemStep
} from "../../domain/problemTypes";

type EquationPanelProps = {
  problem: Problem;
  currentStep?: ProblemStep;
  completed: boolean;
  answers: Record<string, number>;
  stage: LearningStage;
};

export function EquationPanel({
  problem,
  currentStep,
  completed,
  answers,
  stage
}: EquationPanelProps) {
  if (stage !== "step_by_step") {
    return (
      <div className="equation-panel" aria-label="練習のねらい">
        <div className="focus-message">
          {stage === "number_decomposition"
            ? "数を2つにわけよう"
            : "10を作るわけ方を考えよう"}
        </div>
      </div>
    );
  }

  if (problem.strategy.type === "subtraction_split_minuend") {
    const ones = answers["subtraction-ones"];
    const remaining = answers["subtract-from-ten"];
    const finalAnswer = answers["subtraction-final-answer"];

    return (
      <div className="equation-panel" aria-label="途中計算">
        <div className="equation-line">
          10 - {problem.strategy.subtrahend} = {remaining ?? "□"}
        </div>
        <div className="equation-line">
          {remaining ?? "□"} + {ones ?? "□"} = {finalAnswer ?? "□"}
        </div>
        <div className="equation-note">
          {completed
            ? `答えは${problem.answer}`
            : currentStep?.id === "subtraction-final-answer"
              ? "さいごの答えをえらぼう"
              : "10からひいて、のこりをあわせよう"}
        </div>
      </div>
    );
  }

  const neededToTen = answers["needed-to-ten"];
  const remainder = answers.remainder;
  const answer = answers["final-answer"];

  return (
    <div className="equation-panel" aria-label="途中計算">
      <div className="equation-line">
        {problem.strategy.base} + {neededToTen ?? "□"} ={" "}
        {neededToTen === problem.strategy.neededToTen ? 10 : "□"}
      </div>
      <div className="equation-line">
        10 + {remainder ?? "□"} = {answer ?? "□"}
      </div>
      <div className="equation-note">
        {completed
          ? `答えは${problem.answer}`
          : currentStep?.id === "final-answer"
            ? "さいごの答えをえらぼう"
            : "まず10のまとまりを作ろう"}
      </div>
    </div>
  );
}
