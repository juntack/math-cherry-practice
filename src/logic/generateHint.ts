import type { ErrorType, Problem, ProblemStep } from "../domain/problemTypes";

export function generateHint(
  problem: Problem,
  step: ProblemStep,
  errorType: ErrorType,
  mistakeCount: number
): string {
  if (problem.strategy.type === "subtraction_split_minuend") {
    return generateSubtractionHint(problem, step, errorType, mistakeCount);
  }

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

function generateSubtractionHint(
  problem: Problem,
  step: ProblemStep,
  errorType: ErrorType,
  mistakeCount: number
): string {
  if (problem.strategy.type !== "subtraction_split_minuend") {
    return "もういちど、ゆっくり考えてみよう。";
  }

  const {
    minuend,
    subtrahend,
    ones,
    remainingAfterSubtractFromTen
  } = problem.strategy;

  if (errorType === "decomposition_sum_mismatch") {
    return mistakeCount <= 1
      ? `${minuend}は、10といくつにわけられるかな？`
      : `${minuend}は10よりいくつ大きいか考えよう。`;
  }

  if (errorType === "wrong_remainder_after_make_ten") {
    return mistakeCount <= 1
      ? `10から${subtrahend}をひくところだけ考えよう。`
      : `10から${subtrahend}だけ戻るといくつかな？`;
  }

  if (step.id === "subtraction-final-answer") {
    return mistakeCount <= 1
      ? `${remainingAfterSubtractFromTen}と、はじめにわけた${ones}をあわせよう。`
      : `${remainingAfterSubtractFromTen}から${ones}だけ進むといくつかな？`;
  }

  return "もういちど、ゆっくり考えてみよう。";
}
