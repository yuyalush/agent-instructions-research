# AGENTS.md を活用したエージェント指示・スキル設定の手法まとめ

> 調査日: 2026年2月25日

---

## 概要

`AGENTS.md` は、AIコーディングエージェントにプロジェクト固有の文脈や指示を伝えるための**オープンフォーマット**です。OpenAI の Romain Huet らが中心となって [agentsmd/agents.md](https://github.com/agentsmd/agents.md) として公開し、現在 GitHub に **18,000以上のスター**を獲得している人気のフォーマットです。

GitHub Copilot (VS Code) もこのフォーマットを公式サポートしており、複数のエージェントツールで共通して使える仕組みとして注目されています。

---

## 手法1: AGENTS.md（汎用エージェント指示ファイル）

### 概要
- リポジトリのルートや各サブディレクトリに置く Markdown ファイル
- 複数のAIエージェントツールで認識される**オープン標準**
- 「エージェント向け README」として機能する

### サポートするツール
GitHub Copilot、Claude Code、Cursor、Goose、VS Code など多数

### 書き方の例

```markdown
# Dev environment tips
- `pnpm dlx turbo run where <project_name>` でパッケージに移動できる
- 依存追加は `pnpm install --filter <project_name>`

## Testing instructions
- CI設定は `.github/workflows` 以下を参照
- テスト実行: `pnpm turbo run test --filter <project_name>`
- コミット前に全テストがグリーンであること

## PR instructions
- タイトル形式: `[<project_name>] <タイトル>`
- コミット前に `pnpm lint` と `pnpm test` を必ず実行
```

### GitHub Copilot (VS Code) での使い方
1. リポジトリルートに `AGENTS.md` を作成
2. VS Code の設定 `chat.useAgentsMdFile` が有効になっていることを確認（デフォルト有効）
3. すべてのチャットリクエストに自動的に適用される

### サブディレクトリごとの指示（実験的機能）
- `frontend/AGENTS.md`、`backend/AGENTS.md` のように階層配置可能
- `chat.useNestedAgentsMdFiles` 設定を有効化することで対応
- ディレクトリツリーで最も近い `AGENTS.md` が優先される

---

## 手法2: copilot-instructions.md（GitHub Copilot 標準）

### 概要
- `.github/copilot-instructions.md` に置くリポジトリ全体向けの指示ファイル
- GitHub Copilot 専用（他エージェントには認識されない）
- VS Code の `/init` コマンドで自動生成も可能

### 書き方のポイント
```markdown
## コーディング規約
- TypeScript を使用し、`any` 型は避ける
- コンポーネントは関数コンポーネントで記述する
- `date-fns` を使用すること（moment.js は非推奨のため禁止）

## アーキテクチャ
- API 層は `/api` ディレクトリに集約
- 状態管理には Zustand を使用
```

### VS Code での使い方
1. `.github/copilot-instructions.md` を作成
2. もしくはチャットで `/init` と入力して自動生成

---

## 手法3: `*.instructions.md`（パス別指示ファイル）

### 概要
- `.github/instructions/` ディレクトリ以下に配置
- ファイルパスの glob パターンで適用範囲を指定できる
- 言語別・フレームワーク別に細かく指示を分けられる

### ファイルフォーマット
```markdown
---
name: 'Python Standards'
description: 'Pythonファイルのコーディング規約'
applyTo: '**/*.py'
---

# Python コーディング規約
- PEP 8 スタイルガイドに従う
- 全関数シグネチャに型ヒントを付ける
- パブリック関数にはdocstringを書く
```

### フロントマターのオプション

| キー | 必須 | 説明 |
|------|------|------|
| `name` | No | UI表示名 |
| `description` | No | ホバー時に表示される説明 |
| `applyTo` | No | 自動適用する glob パターン（例: `**/*.ts,**/*.tsx`） |

---

## 手法4: Agent Skills（スキルファイル）

### 概要
- Anthropic が開発し [agentskills.io](https://agentskills.io/) でオープン標準として公開
- VS Code、GitHub Copilot CLI、Copilot Coding Agent で共通利用可能
- 指示だけでなく**スクリプト・サンプルコード・リソースも同梱**できる
- タスクに応じてオンデマンドで読み込まれる（コンテキスト効率が高い）

### ディレクトリ構造
```
.github/skills/
└── webapp-testing/          # スキル名と一致させる
    ├── SKILL.md             # 必須
    ├── test-template.js     # 任意のリソース
    └── examples/            # サンプル集
```

### SKILL.md のフォーマット
```markdown
---
name: webapp-testing
description: Webアプリのテスト実行手順。E2Eテスト・ユニットテストの両方に対応。
argument-hint: [テスト対象ページ] [オプション]
user-invokable: true
disable-model-invocation: false
---

# Webアプリテストスキル

## テスト実行手順
1. `npm run test:e2e` でE2Eテストを実行
2. ...
```

### フロントマターのオプション

| キー | 必須 | 説明 |
|------|------|------|
| `name` | Yes | 一意の識別子（ディレクトリ名と一致が必須） |
| `description` | Yes | スキルの説明（AI がいつ使うか判断する） |
| `argument-hint` | No | スラッシュコマンド呼び出し時のヒント |
| `user-invokable` | No | `/ `メニューに表示するか（デフォルト: true） |
| `disable-model-invocation` | No | AI の自動呼び出しを禁止するか（デフォルト: false） |

### VS Code での使い方
1. `.github/skills/<スキル名>/SKILL.md` を作成
2. チャットで `/` を入力するとスキルが表示される
3. エージェントがタスクに合致すると自動的に読み込む

### スキルの格納場所

| 種類 | 場所 |
|------|------|
| プロジェクト用 | `.github/skills/`、`.claude/skills/`、`.agents/skills/` |
| 個人用（全プロジェクト共通） | `~/.copilot/skills/`、`~/.claude/skills/` |

---

## 手法5: Prompt Files（プロンプトファイル）

### 概要
- `.github/instructions/` 以下に `*.prompt.md` で作成
- チャットで `/コマンド名` として呼び出せる「スラッシュコマンド」
- よく行う繰り返しタスク（コンポーネント生成、PR作成など）に最適

### フォーマット例
```markdown
---
name: new-component
description: Reactコンポーネントの雛形を生成する
---

以下の要件で React コンポーネントを作成してください:
- TypeScript を使用
- Props の型定義を必ず記述
- Storybook 用の `*.stories.tsx` も同時に作成
```

---

## 手法6: Custom Agents（カスタムエージェント）

### 概要
- Markdown ファイルで定義する「専門特化型AIペルソナ」
- 使用するツール・モデル・振る舞いを細かく制御できる
- サブエージェントとして他のエージェントから呼び出すことも可能

---

## 各手法の比較と使い分け

| 手法 | 適用タイミング | 他ツール互換 | 内容 | ベストユースケース |
|------|--------------|------------|------|------------------|
| `AGENTS.md` | 常時 | ✅ 高い | コード・テキスト | マルチエージェント環境、モノレポ |
| `copilot-instructions.md` | 常時 | ❌ Copilot専用 | テキスト | GitHub Copilot 単体利用 |
| `*.instructions.md` | ファイルパターン合致時 | ❌ VS Code/GitHub | テキスト | 言語別・フレームワーク別規約 |
| Agent Skills (`SKILL.md`) | タスク合致時（オンデマンド） | ✅ 高い | テキスト+スクリプト+リソース | 専門ワークフロー、再利用可能な能力 |
| Prompt Files | 手動呼び出し時 | ❌ VS Code専用 | テキスト | 繰り返しタスクの自動化 |
| Custom Agents | エージェント選択時 | ❌ VS Code専用 | テキスト | 役割別の専門エージェント |

---

## GitHub Copilot (VS Code) での推奨セットアップ手順

公式ドキュメントが推奨するインクリメンタルな導入ステップ:

1. **基本設定**: チャットで `/init` と入力 → ワークスペースを解析して `.github/copilot-instructions.md` を自動生成
2. **ファイル別ルール追加**: `*.instructions.md` で言語・フレームワーク別の規約を追加
3. **タスク自動化**: Prompt Files でよく行う作業（コンポーネント生成、コードレビュー等）をスラッシュコマンド化
4. **スキル化**: Agent Skills で専門ワークフロー（デプロイ、テスト手順など）をパッケージ化

---

## 効果的な指示の書き方のコツ

1. **短く・単一目的に**: 各指示は一つのシンプルな文にする
2. **理由を明記する**: なぜそのルールが必要かを書くと、AIがエッジケースで正しい判断をしやすい
   - 例: "`date-fns` を使うこと（`moment.js` は非推奨でバンドルサイズが増大するため）"
3. **良い例・悪い例を示す**: 抽象的なルールより具体的なコード例の方が効果的
4. **当たり前のことは書かない**: リンターやフォーマッターで自動強制できるルールは不要
5. **プロジェクト固有の情報を優先**: AIが一般知識では知り得ないことを重点的に記述

---

## 参考リンク

- [AGENTS.md 公式サイト](https://agents.md/)
- [agentsmd/agents.md GitHub リポジトリ](https://github.com/agentsmd/agents.md)
- [Agent Skills 公式サイト（agentskills.io）](https://agentskills.io/)
- [VS Code: Customize AI in Visual Studio Code](https://code.visualstudio.com/docs/copilot/copilot-customization)
- [VS Code: Use custom instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [VS Code: Use Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [GitHub Docs: Adding repository custom instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot)
- [Awesome Copilot（コミュニティ事例集）](https://github.com/github/awesome-copilot)
- [anthropics/skills（公式スキルサンプル集）](https://github.com/anthropics/skills)
