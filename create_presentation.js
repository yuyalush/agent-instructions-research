/**
 * research.md の内容を元に PPTX プレゼンテーションを生成するスクリプト
 * 実行: node create_presentation.js
 */

const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "GitHub Copilot";
pres.title = "AGENTS.md を活用したエージェント指示・スキル設定の手法まとめ";

// ─── カラーパレット（Teal Trust） ──────────────────────────────
const C = {
  teal:     "028090",
  seafoam:  "00A896",
  mint:     "02C39A",
  navy:     "0D2137",
  navyMid:  "163354",
  lightBg:  "F0F9FA",
  white:    "FFFFFF",
  textDark: "1A202C",
  textMid:  "334155",
  textMute: "64748B",
  accent:   "F97316",  // オレンジアクセント（強調用）
};

// ─── 共通フォント ────────────────────────────────────────────
const FONT_TITLE  = "Calibri";
const FONT_BODY   = "Calibri";
const W = 10;   // スライド幅 (inch)
const H = 5.625; // スライド高 (inch)

// ─── ヘルパー: アクセントバー（左縦線） ─────────────────────────
function addAccentBar(slide, color, x, y, h) {
  slide.addShape(pres.ShapeType.rect, {
    x, y, w: 0.07, h,
    fill: { color },
    line: { color, width: 0 },
  });
}

// ─── ヘルパー: セクション区切り背景（ダーク） ─────────────────────
function addDarkBg(slide) {
  slide.background = { color: C.navy };
}

// ─── ヘルパー: ライト背景 ────────────────────────────────────
function addLightBg(slide) {
  slide.background = { color: C.lightBg };
}

// ─── ヘルパー: カード（白い矩形） ────────────────────────────────
function addCard(slide, x, y, w, h, options = {}) {
  slide.addShape(pres.ShapeType.rect, {
    x, y, w, h,
    fill: { color: C.white },
    line: { color: "E2E8F0", width: 1 },
    shadow: { type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.08 },
    ...options,
  });
}

// ─── ヘルパー: ページ番号 ────────────────────────────────────
function addPageNum(slide, num, total, darkBg = false) {
  slide.addText(`${num} / ${total}`, {
    x: W - 1.0, y: H - 0.35, w: 0.8, h: 0.25,
    fontSize: 9, color: darkBg ? "607080" : C.textMute,
    align: "right", fontFace: FONT_BODY, margin: 0,
  });
}

const TOTAL = 12;

// ════════════════════════════════════════════════════════════════
// Slide 1: タイトル
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addDarkBg(s);

  // 左カラーバー
  s.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 0.18, h: H,
    fill: { color: C.teal },
    line: { color: C.teal, width: 0 },
  });

  // ミントのアクセントライン
  s.addShape(pres.ShapeType.rect, {
    x: 0.18, y: 0, w: 0.06, h: H,
    fill: { color: C.mint },
    line: { color: C.mint, width: 0 },
  });

  // メインタイトル
  s.addText("AGENTS.md を活用した\nエージェント指示・スキル設定", {
    x: 0.55, y: 1.05, w: 8.4, h: 1.8,
    fontFace: FONT_TITLE, fontSize: 34, bold: true,
    color: C.white, align: "left", margin: 0,
  });

  // サブタイトル
  s.addText("手法まとめ  ―  GitHub Copilot で試せる 6 つのアプローチ", {
    x: 0.55, y: 2.95, w: 8.4, h: 0.5,
    fontFace: FONT_BODY, fontSize: 15, color: C.seafoam,
    align: "left", margin: 0,
  });

  // 日付
  s.addText("2026年2月25日", {
    x: 0.55, y: 4.8, w: 3, h: 0.35,
    fontFace: FONT_BODY, fontSize: 11, color: "607080",
    align: "left", margin: 0,
  });

  addPageNum(s, 1, TOTAL, true);
}

// ════════════════════════════════════════════════════════════════
// Slide 2: AGENTS.md とは
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addLightBg(s);

  // ヘッダー帯
  s.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.75,
    fill: { color: C.navy }, line: { color: C.navy, width: 0 },
  });
  s.addText("AGENTS.md とは？", {
    x: 0.4, y: 0, w: 9, h: 0.75,
    fontFace: FONT_TITLE, fontSize: 20, bold: true,
    color: C.white, valign: "middle", margin: 0,
  });

  // 左カード：概要
  addCard(s, 0.3, 1.0, 4.3, 3.8);
  addAccentBar(s, C.teal, 0.3, 1.0, 3.8);
  s.addText("概要", {
    x: 0.55, y: 1.1, w: 3.9, h: 0.4,
    fontFace: FONT_TITLE, fontSize: 14, bold: true, color: C.teal, margin: 0,
  });
  s.addText([
    { text: "オープンフォーマット", options: { bullet: true, bold: true, breakLine: true } },
    { text: "AIコーディングエージェントにプロジェクト固有の\n文脈・指示を伝えるための標準仕様", options: { bullet: false, breakLine: true } },
    { text: "\n", options: {} },
    { text: "GitHub に 18,000+ スター", options: { bullet: true, bold: true, breakLine: true } },
    { text: "OpenAI の Romain Huet らが中心となって公開", options: { bullet: false, breakLine: true } },
    { text: "\n", options: {} },
    { text: "GitHub Copilot 公式サポート", options: { bullet: true, bold: true, breakLine: true } },
    { text: "VS Code でネイティブ対応済み", options: { bullet: false } },
  ], {
    x: 0.55, y: 1.6, w: 3.9, h: 3.0,
    fontFace: FONT_BODY, fontSize: 12, color: C.textDark,
    valign: "top", margin: 0,
  });

  // 右カード：サポートツール
  addCard(s, 5.1, 1.0, 4.5, 3.8);
  addAccentBar(s, C.seafoam, 5.1, 1.0, 3.8);
  s.addText("対応ツール", {
    x: 5.35, y: 1.1, w: 4.0, h: 0.4,
    fontFace: FONT_TITLE, fontSize: 14, bold: true, color: C.seafoam, margin: 0,
  });

  const tools = [
    "GitHub Copilot (VS Code)",
    "Claude Code",
    "Cursor",
    "Goose",
    "TRAE",
    "Spring AI",
    "Databricks",
    "その他多数",
  ];
  const toolItems = tools.map((t, i) => ({
    text: t,
    options: { bullet: true, breakLine: i < tools.length - 1 },
  }));
  s.addText(toolItems, {
    x: 5.35, y: 1.6, w: 4.0, h: 3.0,
    fontFace: FONT_BODY, fontSize: 12, color: C.textDark,
    valign: "top", margin: 0, lineSpacingMultiple: 1.4,
  });

  addPageNum(s, 2, TOTAL);
}

// ════════════════════════════════════════════════════════════════
// Slide 3: 6つの手法 比較表
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.75,
    fill: { color: C.navy }, line: { color: C.navy, width: 0 },
  });
  s.addText("6つの手法 — 比較一覧", {
    x: 0.4, y: 0, w: 9, h: 0.75,
    fontFace: FONT_TITLE, fontSize: 20, bold: true,
    color: C.white, valign: "middle", margin: 0,
  });

  const rows = [
    [
      { text: "手法", options: { bold: true, color: C.white, fill: { color: C.teal } } },
      { text: "適用タイミング", options: { bold: true, color: C.white, fill: { color: C.teal } } },
      { text: "他ツール互換", options: { bold: true, color: C.white, fill: { color: C.teal } } },
      { text: "ベストユースケース", options: { bold: true, color: C.white, fill: { color: C.teal } } },
    ],
    ["AGENTS.md",              "常時",                   "✔ 高い",      "マルチエージェント環境、モノレポ"],
    ["copilot-instructions.md","常時",                   "— Copilot専用","GitHub Copilot 単体利用"],
    ["*.instructions.md",      "ファイルパターン合致時",  "— VS Code/GitHub","言語別・フレームワーク別規約"],
    ["Agent Skills (SKILL.md)","タスク合致時（オンデマンド）","✔ 高い","専門ワークフロー、再利用可能な能力"],
    ["Prompt Files",           "手動呼び出し時",          "— VS Code専用","繰り返しタスクの自動化"],
    ["Custom Agents",          "エージェント選択時",      "— VS Code専用","役割別の専門エージェント"],
  ];

  s.addTable(rows, {
    x: 0.3, y: 0.9, w: 9.4, h: 4.3,
    fontSize: 11, fontFace: FONT_BODY, color: C.textDark,
    border: { pt: 0.5, color: "CBD5E1" },
    fill: { color: C.white },
    rowH: 0.62,
    align: "left",
    valign: "middle",
    colW: [2.2, 2.0, 1.5, 3.7],
  });

  addPageNum(s, 3, TOTAL);
}

// ════════════════════════════════════════════════════════════════
// Slide 4: 手法1 AGENTS.md
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addLightBg(s);

  // ヘッダー
  s.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.75,
    fill: { color: C.teal }, line: { color: C.teal, width: 0 },
  });
  s.addText("手法 1  |  AGENTS.md", {
    x: 0.4, y: 0, w: 9, h: 0.75,
    fontFace: FONT_TITLE, fontSize: 20, bold: true,
    color: C.white, valign: "middle", margin: 0,
  });

  // バッジ
  s.addShape(pres.ShapeType.rect, {
    x: 0.3, y: 0.9, w: 2.2, h: 0.38,
    fill: { color: C.mint }, line: { color: C.mint, width: 0 },
  });
  s.addText("オープン標準 / 複数エージェント対応", {
    x: 0.3, y: 0.9, w: 2.2, h: 0.38,
    fontFace: FONT_BODY, fontSize: 9.5, bold: true, color: C.navy,
    align: "center", valign: "middle", margin: 0,
  });

  // 左：概要
  addCard(s, 0.3, 1.45, 4.3, 3.5);
  addAccentBar(s, C.teal, 0.3, 1.45, 3.5);
  s.addText("概要・特徴", {
    x: 0.55, y: 1.55, w: 3.9, h: 0.38,
    fontFace: FONT_TITLE, fontSize: 13, bold: true, color: C.teal, margin: 0,
  });
  s.addText([
    { text: "リポジトリのルート・各サブディレクトリに配置", options: { bullet: true, breakLine: true } },
    { text: "「エージェント向け README」として機能", options: { bullet: true, breakLine: true } },
    { text: "サブディレクトリ別に異なる指示が可能（実験的）", options: { bullet: true, breakLine: true } },
    { text: "GitHub Copilot では chat.useAgentsMdFile 設定で有効化（デフォルト ON）", options: { bullet: true } },
  ], {
    x: 0.55, y: 2.0, w: 3.9, h: 2.7,
    fontFace: FONT_BODY, fontSize: 11.5, color: C.textDark,
    valign: "top", margin: 0, lineSpacingMultiple: 1.5,
  });

  // 右：セクション例
  addCard(s, 5.0, 1.45, 4.5, 3.5);
  addAccentBar(s, C.seafoam, 5.0, 1.45, 3.5);
  s.addText("典型的なセクション構成", {
    x: 5.25, y: 1.55, w: 4.0, h: 0.38,
    fontFace: FONT_TITLE, fontSize: 13, bold: true, color: C.seafoam, margin: 0,
  });
  s.addText([
    { text: "Dev environment tips", options: { bold: true, breakLine: true } },
    { text: "ビルド手順・開発ツールのヒント", options: { color: C.textMute, breakLine: true } },
    { text: "\n", options: {} },
    { text: "Testing instructions", options: { bold: true, breakLine: true } },
    { text: "CI設定・テスト実行コマンド", options: { color: C.textMute, breakLine: true } },
    { text: "\n", options: {} },
    { text: "PR instructions", options: { bold: true, breakLine: true } },
    { text: "コミット前チェック・PR タイトル規則", options: { color: C.textMute } },
  ], {
    x: 5.25, y: 2.0, w: 4.0, h: 2.7,
    fontFace: FONT_BODY, fontSize: 11.5, color: C.textDark,
    valign: "top", margin: 0,
  });

  addPageNum(s, 4, TOTAL);
}

// ════════════════════════════════════════════════════════════════
// Slide 5: 手法2 copilot-instructions.md
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.75,
    fill: { color: C.navyMid }, line: { color: C.navyMid, width: 0 },
  });
  s.addText("手法 2  |  copilot-instructions.md", {
    x: 0.4, y: 0, w: 9, h: 0.75,
    fontFace: FONT_TITLE, fontSize: 20, bold: true,
    color: C.white, valign: "middle", margin: 0,
  });

  s.addShape(pres.ShapeType.rect, {
    x: 0.3, y: 0.9, w: 1.9, h: 0.38,
    fill: { color: "FDE68A" }, line: { color: "FDE68A", width: 0 },
  });
  s.addText("GitHub Copilot 専用", {
    x: 0.3, y: 0.9, w: 1.9, h: 0.38,
    fontFace: FONT_BODY, fontSize: 9.5, bold: true, color: "78350F",
    align: "center", valign: "middle", margin: 0,
  });

  // ファイルパス表示
  s.addShape(pres.ShapeType.rect, {
    x: 0.3, y: 1.42, w: 9.3, h: 0.42,
    fill: { color: "1E293B" }, line: { color: "1E293B", width: 0 },
  });
  s.addText(".github/copilot-instructions.md", {
    x: 0.5, y: 1.42, w: 9.0, h: 0.42,
    fontFace: "Consolas", fontSize: 13, color: C.mint,
    valign: "middle", margin: 0,
  });

  // 3カード
  const cards = [
    { title: "用途", color: C.teal, items: ["コーディング規約・命名規則", "利用技術スタックの宣言", "アーキテクチャパターン", "セキュリティ要件・エラー処理"] },
    { title: "使い方", color: C.seafoam, items: ["① .github/ ディレクトリを作成", "② copilot-instructions.md を作成", "または /init コマンドで自動生成", "全チャットリクエストに自動適用"] },
    { title: "特徴", color: C.accent, items: ["VS Code / GitHub.com 両対応", "Organization レベルでも設定可", "他ツールには認識されない", "他の指示ファイルと組み合わせ可"] },
  ];

  cards.forEach((card, i) => {
    const x = 0.3 + i * 3.15;
    addCard(s, x, 2.0, 2.95, 3.2);
    s.addShape(pres.ShapeType.rect, {
      x, y: 2.0, w: 2.95, h: 0.45,
      fill: { color: card.color }, line: { color: card.color, width: 0 },
    });
    s.addText(card.title, {
      x: x + 0.1, y: 2.0, w: 2.75, h: 0.45,
      fontFace: FONT_TITLE, fontSize: 13, bold: true, color: C.white,
      valign: "middle", margin: 0,
    });
    const items = card.items.map((t, j) => ({
      text: t,
      options: { bullet: true, breakLine: j < card.items.length - 1 },
    }));
    s.addText(items, {
      x: x + 0.1, y: 2.55, w: 2.75, h: 2.55,
      fontFace: FONT_BODY, fontSize: 11, color: C.textDark,
      valign: "top", margin: 0, lineSpacingMultiple: 1.5,
    });
  });

  addPageNum(s, 5, TOTAL);
}

// ════════════════════════════════════════════════════════════════
// Slide 6: 手法3 *.instructions.md
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addLightBg(s);

  s.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.75,
    fill: { color: C.teal }, line: { color: C.teal, width: 0 },
  });
  s.addText("手法 3  |  *.instructions.md  ―  パス別指示ファイル", {
    x: 0.4, y: 0, w: 9, h: 0.75,
    fontFace: FONT_TITLE, fontSize: 18, bold: true,
    color: C.white, valign: "middle", margin: 0,
  });

  // 左：説明
  addCard(s, 0.3, 0.9, 4.0, 4.3);
  addAccentBar(s, C.teal, 0.3, 0.9, 4.3);
  s.addText("特徴", {
    x: 0.55, y: 1.0, w: 3.6, h: 0.38,
    fontFace: FONT_TITLE, fontSize: 13, bold: true, color: C.teal, margin: 0,
  });
  s.addText([
    { text: ".github/instructions/ 以下に配置", options: { bullet: true, breakLine: true } },
    { text: "glob パターンで適用範囲を指定", options: { bullet: true, breakLine: true } },
    { text: "手動添付も可能", options: { bullet: true, breakLine: true } },
  ], {
    x: 0.55, y: 1.45, w: 3.6, h: 1.4,
    fontFace: FONT_BODY, fontSize: 11.5, color: C.textDark,
    valign: "top", margin: 0, lineSpacingMultiple: 1.5,
  });
  s.addText("フロントマターのキー", {
    x: 0.55, y: 2.9, w: 3.6, h: 0.38,
    fontFace: FONT_TITLE, fontSize: 13, bold: true, color: C.teal, margin: 0,
  });

  const rows = [
    [
      { text: "キー", options: { bold: true, color: C.white, fill: { color: C.teal } } },
      { text: "説明", options: { bold: true, color: C.white, fill: { color: C.teal } } },
    ],
    ["name",        "UI 表示名"],
    ["description", "ホバー時に表示される説明"],
    ["applyTo",     "自動適用する glob パターン"],
  ];
  s.addTable(rows, {
    x: 0.55, y: 3.35, w: 3.5, h: 1.65,
    fontSize: 10.5, fontFace: FONT_BODY, color: C.textDark,
    border: { pt: 0.5, color: "CBD5E1" },
    fill: { color: C.white },
    rowH: 0.42,
    colW: [1.3, 2.2],
  });

  // 右：コード例
  addCard(s, 4.6, 0.9, 5.1, 4.3);
  s.addText("フォーマット例", {
    x: 4.85, y: 1.0, w: 4.6, h: 0.35,
    fontFace: FONT_TITLE, fontSize: 13, bold: true, color: C.navyMid, margin: 0,
  });
  // コードブロック背景
  s.addShape(pres.ShapeType.rect, {
    x: 4.75, y: 1.42, w: 4.85, h: 3.5,
    fill: { color: "1E293B" }, line: { color: "334155", width: 1 },
  });
  s.addText(
    "---\n" +
    "name: 'Python Standards'\n" +
    "description: 'Python の規約'\n" +
    "applyTo: '**/*.py'\n" +
    "---\n\n" +
    "# Python コーディング規約\n" +
    "- PEP 8 スタイルガイドに従う\n" +
    "- 全関数に型ヒントを付ける\n" +
    "- public 関数に docstring を書く",
    {
      x: 4.95, y: 1.55, w: 4.5, h: 3.2,
      fontFace: "Consolas", fontSize: 10.5, color: "A5F3FC",
      valign: "top", margin: 0,
    }
  );

  addPageNum(s, 6, TOTAL);
}

// ════════════════════════════════════════════════════════════════
// Slide 7: 手法4 Agent Skills
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.75,
    fill: { color: C.seafoam }, line: { color: C.seafoam, width: 0 },
  });
  s.addText("手法 4  |  Agent Skills （SKILL.md）", {
    x: 0.4, y: 0, w: 9, h: 0.75,
    fontFace: FONT_TITLE, fontSize: 20, bold: true,
    color: C.white, valign: "middle", margin: 0,
  });

  s.addShape(pres.ShapeType.rect, {
    x: 0.3, y: 0.87, w: 2.1, h: 0.38,
    fill: { color: C.mint }, line: { color: C.mint, width: 0 },
  });
  s.addText("オープン標準 (agentskills.io)", {
    x: 0.3, y: 0.87, w: 2.1, h: 0.38,
    fontFace: FONT_BODY, fontSize: 9.5, bold: true, color: C.navy,
    align: "center", valign: "middle", margin: 0,
  });

  // 構造図（左）
  addCard(s, 0.3, 1.4, 3.6, 3.8);
  s.addText("ディレクトリ構造", {
    x: 0.5, y: 1.5, w: 3.2, h: 0.38,
    fontFace: FONT_TITLE, fontSize: 13, bold: true, color: C.seafoam, margin: 0,
  });
  s.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 1.95, w: 3.4, h: 3.0,
    fill: { color: "1E293B" }, line: { color: "334155", width: 1 },
  });
  s.addText(
    ".github/skills/\n" +
    "└── pptx/\n" +
    "    ├── SKILL.md   ← 必須\n" +
    "    ├── editing.md\n" +
    "    ├── scripts/\n" +
    "    │   ├── pack.py\n" +
    "    │   └── unpack.py\n" +
    "    └── examples/",
    {
      x: 0.55, y: 2.05, w: 3.1, h: 2.75,
      fontFace: "Consolas", fontSize: 10, color: "A5F3FC",
      valign: "top", margin: 0,
    }
  );

  // 特徴（中央右）
  addCard(s, 4.1, 1.4, 2.5, 3.8);
  addAccentBar(s, C.seafoam, 4.1, 1.4, 3.8);
  s.addText("特徴", {
    x: 4.35, y: 1.5, w: 2.1, h: 0.38,
    fontFace: FONT_TITLE, fontSize: 13, bold: true, color: C.seafoam, margin: 0,
  });
  s.addText([
    { text: "指示＋スクリプト＋リソースを同梱", options: { bullet: true, breakLine: true } },
    { text: "タスク合致時にオンデマンドで読み込み", options: { bullet: true, breakLine: true } },
    { text: "VS Code / GitHub Copilot CLI / Coding Agent で共通利用", options: { bullet: true, breakLine: true } },
    { text: "スラッシュコマンドとしても呼び出し可", options: { bullet: true } },
  ], {
    x: 4.35, y: 1.95, w: 2.1, h: 3.0,
    fontFace: FONT_BODY, fontSize: 10.5, color: C.textDark,
    valign: "top", margin: 0, lineSpacingMultiple: 1.5,
  });

  // フォーマット（右）
  addCard(s, 6.85, 1.4, 2.8, 3.8);
  addAccentBar(s, C.teal, 6.85, 1.4, 3.8);
  s.addText("SKILL.md ヘッダー", {
    x: 7.1, y: 1.5, w: 2.4, h: 0.38,
    fontFace: FONT_TITLE, fontSize: 13, bold: true, color: C.teal, margin: 0,
  });
  s.addShape(pres.ShapeType.rect, {
    x: 6.95, y: 1.95, w: 2.6, h: 3.0,
    fill: { color: "1E293B" }, line: { color: "334155", width: 1 },
  });
  s.addText(
    "---\n" +
    "name: pptx\n" +
    "description: |\n" +
    "  .pptx ファイルに関わる\n" +
    "  すべての操作に使用\n" +
    "argument-hint:\n" +
    "  [file] [options]\n" +
    "user-invokable: true\n" +
    "---",
    {
      x: 7.05, y: 2.05, w: 2.4, h: 2.75,
      fontFace: "Consolas", fontSize: 9.5, color: "A5F3FC",
      valign: "top", margin: 0,
    }
  );

  addPageNum(s, 7, TOTAL);
}

// ════════════════════════════════════════════════════════════════
// Slide 8: 手法5 & 手法6
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addLightBg(s);

  s.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.75,
    fill: { color: C.navy }, line: { color: C.navy, width: 0 },
  });
  s.addText("手法 5 & 6  |  Prompt Files / Custom Agents", {
    x: 0.4, y: 0, w: 9, h: 0.75,
    fontFace: FONT_TITLE, fontSize: 20, bold: true,
    color: C.white, valign: "middle", margin: 0,
  });

  // 手法5
  addCard(s, 0.3, 0.9, 4.3, 4.3);
  s.addShape(pres.ShapeType.rect, {
    x: 0.3, y: 0.9, w: 4.3, h: 0.5,
    fill: { color: C.teal }, line: { color: C.teal, width: 0 },
  });
  s.addText("手法 5 — Prompt Files (プロンプトファイル)", {
    x: 0.45, y: 0.9, w: 4.0, h: 0.5,
    fontFace: FONT_TITLE, fontSize: 12.5, bold: true, color: C.white,
    valign: "middle", margin: 0,
  });
  s.addText([
    { text: "*.prompt.md として .github/instructions/ 以下に配置", options: { bullet: true, breakLine: true } },
    { text: "/コマンド名 でチャットから呼び出せるスラッシュコマンド", options: { bullet: true, breakLine: true } },
    { text: "繰り返しタスク（コンポーネント生成・PR 作成など）に最適", options: { bullet: true, breakLine: true } },
    { text: "VS Code 専用", options: { bullet: true } },
  ], {
    x: 0.5, y: 1.5, w: 3.9, h: 1.7,
    fontFace: FONT_BODY, fontSize: 11, color: C.textDark,
    valign: "top", margin: 0, lineSpacingMultiple: 1.5,
  });
  // コード例
  s.addText("例 / new-component", {
    x: 0.5, y: 3.25, w: 3.9, h: 0.3,
    fontFace: FONT_TITLE, fontSize: 11, bold: true, color: C.teal, margin: 0,
  });
  s.addShape(pres.ShapeType.rect, {
    x: 0.4, y: 3.6, w: 4.1, h: 1.3,
    fill: { color: "1E293B" }, line: { color: "334155", width: 1 },
  });
  s.addText(
    "---\nname: new-component\ndescription:\n  React コンポーネントの雛形生成\n---\n" +
    "TypeScript + Props 型定義 +\nStorybook を同時に作成",
    {
      x: 0.55, y: 3.65, w: 3.8, h: 1.15,
      fontFace: "Consolas", fontSize: 10, color: "A5F3FC",
      valign: "top", margin: 0,
    }
  );

  // 手法6
  addCard(s, 5.0, 0.9, 4.6, 4.3);
  s.addShape(pres.ShapeType.rect, {
    x: 5.0, y: 0.9, w: 4.6, h: 0.5,
    fill: { color: C.navyMid }, line: { color: C.navyMid, width: 0 },
  });
  s.addText("手法 6 — Custom Agents (カスタムエージェント)", {
    x: 5.15, y: 0.9, w: 4.3, h: 0.5,
    fontFace: FONT_TITLE, fontSize: 12.5, bold: true, color: C.white,
    valign: "middle", margin: 0,
  });
  s.addText([
    { text: "Markdown ファイルで定義する「専門特化型 AI ペルソナ」", options: { bullet: true, breakLine: true } },
    { text: "使用するツール・モデル・振る舞いを細かく制御", options: { bullet: true, breakLine: true } },
    { text: "サブエージェントとして他のエージェントから呼び出し可能", options: { bullet: true, breakLine: true } },
    { text: "DB 管理・フロントエンド開発・プランニングなど役割別に作成", options: { bullet: true } },
  ], {
    x: 5.2, y: 1.5, w: 4.2, h: 1.7,
    fontFace: FONT_BODY, fontSize: 11, color: C.textDark,
    valign: "top", margin: 0, lineSpacingMultiple: 1.5,
  });
  // 比較
  s.addText("Prompt Files vs Custom Agents", {
    x: 5.2, y: 3.25, w: 4.2, h: 0.3,
    fontFace: FONT_TITLE, fontSize: 11, bold: true, color: C.navyMid, margin: 0,
  });
  const cmpRows = [
    [
      { text: "", options: { fill: { color: C.navyMid } } },
      { text: "Prompt Files", options: { bold: true, color: C.white, fill: { color: C.navyMid } } },
      { text: "Custom Agents", options: { bold: true, color: C.white, fill: { color: C.navyMid } } },
    ],
    ["用途",   "単発タスク",   "複数ステップ"],
    ["呼び出し","/ コマンド",   "エージェント選択"],
    ["オーケストレーション", "なし", "サブエージェント可"],
  ];
  s.addTable(cmpRows, {
    x: 5.1, y: 3.6, w: 4.5, h: 1.6,
    fontSize: 10, fontFace: FONT_BODY, color: C.textDark,
    border: { pt: 0.5, color: "CBD5E1" },
    fill: { color: C.white },
    rowH: 0.4,
    colW: [1.7, 1.4, 1.4],
  });

  addPageNum(s, 8, TOTAL);
}

// ════════════════════════════════════════════════════════════════
// Slide 9: 推奨セットアップ手順
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addText("GitHub Copilot (VS Code) 推奨セットアップ手順", {
    x: 0.5, y: 0.25, w: 9, h: 0.6,
    fontFace: FONT_TITLE, fontSize: 20, bold: true,
    color: C.white, margin: 0,
  });

  // ステップ背景ライン
  s.addShape(pres.ShapeType.rect, {
    x: 1.7, y: 1.1, w: 0.06, h: 3.8,
    fill: { color: C.teal }, line: { color: C.teal, width: 0 },
  });

  const steps = [
    { num: "1", title: "基本設定",    color: C.mint,    y: 1.0,  body: "チャットで /init と入力 → ワークスペースを解析して\n.github/copilot-instructions.md を自動生成" },
    { num: "2", title: "ファイル別ルール追加", color: C.seafoam, y: 2.1, body: "*.instructions.md で言語・フレームワーク別の規約を追加\napplyTo: '**/*.py' のように glob で自動適用" },
    { num: "3", title: "タスク自動化", color: C.teal,   y: 3.2,  body: "Prompt Files でよく行う作業をスラッシュコマンド化\nMCP サーバーで外部サービス（Issue トラッカー等）と連携" },
    { num: "4", title: "スキル化",    color: C.accent,  y: 4.3,  body: "Agent Skills で専門ワークフローをパッケージ化\nチーム・組織間で再利用可能なスキルとして共有" },
  ];

  steps.forEach(({ num, title, color, y, body }) => {
    // 番号円
    s.addShape(pres.ShapeType.ellipse, {
      x: 1.3, y: y + 0.05, w: 0.5, h: 0.5,
      fill: { color }, line: { color, width: 0 },
    });
    s.addText(num, {
      x: 1.3, y: y + 0.05, w: 0.5, h: 0.5,
      fontFace: FONT_TITLE, fontSize: 14, bold: true, color: C.navy,
      align: "center", valign: "middle", margin: 0,
    });
    // テキスト
    s.addText(title, {
      x: 2.1, y: y, w: 7.5, h: 0.38,
      fontFace: FONT_TITLE, fontSize: 13.5, bold: true, color,
      margin: 0,
    });
    s.addText(body, {
      x: 2.1, y: y + 0.42, w: 7.5, h: 0.55,
      fontFace: FONT_BODY, fontSize: 11, color: "94A3B8",
      margin: 0,
    });
  });

  addPageNum(s, 9, TOTAL, true);
}

// ════════════════════════════════════════════════════════════════
// Slide 10: 効果的な指示の書き方のコツ
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  addLightBg(s);

  s.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.75,
    fill: { color: C.teal }, line: { color: C.teal, width: 0 },
  });
  s.addText("効果的な指示の書き方 — 5 つのコツ", {
    x: 0.4, y: 0, w: 9, h: 0.75,
    fontFace: FONT_TITLE, fontSize: 20, bold: true,
    color: C.white, valign: "middle", margin: 0,
  });

  const tips = [
    { num: "01", title: "短く・単一目的に",          body: "各指示は 1 つのシンプルな文にする。複数のルールは複数の指示に分割する。" },
    { num: "02", title: "理由を明記する",            body: "なぜか書くと AI がエッジケースで正しい判断をしやすい。\n例: 「date-fns を使うこと（moment.js は非推奨でバンドルサイズが増大するため）」" },
    { num: "03", title: "良い例・悪い例を示す",       body: "抽象的なルールより具体的なコード例の方が効果的。" },
    { num: "04", title: "当たり前のことは書かない",    body: "リンターやフォーマッターで自動強制できるルールは不要。非自明なプロジェクト固有情報を優先する。" },
    { num: "05", title: "プロジェクト固有情報を優先",  body: "AI が一般知識では知り得ないアーキテクチャ・ライブラリ選択・チームの慣習を重点的に記述する。" },
  ];

  tips.forEach(({ num, title, body }, i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const x = 0.25 + col * 3.25;
    const y = 0.95 + row * 2.3;
    const w = 3.1;
    const h = 2.1;
    addCard(s, x, y, w, h);
    // 番号
    s.addText(num, {
      x: x + 0.12, y: y + 0.12, w: 0.6, h: 0.45,
      fontFace: FONT_TITLE, fontSize: 20, bold: true, color: C.teal, margin: 0,
    });
    s.addText(title, {
      x: x + 0.12, y: y + 0.62, w: w - 0.24, h: 0.38,
      fontFace: FONT_TITLE, fontSize: 12, bold: true, color: C.textDark, margin: 0,
    });
    s.addText(body, {
      x: x + 0.12, y: y + 1.05, w: w - 0.24, h: 0.9,
      fontFace: FONT_BODY, fontSize: 10, color: C.textMid, margin: 0,
    });
  });

  // 5枚目のカード（row 1 の 3 列目は空）→ 4枚目を広めに（2行目あるのは 0,1 のみ）
  // 5th tip is at col=1, row=1 → x=3.5, y=3.25 (すでに上のループで処理済)

  addPageNum(s, 10, TOTAL);
}

// ════════════════════════════════════════════════════════════════
// Slide 11: まとめ
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.navyMid };

  s.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 0.18, h: H,
    fill: { color: C.mint }, line: { color: C.mint, width: 0 },
  });

  s.addText("まとめ", {
    x: 0.5, y: 0.35, w: 9, h: 0.55,
    fontFace: FONT_TITLE, fontSize: 24, bold: true, color: C.mint, margin: 0,
  });

  const summaryItems = [
    { label: "AGENTS.md / Agent Skills",      text: "他ツールと互換性が高いオープン標準。複数エージェント環境やチーム共有に最適。" },
    { label: "copilot-instructions.md",       text: "GitHub Copilot に特化した最もシンプルな方法。/init で即座に生成できる。" },
    { label: "*.instructions.md",             text: "ファイルタイプ・フレームワーク別に細かくルールを分けたい場合に有効。" },
    { label: "Prompt Files",                  text: "繰り返し作業をスラッシュコマンドに変換。チームの生産性向上に直結。" },
    { label: "Custom Agents",                 text: "複雑なマルチステップワークフローや役割分担型の開発に最適。" },
  ];

  summaryItems.forEach(({ label, text }, i) => {
    const y = 1.05 + i * 0.84;
    s.addShape(pres.ShapeType.rect, {
      x: 0.45, y, w: 0.06, h: 0.56,
      fill: { color: C.teal }, line: { color: C.teal, width: 0 },
    });
    s.addText(label, {
      x: 0.7, y: y + 0.02, w: 9.0, h: 0.28,
      fontFace: FONT_TITLE, fontSize: 12.5, bold: true, color: C.seafoam, margin: 0,
    });
    s.addText(text, {
      x: 0.7, y: y + 0.3, w: 9.0, h: 0.28,
      fontFace: FONT_BODY, fontSize: 11, color: "94A3B8", margin: 0,
    });
  });

  addPageNum(s, 11, TOTAL, true);
}

// ════════════════════════════════════════════════════════════════
// Slide 12: 参考リンク
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.75,
    fill: { color: C.teal }, line: { color: C.teal, width: 0 },
  });
  s.addText("参考リンク", {
    x: 0.4, y: 0, w: 9, h: 0.75,
    fontFace: FONT_TITLE, fontSize: 20, bold: true,
    color: C.white, valign: "middle", margin: 0,
  });

  const links = [
    { cat: "標準・仕様",    items: ["agents.md  ―  https://agents.md/", "agentskills.io  ―  https://agentskills.io/"] },
    { cat: "GitHub",       items: ["agentsmd/agents.md  ―  github.com/agentsmd/agents.md", "anthropics/skills  ―  github.com/anthropics/skills", "github/awesome-copilot  ―  github.com/github/awesome-copilot"] },
    { cat: "VS Code ドキュメント", items: ["Customize AI  ―  code.visualstudio.com/docs/copilot/copilot-customization", "Custom instructions  ―  .../customization/custom-instructions", "Agent Skills  ―  .../customization/agent-skills"] },
    { cat: "GitHub ドキュメント", items: ["Adding repository custom instructions  ―  docs.github.com"] },
  ];

  links.forEach(({ cat, items }, ci) => {
    const col = ci % 2;
    const row = Math.floor(ci / 2);
    const x = 0.3 + col * 4.9;
    const y = 0.95 + row * 2.2;
    addCard(s, x, y, 4.5, 2.0);
    s.addShape(pres.ShapeType.rect, {
      x, y, w: 4.5, h: 0.38,
      fill: { color: C.navyMid }, line: { color: C.navyMid, width: 0 },
    });
    s.addText(cat, {
      x: x + 0.1, y, w: 4.3, h: 0.38,
      fontFace: FONT_TITLE, fontSize: 12, bold: true, color: C.seafoam,
      valign: "middle", margin: 0,
    });
    const linkItems = items.map((t, j) => ({
      text: t,
      options: { bullet: true, breakLine: j < items.length - 1 },
    }));
    s.addText(linkItems, {
      x: x + 0.1, y: y + 0.45, w: 4.2, h: 1.45,
      fontFace: FONT_BODY, fontSize: 10, color: C.textDark,
      valign: "top", margin: 0, lineSpacingMultiple: 1.4,
    });
  });

  addPageNum(s, 12, TOTAL, true);
}

// ─── 書き出し ─────────────────────────────────────────────────
const outFile = "AGENTS_md_手法まとめ.pptx";
pres.writeFile({ fileName: outFile })
  .then(() => console.log(`✅ 作成完了: ${outFile}`))
  .catch((e) => { console.error("❌ エラー:", e); process.exit(1); });
