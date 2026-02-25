# Agent への指示 — 調査・実験プロジェクト

GitHub Copilot をはじめとする AI コーディングエージェントに対して、効果的に指示・知識・スキルを与える方法を調査・実験したプロジェクトです。

---

## 調査の目的

「AGENTS.md を使って AI エージェントへの指示をどう構造化するか」という問いを出発点に、以下を一貫して探求しました。

- AIエージェントへの指示方法にはどのような手法があるか
- 各手法の適用タイミング・互換性・ユースケースの違いは何か
- Anthropic が公開している **Agent Skills**（SKILL.md 標準）を実際にセットアップするとどうなるか
- 調査結果を PPTX プレゼンテーションとして出力できるか

---

## 成果物

| ファイル | 種別 | 概要 |
|---|---|---|
| [research.md](research.md) | 調査レポート | 6つのエージェント指示手法をまとめた Markdown レポート |
| [pptx_skill_report.md](pptx_skill_report.md) | セットアップレポート | pptx Agent Skill のセットアップ手順・使い方・クリーンアップをまとめたレポート |
| [AGENTS_md_手法まとめ.pptx](AGENTS_md_手法まとめ.pptx) | プレゼンテーション | research.md の内容を元に自動生成した 12 枚構成の PowerPoint スライド |
| [create_presentation.js](create_presentation.js) | ツール | PPTX を生成した pptxgenjs スクリプト |

---

## 調査内容の概要

`research.md` では以下の **6 つの手法** を調査・比較しています。

| # | 手法 | ファイル | 互換性 |
|---|------|---------|--------|
| 1 | **AGENTS.md** | `AGENTS.md` | 高（複数エージェント対応） |
| 2 | **copilot-instructions.md** | `.github/copilot-instructions.md` | GitHub Copilot 専用 |
| 3 | **\*.instructions.md** | `.github/instructions/*.instructions.md` | VS Code / GitHub |
| 4 | **Agent Skills (SKILL.md)** | `.github/skills/<name>/SKILL.md` | 高（オープン標準） |
| 5 | **Prompt Files** | `.github/instructions/*.prompt.md` | VS Code 専用 |
| 6 | **Custom Agents** | Markdown 定義ファイル | VS Code 専用 |

---

## ディレクトリ構造

```
Agentへの指示/
│
├── README.md                    ← このファイル
├── research.md                  ← 6つの手法の調査レポート
├── pptx_skill_report.md         ← pptx スキルのセットアップレポート
├── AGENTS_md_手法まとめ.pptx    ← 生成されたプレゼンテーション（12枚）
├── create_presentation.js       ← PPTX 生成スクリプト（pptxgenjs）
├── package.json                 ← Node.js プロジェクト定義
├── package-lock.json            ← 依存関係ロックファイル
│
├── node_modules/                ← npm 依存パッケージ（pptxgenjs など）
│
└── .github/
    └── skills/
        └── pptx/                ← Anthropic Agent Skill: pptx
            ├── SKILL.md         ← スキル定義（トリガー条件・使い方）
            ├── editing.md       ← PPTX 編集の詳細ガイド
            ├── pptxgenjs.md     ← pptxgenjs 利用ガイド
            ├── LICENSE.txt      ← MIT ライセンス
            └── scripts/
                ├── add_slide.py     ← スライド追加スクリプト
                ├── clean.py         ← 一時ファイルクリーンアップ
                ├── thumbnail.py     ← サムネイル生成
                └── office/
                    ├── pack.py      ← XML → .pptx パック
                    ├── unpack.py    ← .pptx → XML アンパック
                    ├── validate.py  ← バリデーション
                    ├── soffice.py   ← LibreOffice 連携
                    ├── helpers/     ← ユーティリティ関数群
                    ├── schemas/     ← PPTX XML スキーマ定義
                    └── validators/  ← バリデーター群
```

---

## プレゼンテーション（PPTX）の内容

`AGENTS_md_手法まとめ.pptx` は `research.md` の内容を元に **pptxgenjs** で自動生成しました。

| スライド | テーマ |
|---------|--------|
| 1 | タイトル |
| 2 | AGENTS.md とは？（概要・対応ツール 18,000+ stars） |
| 3 | 6つの手法 — 比較表 |
| 4 | 手法1: AGENTS.md |
| 5 | 手法2: copilot-instructions.md |
| 6 | 手法3: *.instructions.md |
| 7 | 手法4: Agent Skills（SKILL.md） |
| 8 | 手法5 & 6: Prompt Files / Custom Agents |
| 9 | 推奨セットアップ手順（4ステップ） |
| 10 | 効果的な指示の書き方（5つのコツ） |
| 11 | まとめ |
| 12 | 参考リンク |

---

## pptx Agent Skill について

`.github/skills/pptx/` は [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/pptx) から取得した Agent Skill です。  
GitHub Copilot（VS Code）が `.pptx` ファイルに関するタスクを検出したとき、このスキルが自動的に読み込まれ、スライド操作の詳細な手順とスクリプトが利用可能になります。

セットアップの詳細は [pptx_skill_report.md](pptx_skill_report.md) を参照してください。

---

## PPTX スクリプトの再実行

```bash
# 依存パッケージのインストール（初回のみ）
npm install

# PPTX の再生成
node create_presentation.js
```

---

## 参考リンク

- [agents.md 公式サイト](https://agents.md/)
- [agentskills.io](https://agentskills.io/)
- [agentsmd/agents.md (GitHub)](https://github.com/agentsmd/agents.md)
- [anthropics/skills (GitHub)](https://github.com/anthropics/skills)
- [VS Code — Copilot カスタマイズドキュメント](https://code.visualstudio.com/docs/copilot/copilot-customization)
- [GitHub Copilot カスタム指示ドキュメント](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot)
