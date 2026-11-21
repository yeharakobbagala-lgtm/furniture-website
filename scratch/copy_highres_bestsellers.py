import shutil
import os
from PIL import Image

src_dir = r'public/best sellers'
dst_dir = r'public/bestsellers'
os.makedirs(dst_dir, exist_ok=True)

mapping = {
    'e64deb45-7038-4c2e-b81d-c0c31eac358e.png': 'sofa-anna.png',
    'b40807dc-dcfa-4122-8474-622f2e4b2f99.png': 'dining-table-walnut.png',
    '8e21951c-ea20-44c2-b7c9-373bb64d161a.png': 'lounge-chair-avery.png',
    '5fda6cc6-cdd8-460c-92f2-594e193943e7.png': 'dining-chair-lena.png',
}

for src_name, dst_name in mapping.items():
    src_path = os.path.join(src_dir, src_name)
    dst_path = os.path.join(dst_dir, dst_name)
    shutil.copyfile(src_path, dst_path)
    # Also trim any extra empty transparent borders to ensure tight bounding box
    img = Image.open(dst_path)
    bbox = img.getbbox()
    if bbox:
        trimmed = img.crop(bbox)
        trimmed.save(dst_path, format="PNG")
        print(f"Copied & trimmed {dst_name}: {trimmed.size}")

print("High-res images copied to public/bestsellers successfully!")
