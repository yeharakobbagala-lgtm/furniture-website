import os
from PIL import Image

folder = r'public/best sellers'
out_dir = r'scratch/bestseller_thumbnails'
os.makedirs(out_dir, exist_ok=True)

files = [f for f in os.listdir(folder) if f.endswith('.png')]

for f in sorted(files):
    path = os.path.join(folder, f)
    img = Image.open(path)
    # Thumbnail onto white/sage background so we can see
    thumb = img.copy()
    thumb.thumbnail((300, 300))
    # Composite over white
    bg = Image.new('RGB', thumb.size, (255, 255, 255))
    bg.paste(thumb, (0, 0), thumb)
    bg.save(os.path.join(out_dir, f.replace('.png', '.jpg')))
    print(f"Saved thumbnail for {f}")
