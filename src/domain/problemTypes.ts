export type Operation = "addition" | "subtraction";

export type PracticeMode = Operation | "mixed";

export type SupportLevel = "full" | "less";

export type LearningStage =
  | "number_decomposition"
  | "make_ten_decomposition"
  | "step_by_step";

export type AdditionMakeTenStrategy = {
  type: "addition_make_ten";
  base: number;
  addend: number;
  neededToTen: number;
  remainder: number;
  ten: 10;
  answer: number;
};

export type SubtractionSplitMinuendStrategy = {
  type: "subtraction_split_minuend";
  minuend: number;
  subtrahend: number;
  ten: 10;
  ones: number;
  remainingAfterSubtractFromTen: number;
  answer: number;
};

export type Strategy =
  | AdditionMakeTenStrategy
  | SubtractionSplitMinuendStrategy;

export type Problem = {
  id: string;
  operation: Operation;
  left: number;
  right: number;
  answer: number;
  strategy: Strategy;
};

export type AnswerKind =
  | "complement_to_ten"
  | "decomposition_part"
  | "intermediate_result"
  | "final_answer";

export type VisualTarget = "cherry_left" | "cherry_right" | "equation_blank";

export type VisualFocus =
  | "base_ten_frame"
  | "split_cherry"
  | "subtract_ten_frame"
  | "combine_equation";

export type ProblemStep = {
  id: string;
  prompt: string;
  expectedAnswer: number;
  answerKind: AnswerKind;
  visualTarget: VisualTarget;
  visualFocus: VisualFocus;
  knownAnswers?: Record<string, number>;
};

export type ErrorType =
  | "wrong_complement_to_ten"
  | "decomposition_sum_mismatch"
  | "wrong_remainder_after_make_ten"
  | "wrong_final_calculation"
  | "operation_confusion"
  | "unknown";

export type EvaluationResult = {
  correct: boolean;
  errorType?: ErrorType;
  hint: string;
};
