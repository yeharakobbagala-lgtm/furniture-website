from PIL import Image
import numpy as np

for f in ['00049294-5488-4fea-a262-18fbdb6c5d14.png', 'e64deb45-7038-4c2e-b81d-c0c31eac358e.png']:
    img = Image.open(f'public/best sellers/{f}')
    arr = np.array(img)
    # Check green pixels (for green cushions: G > R + 20 and G > B + 20)
    alpha = arr[:, :, 3] > 50
    rgb = arr[alpha]
    greenish = np.sum((rgb[:, 1] > rgb[:, 0] + 15) & (rgb[:, 1] > rgb[:, 2] + 15))
    print(f"{f}: greenish pixels count = {greenish}")
