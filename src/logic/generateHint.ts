import type { ErrorType, Problem, ProblemStep } from "../domain/problemTypes";

export function generateHint(
  problem: Problem,
  step: ProblemStep,
  errorType: ErrorType,
  mistakeCount: number
): string {
  const { base, addend, neededToTen, remainder } = problem.strategy;

  if (errorType === "wrong_complement_to_ten") {
    return mistakeCount <= 1
      ? `${base}から10まで、あといくつ進むかな？`
      : `${base}にいくつ足すと10になるか、数字をひとつずつ数えてみよう。`;
  }

  if (errorType === "decomposition_sum_mismatch") {
    return mistakeCount <= 1
      ? `${addend}を${neededToTen}といくつにわけると、もとの${addend}になるかな？`
      : `${neededToTen}に、のこりを足したら${addend}になる数をえらぼう。`;
  }

  if (step.id === "final-answer") {
    return mistakeCount <= 1
      ? `10のまとまりと、のこりの${remainder}をあわせて考えよう。`
      : `10から${remainder}だけ進むといくつになるかな？`;
  }

  return "もういちど、ゆっくり考えてみよう。";
}
