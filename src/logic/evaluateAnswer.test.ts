import { describe, expect, it } from "vitest";
import { buildStepByStepAdditionSteps } from "./buildProblemSteps";
import { createFixedAdditionProblem } from "./createFixedAdditionProblem";
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
});
