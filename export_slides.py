"""
PPTX の各スライドを PNG 画像として slides/ ディレクトリにエクスポートする。
PowerPoint COM オートメーションを使用。
"""
import os
import win32com.client
import time

PPTX_PATH = os.path.abspath("AGENTS_md_手法まとめ.pptx")
OUT_DIR    = os.path.abspath("slides")

os.makedirs(OUT_DIR, exist_ok=True)

print(f"Opening: {PPTX_PATH}")
ppt = win32com.client.Dispatch("PowerPoint.Application")
ppt.Visible = True   # ヘッドレス不可のため表示

prs = ppt.Presentations.Open(PPTX_PATH, ReadOnly=True, WithWindow=False)
time.sleep(1)

total = prs.Slides.Count
print(f"Slides: {total}")

for i in range(1, total + 1):
    out_path = os.path.join(OUT_DIR, f"slide_{i:02d}.png")
    prs.Slides(i).Export(out_path, "PNG", 1920, 1080)
    print(f"  Exported slide {i:02d} → {out_path}")

prs.Close()
ppt.Quit()
print("Done.")
