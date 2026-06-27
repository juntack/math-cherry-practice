import type { LearningStage, Problem } from "../domain/problemTypes";

export function getModeLabel(operation: Problem["operation"]): string {
  return operation === "addition"
    ? "たしざん・さくらんぼ計算"
    : "ひきざん・さくらんぼ計算";
}

export function getStageLabel(stage: LearningStage): string {
  if (stage === "number_decomposition") {
    return "かずをわける";
  }

  if (stage === "make_ten_decomposition") {
    return "10をつくる";
  }

  return "じゅんばんにけいさん";
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
