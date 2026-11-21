import os
import re
import urllib.request
import io
import sys
from PIL import Image
from rembg import remove, new_session

os.makedirs("public/furniture-cutouts", exist_ok=True)

# Use lightweight fast model u2netp (only 4.7MB vs 1GB default)
print("Initializing u2netp session...", flush=True)
session = new_session("u2netp")
print("u2netp session ready!", flush=True)

with open("src/data/products.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Find all products with id and first image
pattern = r"id:\s*['\"]([^'\"]+)['\"].*?images:\s*\[\s*['\"]([^'\"]+)['\"]"
matches = re.findall(pattern, content, re.DOTALL)

print(f"Found {len(matches)} products to process", flush=True)

for prod_id, img_url in matches:
    out_path = f"public/furniture-cutouts/{prod_id}.png"
    if os.path.exists(out_path):
        print(f"Skipping {prod_id}, already exists", flush=True)
        continue

    print(f"Processing {prod_id} ...", flush=True)
    try:
        req = urllib.request.Request(img_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            input_bytes = resp.read()

        input_img = Image.open(io.BytesIO(input_bytes)).convert("RGB")
        max_dim = 800
        if max(input_img.size) > max_dim:
            scale = max_dim / max(input_img.size)
            new_size = (int(input_img.width * scale), int(input_img.height * scale))
            input_img = input_img.resize(new_size, Image.Resampling.LANCZOS)

        output_img = remove(input_img, session=session)
        output_img.save(out_path, format="PNG")
        print(f"Successfully saved {out_path} ({output_img.size})", flush=True)
    except Exception as e:
        print(f"Error processing {prod_id}: {e}", flush=True)

print("Cutout generation completed!", flush=True)
