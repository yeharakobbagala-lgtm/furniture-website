import numpy as np
from PIL import Image

# Read card 1 to inspect colors
img = Image.open('scratch/bestseller_analysis/card_1.jpg').convert('RGB')
arr = np.array(img)

# Background color at top left (say x=5, y=5)
bg_color = arr[5, 5]
print(f'Page background color: #{bg_color[0]:02x}{bg_color[1]:02x}{bg_color[2]:02x}')

# Card background color in center (say y=350, x=100)
card_color = arr[350, 100]
print(f'Card background color: #{card_color[0]:02x}{card_color[1]:02x}{card_color[2]:02x}')

# Button color (say y=365, x=100)
# Find the button in lower half
for y in range(300, 420, 5):
    row = arr[y, :, :]
    # look for very bright pixels (ivory button)
    bright_indices = np.where(np.all(row > [230, 230, 230], axis=1))[0]
    if len(bright_indices) > 50:
        btn_color = row[bright_indices[len(bright_indices)//2]]
        print(f'Button color at y={y}: #{btn_color[0]:02x}{btn_color[1]:02x}{btn_color[2]:02x}, width={len(bright_indices)}')
        break
