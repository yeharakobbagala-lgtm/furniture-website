import os
from PIL import Image
from rembg import remove

os.makedirs('public/bestsellers', exist_ok=True)
ref_path = r'C:/Users/Yehara Kobbagala/.gemini/antigravity/brain/f3990146-2095-4482-8d7b-4dfd429fe90d/.user_uploaded/media_1795191094418_3bca90e0.jpg'
img = Image.open(ref_path)
w, h = img.size

# The 4 cards coordinates in 1024x474:
# 1. Sofa: roughly x: 20 to 275, y: 50 to 240
# 2. Table: roughly x: 275 to 530, y: 35 to 240
# 3. Avery Chair: roughly x: 550 to 760, y: 55 to 240
# 4. Lena Chair: roughly x: 805 to 975, y: 40 to 245

crops = [
    ("sofa-anna.png", (15, 60, 275, 235)),
    ("dining-table-walnut.png", (280, 40, 525, 235)),
    ("lounge-chair-avery.png", (550, 60, 755, 235)),
    ("dining-chair-lena.png", (805, 40, 975, 240)),
]

for name, box in crops:
    cropped = img.crop(box)
    out_path = os.path.join('public/bestsellers', name)
    # Remove background with rembg
    result = remove(cropped)
    # Trim empty transparent padding
    bbox = result.getbbox()
    if bbox:
        result = result.crop(bbox)
    result.save(out_path, format="PNG")
    print(f"Saved {name}: size {result.size}")
