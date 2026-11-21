import os
from PIL import Image

folder = r'public/best sellers'
files = [f for f in os.listdir(folder) if f.endswith(('.png', '.jpg', '.jpeg', '.webp'))]

for f in sorted(files):
    path = os.path.join(folder, f)
    img = Image.open(path)
    bbox = img.getbbox() if img.mode == 'RGBA' else 'N/A'
    print(f"File: {f}")
    print(f"  Size: {img.size}, Mode: {img.mode}, Non-empty bbox: {bbox}")
