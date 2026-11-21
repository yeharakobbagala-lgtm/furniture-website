import os
import re
import urllib.request
import io
from PIL import Image
from rembg import remove, new_session

session = new_session("u2netp")

with open("src/data/products.ts", "r", encoding="utf-8") as f:
    text = f.read()

prod_blocks = text.split('id: "prod-')[1:]
print(f"Found {len(prod_blocks)} prod blocks")

for b in prod_blocks:
    prod_id = "prod-" + b.split('"')[0]
    img_match = re.search(r"images:\s*\[\s*['\"]([^'\"]+)['\"]", b)
    if not img_match:
        continue
    img_url = img_match.group(1)
    out_path = f"public/furniture-cutouts/{prod_id}.png"
    if os.path.exists(out_path):
        print(f"Already exists: {prod_id}")
        continue
    print(f"Processing {prod_id} ...")
    try:
        req = urllib.request.Request(img_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
        im = Image.open(io.BytesIO(data)).convert("RGB")
        if max(im.size) > 800:
            scale = 800 / max(im.size)
            im = im.resize((int(im.width * scale), int(im.height * scale)), Image.Resampling.LANCZOS)
        out = remove(im, session=session)
        out.save(out_path, format="PNG")
        print(f"SUCCESS: Saved {out_path} ({out.size})")
    except Exception as e:
        print(f"FAIL {prod_id}: {e}")

print("All product cutouts ready!")
