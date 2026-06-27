import type {
  Operation,
  PracticeMode,
  Problem
} from "../domain/problemTypes";

export type RandomSource = () => number;

export function createFixedAdditionProblem(): Problem {
  return createAdditionProblem(8, 7);
}

export function createAdditionProblem(a: number, b: number): Problem {
  if (a < 1 || a > 9 || b < 1 || b > 9 || a + b < 10) {
    throw new Error(`Invalid carry addition problem: ${a} + ${b}`);
  }

  const neededToTen = 10 - a;
  const remainder = b - neededToTen;
  const answer = a + b;

  return {
    id: `addition-${a}-${b}`,
    operation: "addition",
    left: a,
    right: b,
    answer,
    strategy: {
      type: "addition_make_ten",
      base: a,
      addend: b,
      neededToTen,
      remainder,
      ten: 10,
      answer
    }
  };
}

export function createSubtractionProblem(a: number, b: number): Problem {
  const ones = a - 10;

  if (a < 11 || a > 18 || b < 1 || b > 9 || ones >= b) {
    throw new Error(`Invalid borrowing subtraction problem: ${a} - ${b}`);
  }

  const remainingAfterSubtractFromTen = 10 - b;
  const answer = remainingAfterSubtractFromTen + ones;

  return {
    id: `subtraction-${a}-${b}`,
    operation: "subtraction",
    left: a,
    right: b,
    answer,
    strategy: {
      type: "subtraction_split_minuend",
      minuend: a,
      subtrahend: b,
      ten: 10,
      ones,
      remainingAfterSubtractFromTen,
      answer
    }
  };
}

export function generateProblem(
  mode: PracticeMode,
  random: RandomSource = Math.random
): Problem {
  const operation = pickOperation(mode, random);

  return operation === "addition"
    ? generateAdditionProblem(random)
    : generateSubtractionProblem(random);
}

export function generateAdditionProblem(random: RandomSource = Math.random): Problem {
  const candidates: Array<[number, number]> = [];

  for (let a = 1; a <= 9; a += 1) {
    for (let b = 1; b <= 9; b += 1) {
      if (a + b >= 10) {
        candidates.push([a, b]);
      }
    }
  }

  const [a, b] = pick(candidates, random);
  return createAdditionProblem(a, b);
}

export function generateSubtractionProblem(
  random: RandomSource = Math.random
): Problem {
  const candidates: Array<[number, number]> = [];

  for (let a = 11; a <= 18; a += 1) {
    for (let b = 1; b <= 9; b += 1) {
      if (a - 10 < b) {
        candidates.push([a, b]);
      }
    }
  }

  const [a, b] = pick(candidates, random);
  return createSubtractionProblem(a, b);
}

function pickOperation(mode: PracticeMode, random: RandomSource): Operation {
  if (mode !== "mixed") {
    return mode;
  }

  return random() < 0.5 ? "addition" : "subtraction";
}

function pick<T>(items: T[], random: RandomSource): T {
  return items[Math.floor(random() * items.length)];
}
