import { useMemo, useState } from "react";
import type {
  LearningStage,
  PracticeMode,
  Problem,
  SupportLevel
} from "../domain/problemTypes";
import { playFeedbackSound } from "../audio/feedbackSound";
import { buildProblemSteps } from "../logic/buildProblemSteps";
import { generateProblem } from "../logic/createProblem";
import { evaluateAnswer } from "../logic/evaluateAnswer";
import type { Feedback } from "./screens/PracticeScreen";
import { PracticeScreen } from "./screens/PracticeScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { SetupScreen } from "./screens/SetupScreen";

type SessionState = "setup" | "practice" | "result";

const QUESTION_COUNT_OPTIONS = [3, 5, 10];
const ACTIVE_STAGE: LearningStage = "step_by_step";
const SUPPORT_OPTIONS: Array<{ value: SupportLevel; label: string }> = [
  { value: "full", label: "おおい" },
  { value: "less", label: "すくない" }
];

export function App() {
  const [sessionState, setSessionState] = useState<SessionState>("setup");
  const [mode, setMode] = useState<PracticeMode>("addition");
  const [supportLevel, setSupportLevel] = useState<SupportLevel>("full");
  const [questionCount, setQuestionCount] = useState(5);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [problemIndex, setProblemIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [mistakes, setMistakes] = useState<Record<string, number>>({});
  const [hint, setHint] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [completedProblems, setCompletedProblems] = useState(0);

  const problem = problems[problemIndex];
  const steps = useMemo(
    () => (problem ? buildProblemSteps(problem, ACTIVE_STAGE) : []),
    [problem]
  );
  const currentStep = steps[stepIndex];
  const problemCompleted = Boolean(problem) && stepIndex >= steps.length;
  const displayedAnswers = {
    ...answers,
    ...(currentStep?.knownAnswers ?? {})
  };

  function startSession() {
    const nextProblems = Array.from({ length: questionCount }, () =>
      generateProblem(mode)
    );

    setProblems(nextProblems);
    setProblemIndex(0);
    resetProblemState();
    setCompletedProblems(0);
    setSessionState("practice");
  }

  function handleAnswer(value: number) {
    if (!problem || !currentStep || problemCompleted) {
      return;
    }

    const mistakeCount = mistakes[currentStep.id] ?? 0;
    const result = evaluateAnswer(problem, currentStep, value, mistakeCount);

    if (result.correct) {
      setAnswers((previous) => ({ ...previous, [currentStep.id]: value }));
      setHint("");
      setFeedback("correct");
      playFeedbackSound("correct");
      window.setTimeout(() => {
        setFeedback(null);
        setStepIndex((previous) => previous + 1);
      }, 650);
      return;
    }

    setMistakes((previous) => ({
      ...previous,
      [currentStep.id]: mistakeCount + 1
    }));
    setHint(result.hint);
    setFeedback("incorrect");
    playFeedbackSound("incorrect");
    window.setTimeout(() => setFeedback(null), 650);
  }

  function goToNextProblem() {
    const nextCompleted = completedProblems + 1;
    setCompletedProblems(nextCompleted);

    if (problemIndex + 1 >= problems.length) {
      setSessionState("result");
      return;
    }

    setProblemIndex((previous) => previous + 1);
    resetProblemState();
  }

  function resetProblemState() {
    setStepIndex(0);
    setAnswers({});
    setMistakes({});
    setHint("");
    setFeedback(null);
  }

  function backToSetup() {
    setSessionState("setup");
    setProblems([]);
    setProblemIndex(0);
    resetProblemState();
    setCompletedProblems(0);
  }

  if (sessionState === "setup") {
    return (
      <SetupScreen
        mode={mode}
        questionCount={questionCount}
        questionCountOptions={QUESTION_COUNT_OPTIONS}
        supportLevel={supportLevel}
        supportOptions={SUPPORT_OPTIONS}
        onModeChange={setMode}
        onQuestionCountChange={setQuestionCount}
        onSupportLevelChange={setSupportLevel}
        onStart={startSession}
      />
    );
  }

  if (sessionState === "result") {
    return (
      <ResultScreen
        completedProblems={completedProblems}
        onRestart={startSession}
        onBackToSetup={backToSetup}
      />
    );
  }

  if (!problem) {
    return null;
  }

  return (
    <PracticeScreen
      problem={problem}
      currentStep={currentStep}
      stage={ACTIVE_STAGE}
      supportLevel={supportLevel}
      displayedAnswers={displayedAnswers}
      feedback={feedback}
      hint={hint}
      problemCompleted={problemCompleted}
      problemIndex={problemIndex}
      problemCount={problems.length}
      stepIndex={stepIndex}
      stepCount={steps.length}
      onAnswer={handleAnswer}
      onNextProblem={goToNextProblem}
    />
  );
}
