# 実装計画

## フェーズ0: リポジトリ準備

- ローカルディレクトリを作成する
- Gitを初期化する
- READMEと設計ドキュメントを作成する
- GitHubリポジトリを設定する

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
- ヒントのりょう選択
- 問題練習画面
- 数字ボタン
- さくらんぼ図

現状では、出題モード、問題数、ヒントのりょう、問題練習画面まで実装済み。段階1から3のステップ生成ロジックは残しているが、画面上の段階選択は一旦非表示にし、段階3「途中計算」を固定で使う。

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

- 10フレームの本格表示
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
    FocusPanel.tsx
    NumberButtons.tsx
    RadioOption.tsx
    TenFrame.tsx
  screens/
    SetupScreen.tsx
    PracticeScreen.tsx
    ResultScreen.tsx
```

各 `ProblemStep` は `visualFocus` を持ち、現在の問いに対応する図だけを主表示する。これにより、例えば足し算の最初の「7を10にするには、あといくつ？」では10フレームを主表示し、次の「8を3といくつにわける？」ではさくらんぼ図を主表示する。

段階1「かずをわける」と段階2「10をつくる」は、実装ロジックとテストを残しているが、現在のUIでは選択肢として表示しない。復活する場合は `App.tsx` の固定 `ACTIVE_STAGE` を状態に戻し、`SetupScreen` に段階選択を再接続する。

補助量は `SupportLevel` として `full` / `medium` / `less` を持つ。`full` は現在の問いに合う図を主表示し、`medium` は10フレームを使う問いで小さい10フレームと式を並べ、`less` は式中心の表示に切り替える。将来さらに段階を増やす場合は、この型に値を追加し、`FocusPanel` の表示分岐を増やす。
