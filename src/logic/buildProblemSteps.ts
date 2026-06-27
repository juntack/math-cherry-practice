import type { Problem, ProblemStep } from "../domain/problemTypes";

export function buildProblemSteps(problem: Problem): ProblemStep[] {
  if (problem.strategy.type === "addition_make_ten") {
    return buildStepByStepAdditionSteps(problem);
  }

  return buildStepByStepSubtractionSteps(problem);
}

export function buildStepByStepAdditionSteps(problem: Problem): ProblemStep[] {
  if (problem.strategy.type !== "addition_make_ten") {
    throw new Error("Addition steps require an addition strategy.");
  }

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

export function buildStepByStepSubtractionSteps(problem: Problem): ProblemStep[] {
  if (problem.strategy.type !== "subtraction_split_minuend") {
    throw new Error("Subtraction steps require a subtraction strategy.");
  }

  const {
    minuend,
    subtrahend,
    ones,
    remainingAfterSubtractFromTen,
    answer
  } = problem.strategy;

  return [
    {
      id: "subtraction-ones",
      prompt: `${minuend}を10といくつにわける？`,
      expectedAnswer: ones,
      answerKind: "decomposition_part",
      visualTarget: "cherry_right"
    },
    {
      id: "subtract-from-ten",
      prompt: `10から${subtrahend}をひくと、いくつ？`,
      expectedAnswer: remainingAfterSubtractFromTen,
      answerKind: "intermediate_result",
      visualTarget: "equation_blank"
    },
    {
      id: "subtraction-final-answer",
      prompt: `${remainingAfterSubtractFromTen}と${ones}で、いくつ？`,
      expectedAnswer: answer,
      answerKind: "final_answer",
      visualTarget: "equation_blank"
    }
  ];
}
