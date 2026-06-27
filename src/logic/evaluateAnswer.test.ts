import { describe, expect, it } from "vitest";
import {
  buildStepByStepAdditionSteps,
  buildStepByStepSubtractionSteps
} from "./buildProblemSteps";
import {
  createFixedAdditionProblem,
  createSubtractionProblem
} from "./createProblem";
import { evaluateAnswer } from "./evaluateAnswer";

describe("evaluateAnswer", () => {
  it("accepts the expected answer", () => {
    const problem = createFixedAdditionProblem();
    const [step] = buildStepByStepAdditionSteps(problem);

    expect(evaluateAnswer(problem, step, 2, 0).correct).toBe(true);
  });

  it("classifies a wrong complement to ten", () => {
    const problem = createFixedAdditionProblem();
    const [step] = buildStepByStepAdditionSteps(problem);
    const result = evaluateAnswer(problem, step, 3, 0);

    expect(result.correct).toBe(false);
    expect(result.errorType).toBe("wrong_complement_to_ten");
    expect(result.hint).toContain("10");
  });

  it("classifies a wrong subtraction intermediate result", () => {
    const problem = createSubtractionProblem(13, 8);
    const [, step] = buildStepByStepSubtractionSteps(problem);
    const result = evaluateAnswer(problem, step, 3, 0);

    expect(result.correct).toBe(false);
    expect(result.errorType).toBe("wrong_remainder_after_make_ten");
    expect(result.hint).toContain("10");
  });
});
