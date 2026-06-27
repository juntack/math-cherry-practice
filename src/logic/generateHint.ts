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
      ? `${base}から10まで、あといくつすすむかな？`
      : `${base}にいくつたすと10になるか、すうじをひとつずつかぞえてみよう。`;
  }

  if (errorType === "decomposition_sum_mismatch") {
    return mistakeCount <= 1
      ? `${addend}を${neededToTen}といくつにわけると、もとの${addend}になるかな？`
      : `${neededToTen}に、のこりをたしたら${addend}になるかずをえらぼう。`;
  }

  if (step.answerKind === "final_answer") {
    return mistakeCount <= 1
      ? `10のまとまりと、のこりの${remainder}をあわせてかんがえよう。`
      : `10から${remainder}だけすすむといくつになるかな？`;
  }

  return "もういちど、ゆっくりかんがえてみよう。";
}

function generateSubtractionHint(
  problem: Problem,
  step: ProblemStep,
  errorType: ErrorType,
  mistakeCount: number
): string {
  if (problem.strategy.type !== "subtraction_split_minuend") {
    return "もういちど、ゆっくりかんがえてみよう。";
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
      : `${minuend}は10よりいくつおおきいか、かんがえよう。`;
  }

  if (errorType === "wrong_remainder_after_make_ten") {
    return mistakeCount <= 1
      ? `10から${subtrahend}をひくところだけ、かんがえよう。`
      : `10から${subtrahend}だけもどるといくつかな？`;
  }

  if (step.answerKind === "final_answer") {
    return mistakeCount <= 1
      ? `${remainingAfterSubtractFromTen}と、はじめにわけた${ones}をあわせよう。`
      : `${remainingAfterSubtractFromTen}から${ones}だけすすむといくつかな？`;
  }

  return "もういちど、ゆっくりかんがえてみよう。";
}
