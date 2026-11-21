from PIL import Image
import numpy as np

img = Image.open(r'C:/Users/Yehara Kobbagala/.gemini/antigravity/brain/f3990146-2095-4482-8d7b-4dfd429fe90d/.user_uploaded/media_1795192575873_2ee86ccf.jpg')
arr = np.array(img)

# Card 1 x range: ~25 to 275
# Find top of card 1 (where color turns dark green ~ [38, 63, 45])
# along x=100
for y in range(50, 300):
    p = arr[y, 100]
    # check if close to dark green [38, 63, 45]
    if p[0] < 50 and 50 < p[1] < 75 and p[2] < 55:
        print(f"Card 1 top edge at y={y}, color={p}")
        break

# Find bottom of card 1
for y in range(470, 300, -1):
    p = arr[y, 100]
    if p[0] < 50 and 50 < p[1] < 75 and p[2] < 55:
        print(f"Card 1 bottom edge at y={y}, color={p}")
        break

# Card 1 left and right
for x in range(10, 100):
    p = arr[300, x]
    if p[0] < 50 and 50 < p[1] < 75 and p[2] < 55:
        print(f"Card 1 left edge at x={x}")
        break

for x in range(280, 200, -1):
    p = arr[300, x]
    if p[0] < 50 and 50 < p[1] < 75 and p[2] < 55:
        print(f"Card 1 right edge at x={x}")
        break
