import { describe, expect, it } from "vitest";
import { buildProblemSteps } from "./buildProblemSteps";
import {
  createFixedAdditionProblem,
  createSubtractionProblem
} from "./createProblem";

describe("buildProblemSteps", () => {
  it("builds one decomposition step for stage 1", () => {
    const problem = createFixedAdditionProblem();
    const steps = buildProblemSteps(problem, "number_decomposition");

    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      expectedAnswer: 5,
      visualTarget: "cherry_right",
      visualFocus: "split_cherry",
      knownAnswers: {
        "needed-to-ten": 2
      }
    });
  });

  it("builds make-ten decomposition steps for stage 2 addition", () => {
    const problem = createFixedAdditionProblem();
    const steps = buildProblemSteps(problem, "make_ten_decomposition");

    expect(steps.map((step) => step.id)).toEqual(["needed-to-ten", "remainder"]);
    expect(steps.map((step) => step.visualFocus)).toEqual([
      "base_ten_frame",
      "split_cherry"
    ]);
  });

  it("builds step-by-step calculation steps for stage 3 subtraction", () => {
    const problem = createSubtractionProblem(13, 8);
    const steps = buildProblemSteps(problem, "step_by_step");

    expect(steps.map((step) => step.expectedAnswer)).toEqual([3, 2, 5]);
    expect(steps.map((step) => step.visualFocus)).toEqual([
      "split_cherry",
      "subtract_ten_frame",
      "combine_equation"
    ]);
  });
});
