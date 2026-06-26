import type { Problem } from "../domain/problemTypes";

export function createFixedAdditionProblem(): Problem {
  const base = 8;
  const addend = 7;
  const neededToTen = 10 - base;
  const remainder = addend - neededToTen;
  const answer = base + addend;

  return {
    id: "addition-8-7",
    operation: "addition",
    left: base,
    right: addend,
    answer,
    strategy: {
      type: "addition_make_ten",
      base,
      addend,
      neededToTen,
      remainder,
      ten: 10,
      answer
    }
  };
}
