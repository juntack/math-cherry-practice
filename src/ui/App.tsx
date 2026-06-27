import { useMemo, useState } from "react";
import type { PracticeMode, Problem, ProblemStep } from "../domain/problemTypes";
import { playFeedbackSound } from "../audio/feedbackSound";
import { buildProblemSteps } from "../logic/buildProblemSteps";
import { generateProblem } from "../logic/createProblem";
import { evaluateAnswer } from "../logic/evaluateAnswer";
import { CherryDiagram } from "./components/CherryDiagram";
import { NumberButtons } from "./components/NumberButtons";

type Feedback = "correct" | "incorrect" | null;
type SessionState = "setup" | "practice" | "result";

const QUESTION_COUNT_OPTIONS = [3, 5, 10];

export function App() {
  const [sessionState, setSessionState] = useState<SessionState>("setup");
  const [mode, setMode] = useState<PracticeMode>("addition");
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
  const steps = useMemo(() => (problem ? buildProblemSteps(problem) : []), [problem]);
  const currentStep = steps[stepIndex];
  const problemCompleted = Boolean(problem) && stepIndex >= steps.length;

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
      <main className="app-shell">
        <section className="practice-surface setup-surface" aria-label="練習の設定">
          <header className="practice-header">
            <div>
              <p className="mode-label">さくらんぼ計算</p>
              <h1>れんしゅう</h1>
            </div>
          </header>

          <div className="setup-panel">
            <fieldset>
              <legend>もんだい</legend>
              <RadioOption
                name="mode"
                value="addition"
                checked={mode === "addition"}
                onChange={() => setMode("addition")}
                label="たしざん"
              />
              <RadioOption
                name="mode"
                value="subtraction"
                checked={mode === "subtraction"}
                onChange={() => setMode("subtraction")}
                label="ひきざん"
              />
              <RadioOption
                name="mode"
                value="mixed"
                checked={mode === "mixed"}
                onChange={() => setMode("mixed")}
                label="まぜる"
              />
            </fieldset>

            <fieldset>
              <legend>なんもん</legend>
              {QUESTION_COUNT_OPTIONS.map((count) => (
                <RadioOption
                  key={count}
                  name="question-count"
                  value={String(count)}
                  checked={questionCount === count}
                  onChange={() => setQuestionCount(count)}
                  label={`${count}もん`}
                />
              ))}
            </fieldset>
          </div>

          <button className="primary-action" type="button" onClick={startSession}>
            はじめる
          </button>
        </section>
      </main>
    );
  }

  if (sessionState === "result") {
    return (
      <main className="app-shell">
        <section className="practice-surface result-surface" aria-label="練習結果">
          <p className="mode-label">おしまい</p>
          <h1>{completedProblems}もん</h1>
          <p className="result-message">さいごまでできました。</p>
          <div className="complete-actions">
            <button className="primary-action" type="button" onClick={startSession}>
              もういちど
            </button>
            <button className="secondary-action" type="button" onClick={backToSetup}>
              せってい
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (!problem) {
    return null;
  }

  return (
    <main className="app-shell">
      <section className="practice-surface" aria-label="さくらんぼ計算の練習">
        <header className="practice-header">
          <div>
            <p className="mode-label">{getModeLabel(problem.operation)}</p>
            <h1>
              {problem.left} {problem.operation === "addition" ? "+" : "-"}{" "}
              {problem.right}
            </h1>
          </div>
          <div className="progress-stack">
            <div className="step-pill">
              {problemCompleted ? "できた" : `${stepIndex + 1} / ${steps.length}`}
            </div>
            <div className="question-progress">
              {problemIndex + 1} / {problems.length} もん
            </div>
          </div>
        </header>

        <div className="work-area">
          <CherryDiagram
            parent={getCherryParent(problem)}
            leftValue={getCherryLeftValue(problem, answers)}
            rightValue={getCherryRightValue(problem, answers)}
            activeTarget={currentStep?.visualTarget}
          />

          <EquationPanel
            problem={problem}
            currentStep={currentStep}
            completed={problemCompleted}
            answers={answers}
          />
        </div>

        <div className="prompt-row">
          {problemCompleted ? (
            <p>
              {problem.left} {problem.operation === "addition" ? "+" : "-"}{" "}
              {problem.right} = {problem.answer}
            </p>
          ) : (
            <p>{currentStep.prompt}</p>
          )}
        </div>

        <div className="feedback-row" aria-live="polite">
          {feedback === "correct" && <div className="feedback correct">○</div>}
          {feedback === "incorrect" && <div className="feedback incorrect">×</div>}
          {!feedback && hint && <div className="hint-box">{hint}</div>}
          {!feedback && !hint && <div className="hint-placeholder"> </div>}
        </div>

        {problemCompleted ? (
          <div className="complete-actions">
            <button className="primary-action" type="button" onClick={goToNextProblem}>
              {problemIndex + 1 >= problems.length ? "おしまい" : "つぎへ"}
            </button>
          </div>
        ) : (
          <NumberButtons max={18} onSelect={handleAnswer} />
        )}
      </section>
    </main>
  );
}

type RadioOptionProps = {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: string;
};

function RadioOption({ name, value, checked, onChange, label }: RadioOptionProps) {
  return (
    <label className="radio-card">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <span>{label}</span>
    </label>
  );
}

type EquationPanelProps = {
  problem: Problem;
  currentStep?: ProblemStep;
  completed: boolean;
  answers: Record<string, number>;
};

function EquationPanel({
  problem,
  currentStep,
  completed,
  answers
}: EquationPanelProps) {
  if (problem.strategy.type === "subtraction_split_minuend") {
    const ones = answers["subtraction-ones"];
    const remaining = answers["subtract-from-ten"];
    const finalAnswer = answers["subtraction-final-answer"];

    return (
      <div className="equation-panel" aria-label="途中計算">
        <div className="equation-line">
          10 - {problem.strategy.subtrahend} = {remaining ?? "□"}
        </div>
        <div className="equation-line">
          {remaining ?? "□"} + {ones ?? "□"} = {finalAnswer ?? "□"}
        </div>
        <div className="equation-note">
          {completed
            ? `答えは${problem.answer}`
            : currentStep?.id === "subtraction-final-answer"
              ? "さいごの答えをえらぼう"
              : "10からひいて、のこりをあわせよう"}
        </div>
      </div>
    );
  }

  const neededToTen = answers["needed-to-ten"];
  const remainder = answers.remainder;
  const answer = answers["final-answer"];

  return (
    <div className="equation-panel" aria-label="途中計算">
      <div className="equation-line">
        {problem.strategy.base} + {neededToTen ?? "□"} ={" "}
        {neededToTen === problem.strategy.neededToTen ? 10 : "□"}
      </div>
      <div className="equation-line">
        10 + {remainder ?? "□"} = {answer ?? "□"}
      </div>
      <div className="equation-note">
        {completed
          ? `答えは${problem.answer}`
          : currentStep?.id === "final-answer"
            ? "さいごの答えをえらぼう"
            : "まず10のまとまりを作ろう"}
      </div>
    </div>
  );
}

function getModeLabel(operation: Problem["operation"]): string {
  return operation === "addition"
    ? "たしざん・さくらんぼ計算"
    : "ひきざん・さくらんぼ計算";
}

function getCherryParent(problem: Problem): number {
  return problem.strategy.type === "addition_make_ten"
    ? problem.strategy.addend
    : problem.strategy.minuend;
}

function getCherryLeftValue(
  problem: Problem,
  answers: Record<string, number>
): number | undefined {
  return problem.strategy.type === "addition_make_ten"
    ? answers["needed-to-ten"]
    : 10;
}

function getCherryRightValue(
  problem: Problem,
  answers: Record<string, number>
): number | undefined {
  return problem.strategy.type === "addition_make_ten"
    ? answers.remainder
    : answers["subtraction-ones"];
}
