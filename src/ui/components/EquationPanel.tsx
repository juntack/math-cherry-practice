import type {
  LearningStage,
  Problem,
  ProblemStep
} from "../../domain/problemTypes";
import { TenFrame } from "./TenFrame";

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
  if (stage === "mental_calculation") {
    const operator = problem.operation === "addition" ? "+" : "-";
    const answer = answers["mental-answer"];

    return (
      <div className="equation-panel mental-panel" aria-label="あんざん">
        <div className="equation-line">
          {problem.left} {operator} {problem.right} ={" "}
          {completed ? problem.answer : answer ?? "□"}
        </div>
        <div className="equation-note">
          {completed ? `こたえは${problem.answer}` : "こたえをえらぼう"}
        </div>
      </div>
    );
  }

  if (stage !== "step_by_step") {
    return (
      <div className="equation-panel" aria-label="れんしゅうのねらい">
        <div className="focus-message">
          {stage === "number_decomposition"
            ? "かずを2つにわけよう"
            : "10をつくるわけかたをかんがえよう"}
        </div>
        <TenFrameGroup problem={problem} answers={answers} stage={stage} />
      </div>
    );
  }

  if (problem.strategy.type === "subtraction_split_minuend") {
    const ones = answers["subtraction-ones"];
    const remaining = answers["subtract-from-ten"];
    const finalAnswer = answers["subtraction-final-answer"];

    return (
      <div className="equation-panel" aria-label="とちゅうのけいさん">
        <div className="equation-line">
          10 - {problem.strategy.subtrahend} = {remaining ?? "□"}
        </div>
        <div className="equation-line">
          {remaining ?? "□"} + {ones ?? "□"} = {finalAnswer ?? "□"}
        </div>
        <div className="equation-note">
          {completed
            ? `こたえは${problem.answer}`
            : currentStep?.id === "subtraction-final-answer"
              ? "さいごのこたえをえらぼう"
              : "10からひいて、のこりをあわせよう"}
        </div>
        <TenFrameGroup problem={problem} answers={answers} stage={stage} />
      </div>
    );
  }

  const neededToTen = answers["needed-to-ten"];
  const remainder = answers.remainder;
  const answer = answers["final-answer"];

  return (
    <div className="equation-panel" aria-label="とちゅうのけいさん">
      <div className="equation-line">
        {problem.strategy.base} + {neededToTen ?? "□"} ={" "}
        {neededToTen === problem.strategy.neededToTen ? 10 : "□"}
      </div>
      <div className="equation-line">
        10 + {remainder ?? "□"} = {answer ?? "□"}
      </div>
      <div className="equation-note">
        {completed
          ? `こたえは${problem.answer}`
          : currentStep?.id === "final-answer"
            ? "さいごのこたえをえらぼう"
            : "まず10のまとまりをつくろう"}
      </div>
      <TenFrameGroup problem={problem} answers={answers} stage={stage} />
    </div>
  );
}

function TenFrameGroup({
  problem,
  answers,
  stage
}: {
  problem: Problem;
  answers: Record<string, number>;
  stage: LearningStage;
}) {
  if (problem.strategy.type === "addition_make_ten") {
    const madeTen = answers["needed-to-ten"] === problem.strategy.neededToTen;
    const showRemainder =
      stage === "step_by_step" && answers.remainder === problem.strategy.remainder;

    return (
      <div className="ten-frame-group">
        <TenFrame
          label={madeTen ? "10のまとまり" : `${problem.strategy.base}`}
          value={madeTen ? 10 : problem.strategy.base}
          mutedFrom={problem.strategy.base}
        />
        {showRemainder && (
          <TenFrame label="のこり" value={problem.strategy.remainder} />
        )}
      </div>
    );
  }

  const remaining = answers["subtract-from-ten"];
  const ones = answers["subtraction-ones"];

  return (
    <div className="ten-frame-group">
      <TenFrame
        label={remaining === undefined ? "10からひく" : "10からひいたのこり"}
        value={remaining ?? 10}
        mutedFrom={remaining}
      />
      {ones !== undefined && <TenFrame label="わけたかず" value={ones} />}
    </div>
  );
}
