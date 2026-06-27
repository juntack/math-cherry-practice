import { describe, expect, it } from "vitest";
import {
  createAdditionProblem,
  createFixedAdditionProblem,
  createSubtractionProblem,
  generateAdditionProblem,
  generateProblem
} from "./createProblem";

describe("createFixedAdditionProblem", () => {
  it("creates the 8 + 7 make-ten strategy", () => {
    const problem = createFixedAdditionProblem();

    expect(problem.left).toBe(8);
    expect(problem.right).toBe(7);
    expect(problem.answer).toBe(15);
    expect(problem.strategy.type).toBe("addition_make_ten");
    if (problem.strategy.type !== "addition_make_ten") {
      throw new Error("Expected an addition strategy.");
    }
    expect(problem.strategy.neededToTen).toBe(2);
    expect(problem.strategy.remainder).toBe(5);
  });
});

describe("createAdditionProblem", () => {
  it("supports answers up to 19", () => {
    const problem = createAdditionProblem(9, 10);

    expect(problem.answer).toBe(19);
    expect(problem.strategy).toMatchObject({
      type: "addition_make_ten",
      neededToTen: 1,
      remainder: 9
    });
  });
});

describe("createSubtractionProblem", () => {
  it("creates the 13 - 8 split-minuend strategy", () => {
    const problem = createSubtractionProblem(13, 8);

    expect(problem.left).toBe(13);
    expect(problem.right).toBe(8);
    expect(problem.answer).toBe(5);
    expect(problem.strategy).toMatchObject({
      type: "subtraction_split_minuend",
      ones: 3,
      remainingAfterSubtractFromTen: 2
    });
  });

  it("does not use 19 as a subtraction minuend", () => {
    expect(() => createSubtractionProblem(19, 8)).toThrow(
      "Invalid borrowing subtraction problem"
    );
  });
});

describe("generateProblem", () => {
  it("can generate an addition problem", () => {
    const problem = generateAdditionProblem(() => 0);

    expect(problem.operation).toBe("addition");
    expect(problem.left + problem.right).toBeGreaterThanOrEqual(10);
    expect(problem.left + problem.right).toBeLessThanOrEqual(19);
  });

  it("uses both operations in mixed mode", () => {
    expect(generateProblem("mixed", () => 0.2).operation).toBe("addition");
    expect(generateProblem("mixed", () => 0.8).operation).toBe("subtraction");
  });
});
