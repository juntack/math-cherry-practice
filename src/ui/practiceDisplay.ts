import type { Problem } from "../domain/problemTypes";

export function getModeLabel(operation: Problem["operation"]): string {
  return operation === "addition"
    ? "たしざん・さくらんぼけいさん"
    : "ひきざん・さくらんぼけいさん";
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
