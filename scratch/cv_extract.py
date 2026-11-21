import os
import cv2
import numpy as np
from PIL import Image

os.makedirs('public/bestsellers', exist_ok=True)
ref_path = r'C:/Users/Yehara Kobbagala/.gemini/antigravity/brain/f3990146-2095-4482-8d7b-4dfd429fe90d/.user_uploaded/media_1795191094418_3bca90e0.jpg'
orig_bgr = cv2.imread(ref_path)

# Page background color is roughly (225, 235, 225) in RGB, or (225, 235, 225) in BGR
# Card background color is roughly (38, 63, 45) in RGB -> (45, 63, 38) in BGR

crops_data = [
    ("sofa-anna.png", (22, 50, 275, 240)),
    ("dining-table-walnut.png", (280, 25, 530, 240)),
    ("lounge-chair-avery.png", (545, 55, 765, 240)),
    ("dining-chair-lena.png", (800, 30, 975, 240)),
]

for name, (x1, y1, x2, y2) in crops_data:
    crop_bgr = orig_bgr[y1:y2, x1:x2].copy()
    h, w = crop_bgr.shape[:2]
    
    # Grabcut
    mask = np.zeros((h, w), np.uint8)
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)
    
    # Rect containing the object: slightly inset from edges
    rect = (3, 3, w - 6, h - 6)
    cv2.grabCut(crop_bgr, mask, rect, bgdModel, fgdModel, 5, cv2.GC_INIT_WITH_RECT)
    
    # Identify obvious background: top corners are definitely background
    # Colors near light sage: R > 210, G > 220, B > 210
    crop_rgb = cv2.cvtColor(crop_bgr, cv2.COLOR_BGR2RGB)
    sage_mask = (crop_rgb[:, :, 0] > 200) & (crop_rgb[:, :, 1] > 215) & (crop_rgb[:, :, 2] > 200)
    # Also dark green card area that is NOT furniture:
    card_green_mask = (crop_rgb[:, :, 0] < 55) & (crop_rgb[:, :, 1] > 45) & (crop_rgb[:, :, 1] < 85) & (crop_rgb[:, :, 2] < 60)
    
    # Combine mask
    final_mask = np.where((mask == 2) | (mask == 0), 0, 1).astype('uint8')
    final_mask[sage_mask] = 0
    
    # For bottom area where card green might have leaked into mask:
    # If the pixel is clearly card green, remove it
    final_mask[card_green_mask & (final_mask == 1)] = 0
    
    # Smooth edges slightly
    kernel = np.ones((3, 3), np.uint8)
    final_mask = cv2.morphologyEx(final_mask, cv2.MORPH_CLOSE, kernel)
    
    # Soft alpha
    alpha = (final_mask * 255).astype(np.uint8)
    alpha = cv2.GaussianBlur(alpha, (3, 3), 0)
    
    rgba = cv2.cvtColor(crop_bgr, cv2.COLOR_BGR2BGRA)
    rgba[:, :, 3] = alpha
    
    pil_img = Image.fromarray(cv2.cvtColor(rgba, cv2.COLOR_BGRA2RGBA))
    bbox = pil_img.getbbox()
    if bbox:
        pil_img = pil_img.crop(bbox)
        
    out_path = os.path.join('public/bestsellers', name)
    pil_img.save(out_path, 'PNG')
    print(f"Extracted {name}: {pil_img.size}")

print("All bestsellers extracted successfully!")
