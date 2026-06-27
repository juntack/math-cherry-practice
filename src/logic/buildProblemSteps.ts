import type { LearningStage, Problem, ProblemStep } from "../domain/problemTypes";

export function buildProblemSteps(
  problem: Problem,
  stage: LearningStage
): ProblemStep[] {
  if (stage === "number_decomposition") {
    return buildNumberDecompositionSteps(problem);
  }

  if (stage === "make_ten_decomposition") {
    return buildMakeTenDecompositionSteps(problem);
  }

  if (problem.strategy.type === "addition_make_ten") {
    return buildStepByStepAdditionSteps(problem);
  }

  return buildStepByStepSubtractionSteps(problem);
}

export function buildNumberDecompositionSteps(problem: Problem): ProblemStep[] {
  if (problem.strategy.type === "addition_make_ten") {
    const { addend, neededToTen, remainder } = problem.strategy;

    return [
      {
        id: "number-decomposition-remainder",
        prompt: `${addend}は${neededToTen}といくつ？`,
        expectedAnswer: remainder,
        answerKind: "decomposition_part",
        visualTarget: "cherry_right",
        knownAnswers: {
          "needed-to-ten": neededToTen
        }
      }
    ];
  }

  const { minuend, ones } = problem.strategy;

  return [
    {
      id: "number-decomposition-ones",
      prompt: `${minuend}は10といくつ？`,
      expectedAnswer: ones,
      answerKind: "decomposition_part",
      visualTarget: "cherry_right",
      knownAnswers: {
        "subtraction-ten": 10
      }
    }
  ];
}

export function buildMakeTenDecompositionSteps(problem: Problem): ProblemStep[] {
  if (problem.strategy.type === "addition_make_ten") {
    const { base, addend, neededToTen, remainder } = problem.strategy;

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
      }
    ];
  }

  return buildNumberDecompositionSteps(problem);
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
      visualTarget: "cherry_right",
      knownAnswers: {
        "needed-to-ten": neededToTen
      }
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
