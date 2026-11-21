import os
from PIL import Image

ref_path = r'C:/Users/Yehara Kobbagala/.gemini/antigravity/brain/f3990146-2095-4482-8d7b-4dfd429fe90d/.user_uploaded/media_1795191094418_3bca90e0.jpg'
img = Image.open(ref_path)
w, h = img.size

os.makedirs('scratch/bestseller_analysis', exist_ok=True)

# The 4 cards roughly:
# Card 1: x 25 to 275 (w ~ 250)
# Card 2: x 285 to 535
# Card 3: x 540 to 780
# Card 4: x 785 to 1005
# Let's save crops of each card
c1 = img.crop((15, 0, 275, h))
c2 = img.crop((275, 0, 525, h))
c3 = img.crop((525, 0, 775, h))
c4 = img.crop((775, 0, 1015, h))

c1.save('scratch/bestseller_analysis/card_1.jpg')
c2.save('scratch/bestseller_analysis/card_2.jpg')
c3.save('scratch/bestseller_analysis/card_3.jpg')
c4.save('scratch/bestseller_analysis/card_4.jpg')

# Also crop just the furniture pieces
f1 = img.crop((20, 80, 275, 230))
f2 = img.crop((280, 50, 525, 235))
f3 = img.crop((555, 70, 755, 235))
f4 = img.crop((810, 55, 965, 240))

f1.save('scratch/bestseller_analysis/furn_1.jpg')
f2.save('scratch/bestseller_analysis/furn_2.jpg')
f3.save('scratch/bestseller_analysis/furn_3.jpg')
f4.save('scratch/bestseller_analysis/furn_4.jpg')

print('Saved card and furniture crops!')
