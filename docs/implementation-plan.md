# 実装計画

## フェーズ0: リポジトリ準備

- ローカルディレクトリを作成する
- Gitを初期化する
- READMEと設計ドキュメントを作成する
- GitHubリポジトリは後でユーザーに用意を依頼する

## フェーズ1: 学習ロジック

- 型定義
- 足し算問題生成
- 引き算問題生成
- 混合モードの問題選択
- 学習段階ごとのステップ生成
- 正誤判定
- 誤答分類
- ヒント生成
- 単体テスト

## フェーズ2: 最小UI

- ホーム画面
- 出題モード選択
- 問題数選択
- 段階選択
- 問題練習画面
- 数字ボタン
- さくらんぼ図

現状では、出題モード、問題数、段階1から3の選択、問題練習画面まで実装済み。

## フェーズ3: フィードバック

- 正解時の○印表示
- 不正解時の×印表示
- Web Audio APIによる短い効果音
- ヒント表示
- 答えを表示しない再回答フロー

## フェーズ4: セッション管理

- 指定問題数の出題
- 次の問題への遷移
- 終了画面
- セッション内の正解数表示

## フェーズ5: 表示改善

- タブレット向けレイアウト調整
- ボタンサイズ調整
- さくらんぼ図の視認性改善
- 10のまとまりの強調表示

## フェーズ6: 将来拡張

- 10フレーム表示
- ドラッグ操作
- 引き算方式切り替え
- 暗算モード
- ローカル成績保存
- Fire HD向けオフラインAPK化

## 推奨ディレクトリ構成

```txt
src/
  domain/
    problemTypes.ts
    strategies.ts
    stages.ts
  logic/
    generateAdditionProblem.ts
    generateSubtractionProblem.ts
    buildProblemSteps.ts
    evaluateAnswer.ts
    classifyError.ts
    generateHint.ts
  ui/
    components/
      CherryDiagram.tsx
      NumberButtons.tsx
      ProblemExpression.tsx
      HintBox.tsx
      FeedbackMark.tsx
      TenFrame.tsx
    screens/
      HomeScreen.tsx
      SetupScreen.tsx
      StageSelectScreen.tsx
      PracticeScreen.tsx
      ResultScreen.tsx
  audio/
    feedbackSound.ts
  tests/
```

現状の実装では、`App.tsx` はセッション状態の管理に集中し、表示は `ui/screens/` と `ui/components/` に分割している。

```txt
src/ui/
  App.tsx
  practiceDisplay.ts
  components/
    CherryDiagram.tsx
    EquationPanel.tsx
    NumberButtons.tsx
    RadioOption.tsx
  screens/
    SetupScreen.tsx
    PracticeScreen.tsx
    ResultScreen.tsx
```
