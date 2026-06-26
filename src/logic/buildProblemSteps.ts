import type { Problem, ProblemStep } from "../domain/problemTypes";

export function buildStepByStepAdditionSteps(problem: Problem): ProblemStep[] {
  const { base, addend, neededToTen, remainder, answer } = problem.strategy;

  return [
    {
      id: "needed-to-ten",
      prompt: `${base}を10にするには、あといくつ？`,
      expectedAnswer: neededToTen,
      answerKind: "complement_to_ten",
      visualTarget: "cherry_left"
    },
    {
      id: "remainder",
      prompt: `${addend}を${neededToTen}といくつにわける？`,
      expectedAnswer: remainder,
      answerKind: "decomposition_part",
      visualTarget: "cherry_right"
    },
    {
      id: "final-answer",
      prompt: `10と${remainder}で、いくつ？`,
      expectedAnswer: answer,
      answerKind: "final_answer",
      visualTarget: "equation_blank"
    }
  ];
}
