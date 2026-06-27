import type { LearningStage, Problem } from "../domain/problemTypes";

export function getModeLabel(
  operation: Problem["operation"],
  stage: LearningStage
): string {
  const mode = operation === "addition" ? "たしざん" : "ひきざん";
  const style = stage === "mental_calculation" ? "あんざん" : "さくらんぼけいさん";

  return `${mode}・${style}`;
}

export function getCherryParent(problem: Problem): number {
  return problem.strategy.type === "addition_make_ten"
    ? problem.strategy.addend
    : problem.strategy.minuend;
}

export function getCherryLeftValue(
  problem: Problem,
  answers: Record<string, number>
): number | undefined {
  return problem.strategy.type === "addition_make_ten"
    ? answers["needed-to-ten"]
    : 10;
}

export function getCherryRightValue(
  problem: Problem,
  answers: Record<string, number>
): number | undefined {
  return problem.strategy.type === "addition_make_ten"
    ? answers.remainder
    : answers["subtraction-ones"];
}
