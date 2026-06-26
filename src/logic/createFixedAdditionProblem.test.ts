import { describe, expect, it } from "vitest";
import { createFixedAdditionProblem } from "./createFixedAdditionProblem";

describe("createFixedAdditionProblem", () => {
  it("creates the 8 + 7 make-ten strategy", () => {
    const problem = createFixedAdditionProblem();

    expect(problem.left).toBe(8);
    expect(problem.right).toBe(7);
    expect(problem.answer).toBe(15);
    expect(problem.strategy.neededToTen).toBe(2);
    expect(problem.strategy.remainder).toBe(5);
  });
});
