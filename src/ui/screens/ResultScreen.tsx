type ResultScreenProps = {
  completedProblems: number;
  onRestart: () => void;
  onBackToSetup: () => void;
};

export function ResultScreen({
  completedProblems,
  onRestart,
  onBackToSetup
}: ResultScreenProps) {
  return (
    <main className="app-shell">
      <section className="practice-surface result-surface" aria-label="練習結果">
        <p className="mode-label">おしまい</p>
        <h1>{completedProblems}もん</h1>
        <p className="result-message">さいごまでできました。</p>
        <div className="complete-actions">
          <button className="primary-action" type="button" onClick={onRestart}>
            もういちど
          </button>
          <button className="secondary-action" type="button" onClick={onBackToSetup}>
            せってい
          </button>
        </div>
      </section>
    </main>
  );
}
