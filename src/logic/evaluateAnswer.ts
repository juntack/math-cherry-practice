import type { EvaluationResult, Problem, ProblemStep } from "../domain/problemTypes";
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

  const errorType =
    step.answerKind === "complement_to_ten"
      ? "wrong_complement_to_ten"
      : step.answerKind === "decomposition_part"
        ? "decomposition_sum_mismatch"
        : "wrong_final_calculation";

  return {
    correct: false,
    errorType,
    hint: generateHint(problem, step, errorType, mistakeCount + 1)
  };
}
