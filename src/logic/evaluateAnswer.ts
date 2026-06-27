import type {
  ErrorType,
  EvaluationResult,
  Problem,
  ProblemStep
} from "../domain/problemTypes";
import { generateHint } from "./generateHint";

export function evaluateAnswer(
  problem: Problem,
  step: ProblemStep,
  value: number,
  mistakeCount: number
): EvaluationResult {
  if (value === step.expectedAnswer) {
    return {
      correct: true,
      hint: ""
    };
  }

  const errorType = classifyStepError(problem, step);

  return {
    correct: false,
    errorType,
    hint: generateHint(problem, step, errorType, mistakeCount + 1)
  };
}

function classifyStepError(
  problem: Problem,
  step: ProblemStep
): ErrorType {
  if (
    problem.operation === "addition" &&
    step.answerKind === "complement_to_ten"
  ) {
    return "wrong_complement_to_ten";
  }

  if (step.answerKind === "decomposition_part") {
    return "decomposition_sum_mismatch";
  }

  if (step.answerKind === "intermediate_result") {
    return "wrong_remainder_after_make_ten";
  }

  if (step.answerKind === "final_answer") {
    return "wrong_final_calculation";
  }

  return "unknown";
}
