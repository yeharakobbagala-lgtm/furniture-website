import os
from PIL import Image
import numpy as np

folder = r'public/best sellers'
files = [f for f in os.listdir(folder) if f.endswith('.png')]

for f in sorted(files):
    path = os.path.join(folder, f)
    img = Image.open(path)
    w, h = img.size
    ratio = w / h
    # Sample non-transparent pixels
    arr = np.array(img)
    alpha = arr[:, :, 3] > 50
    rgb = arr[alpha][:, :3]
    avg_rgb = np.mean(rgb, axis=0) if len(rgb) > 0 else [0, 0, 0]
    print(f"File: {f}")
    print(f"  Dimensions: {w}x{h}, Aspect Ratio (w/h): {ratio:.2f}")
    print(f"  Avg RGB: R={avg_rgb[0]:.1f}, G={avg_rgb[1]:.1f}, B={avg_rgb[2]:.1f}")
