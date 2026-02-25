# pptx Agent Skill セットアップレポート

> 作成日: 2026年2月25日

---

## 1. pptx スキルの概要

### 出典
- リポジトリ: [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/pptx)
- 作成: Anthropic
- ライセンス: Proprietary（Anthropic のサービス利用規約に準拠）

### 何ができるか

pptx スキルは、`.pptx` ファイルに関わるあらゆる操作をエージェントが正確かつ効率的に行えるようにするための Agent Skill です。以下のユースケースをカバーします。

| ユースケース | 概要 |
|------------|------|
| **コンテンツ読み取り** | `markitdown` を使って PPTX からテキストを抽出・解析する |
| **テンプレート編集** | 既存 PPTX を XML レベルで解凍・編集・再圧縮する |
| **スクラッチ作成** | `pptxgenjs` を使ってゼロからスライドデッキを生成する |
| **ビジュアル QA** | サムネイルグリッドや画像変換でスライドを目視検査する |

### 自動トリガー条件

以下のキーワードがチャットに登場すると、エージェントが自動的にこのスキルを読み込みます。

- "deck"、"slides"、"presentation" などの単語
- `.pptx` のファイル名への言及
- スライドの作成・読み込み・編集・変換に関する依頼

---

## 2. ファイル構造

セットアップ後のディレクトリ構造は以下の通りです。

```
.github/skills/pptx/
├── SKILL.md                          ← エージェントが読む主要指示ファイル
├── editing.md                        ← 既存 PPTX の編集ワークフロー詳細
├── pptxgenjs.md                      ← PptxGenJS でゼロから作る詳細手順
├── LICENSE.txt                       ← Anthropic プロプライエタリライセンス
└── scripts/
    ├── __init__.py
    ├── add_slide.py                  ← スライドの複製・レイアウトから作成
    ├── clean.py                      ← 孤立ファイル・未参照メディアの削除
    ├── thumbnail.py                  ← サムネイルグリッド画像の生成
    └── office/
        ├── pack.py                   ← XML ディレクトリ → PPTX 圧縮
        ├── soffice.py                ← LibreOffice (soffice) ラッパー
        ├── unpack.py                 ← PPTX → XML 展開・整形
        ├── validate.py               ← XSD スキーマ検証ツール
        ├── helpers/
        │   ├── __init__.py
        │   ├── merge_runs.py         ← 同一書式の連続 run を統合
        │   └── simplify_redlines.py  ← 変更履歴の整理
        ├── schemas/                  ← OOXML XSD スキーマ群
        │   ├── ecma/
        │   ├── ISO-IEC29500-4_2016/
        │   ├── mce/
        │   └── microsoft/
        └── validators/
            ├── __init__.py
            ├── base.py
            ├── docx.py
            ├── pptx.py               ← PPTX スキーマ検証ロジック
            └── redlining.py
```

---

## 3. SKILL.md の構成

スキルの主要指示ファイル `SKILL.md` は以下のセクションで構成されています。

### Quick Reference
3 つの主要タスクへの入口として機能します。

| タスク | 方法 |
|--------|------|
| 読み取り・解析 | `python -m markitdown presentation.pptx` |
| テンプレートから編集 | `editing.md` を参照 |
| ゼロから作成 | `pptxgenjs.md` を参照 |

### 編集ワークフロー（editing.md）
1. `thumbnail.py` でテンプレートを視覚分析
2. `unpack.py` で PPTX を XML 展開
3. スライド構造を操作（削除・複製・並び替え）
4. XML を直接編集してコンテンツを更新
5. `clean.py` で孤立ファイルを削除
6. `pack.py` で PPTX に再圧縮

### デザインガイドライン
カラーパレット・タイポグラフィ・レイアウト・よくある失敗など、高品質なスライドを作るための詳細なデザイン指針が組み込まれています。

### QA プロセス（必須）
1. コンテンツ QA: `markitdown` でテキストを確認
2. ビジュアル QA: スライドを画像化してサブエージェントに検査させる
3. 修正ループ: 少なくとも 1 回の「修正 → 再検証」サイクルを実施

---

## 4. セットアップ手順

### 実施内容

1. **リポジトリを sparse-checkout でクローン**
   ```powershell
   git clone --filter=blob:none --no-checkout --depth=1 `
     https://github.com/anthropics/skills.git _tmp_skills
   cd _tmp_skills
   git sparse-checkout init --cone
   git sparse-checkout set skills/pptx
   git checkout
   ```
   `skills/pptx` ディレクトリのみを取得し、不要なファイルのダウンロードを最小限に抑えました。

2. **`.github/skills/pptx/` に配置**
   ```powershell
   $src = "_tmp_skills\skills\pptx"
   $dst = ".github\skills\pptx"
   New-Item -ItemType Directory -Force -Path $dst
   Copy-Item -Recurse -Force "$src\*" "$dst\"
   ```

3. **一時ディレクトリを削除**
   ```powershell
   Remove-Item -Recurse -Force _tmp_skills
   ```

### VS Code でのスキル検索パス

VS Code は以下のパスを自動的にスキルの格納場所として認識します。

| 種別 | パス |
|------|------|
| プロジェクト用 | `.github/skills/`、`.claude/skills/`、`.agents/skills/` |
| 個人用（全プロジェクト） | `~/.copilot/skills/`、`~/.claude/skills/` |

---

## 5. 使い方

### GitHub Copilot (VS Code) での利用

#### スラッシュコマンドとして呼び出す
チャット入力欄で `/` を入力すると `pptx` スキルが一覧に表示されます。

```
/pptx プレゼンテーションを作成してください
```

#### 自動読み込み
以下のような依頼をするだけでエージェントが自動的にスキルを読み込みます。

```
Q4 の売上データを使ったスライドデッキを作ってください
presentation.pptx を読み取って内容をまとめてください
このテンプレートを編集して会社概要スライドに仕上げてください
```

#### 3 段階の読み込みメカニズム

エージェントはコンテキストを効率的に使うため、段階的にスキルを読み込みます。

| レベル | タイミング | 読み込む内容 |
|--------|----------|------------|
| Level 1 | 常時 | `name` と `description`（メタデータのみ） |
| Level 2 | タスク合致時 | `SKILL.md` の本文全体 |
| Level 3 | 必要に応じて | スクリプトファイル・サンプルリソース |

---

## 6. 必要な依存パッケージ

スキルのスクリプトを実際に動かすには以下のツールが必要です。

### Python パッケージ
```bash
pip install "markitdown[pptx]"   # テキスト抽出
pip install Pillow defusedxml     # サムネイル生成・XML 解析
```

### Node.js パッケージ
```bash
npm install -g pptxgenjs          # スクラッチからの PPTX 作成
npm install -g react-icons react react-dom sharp  # アイコン生成（オプション）
```

### システムツール
| ツール | 用途 | 備考 |
|--------|------|------|
| LibreOffice (`soffice`) | PPTX → PDF 変換 | ビジュアル QA に必要 |
| Poppler (`pdftoppm`) | PDF → 画像変換 | ビジュアル QA に必要 |

---

## 7. クリーンアップ

### 一時ディレクトリの削除

スキル取得に使用した一時ディレクトリがロック状態で残っている場合、VS Code の再起動後に以下のコマンドで削除してください。

```powershell
Remove-Item -Recurse -Force "C:\Users\yuyoshi\code\Agentへの指示\_tmp_skills"
```

### スキル自体を削除する場合

```powershell
Remove-Item -Recurse -Force ".github\skills\pptx"
```

---

## 8. 参考リンク

- [anthropics/skills - pptx](https://github.com/anthropics/skills/tree/main/skills/pptx)
- [VS Code: Use Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [Agent Skills 公式仕様 (agentskills.io)](https://agentskills.io/specification)
- [PptxGenJS ドキュメント](https://gitbrent.github.io/PptxGenJS/)
- [markitdown](https://github.com/microsoft/markitdown)
