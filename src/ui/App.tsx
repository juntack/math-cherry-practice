import { useMemo, useState } from "react";
import type { ProblemStep } from "../domain/problemTypes";
import { playFeedbackSound } from "../audio/feedbackSound";
import { buildStepByStepAdditionSteps } from "../logic/buildProblemSteps";
import { createFixedAdditionProblem } from "../logic/createFixedAdditionProblem";
import { evaluateAnswer } from "../logic/evaluateAnswer";
import { CherryDiagram } from "./components/CherryDiagram";
import { NumberButtons } from "./components/NumberButtons";

type Feedback = "correct" | "incorrect" | null;

export function App() {
  const problem = useMemo(() => createFixedAdditionProblem(), []);
  const steps = useMemo(() => buildStepByStepAdditionSteps(problem), [problem]);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [mistakes, setMistakes] = useState<Record<string, number>>({});
  const [hint, setHint] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);

  const currentStep = steps[stepIndex];
  const completed = stepIndex >= steps.length;

  function handleAnswer(value: number) {
    if (!currentStep || completed) {
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

  function restart() {
    setStepIndex(0);
    setAnswers({});
    setMistakes({});
    setHint("");
    setFeedback(null);
  }

  return (
    <main className="app-shell">
      <section className="practice-surface" aria-label="さくらんぼ計算の練習">
        <header className="practice-header">
          <div>
            <p className="mode-label">たしざん・さくらんぼ計算</p>
            <h1>
              {problem.left} + {problem.right}
            </h1>
          </div>
          <div className="step-pill">
            {completed ? "できあがり" : `${stepIndex + 1} / ${steps.length}`}
          </div>
        </header>

        <div className="work-area">
          <CherryDiagram
            parent={problem.strategy.addend}
            leftValue={answers["needed-to-ten"]}
            rightValue={answers.remainder}
            activeTarget={currentStep?.visualTarget}
          />

          <EquationPanel
            currentStep={currentStep}
            completed={completed}
            neededToTen={answers["needed-to-ten"]}
            remainder={answers.remainder}
            answer={answers["final-answer"]}
          />
        </div>

        <div className="prompt-row">
          {completed ? (
            <p>8 + 7 = 15。10のまとまりを作れました。</p>
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

        {completed ? (
          <div className="complete-actions">
            <button className="primary-action" type="button" onClick={restart}>
              もういちど
            </button>
          </div>
        ) : (
          <NumberButtons max={15} onSelect={handleAnswer} />
        )}
      </section>
    </main>
  );
}

type EquationPanelProps = {
  currentStep?: ProblemStep;
  completed: boolean;
  neededToTen?: number;
  remainder?: number;
  answer?: number;
};

function EquationPanel({
  currentStep,
  completed,
  neededToTen,
  remainder,
  answer
}: EquationPanelProps) {
  return (
    <div className="equation-panel" aria-label="途中計算">
      <div className="equation-line">
        8 + {neededToTen ?? "□"} = {neededToTen === 2 ? 10 : "□"}
      </div>
      <div className="equation-line">
        10 + {remainder ?? "□"} = {answer ?? "□"}
      </div>
      <div className="equation-note">
        {completed
          ? "10と5をあわせて15"
          : currentStep?.id === "final-answer"
            ? "さいごの答えをえらぼう"
            : "まず10のまとまりを作ろう"}
      </div>
    </div>
  );
}
