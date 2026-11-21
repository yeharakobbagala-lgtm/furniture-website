import os
import cv2
import numpy as np
from PIL import Image

ref_path = r'C:/Users/Yehara Kobbagala/.gemini/antigravity/brain/f3990146-2095-4482-8d7b-4dfd429fe90d/.user_uploaded/media_1795191094418_3bca90e0.jpg'
orig_bgr = cv2.imread(ref_path)
orig_rgb = cv2.cvtColor(orig_bgr, cv2.COLOR_BGR2RGB)

os.makedirs('public/bestsellers', exist_ok=True)

# Function to create clean transparent cutout given bounding box in ref image
def extract_piece(name, bbox):
    x1, y1, x2, y2 = bbox
    crop_rgb = orig_rgb[y1:y2, x1:x2].copy()
    h, w = crop_rgb.shape[:2]
    
    # Color distance to sage background (around 225, 235, 225)
    sage_ref = np.array([227, 236, 225], dtype=np.float32)
    diff_sage = np.linalg.norm(crop_rgb.astype(np.float32) - sage_ref, axis=2)
    is_sage = diff_sage < 22.0
    
    # Color distance to card dark green (around 38, 63, 45)
    card_ref = np.array([38, 63, 45], dtype=np.float32)
    diff_card = np.linalg.norm(crop_rgb.astype(np.float32) - card_ref, axis=2)
    is_card = diff_card < 20.0
    
    # Initial alpha mask
    alpha = np.ones((h, w), dtype=np.uint8) * 255
    alpha[is_sage] = 0
    alpha[is_card] = 0
    
    # Find connected components of non-background
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats((alpha > 0).astype(np.uint8))
    
    # Keep components that are substantial
    clean_alpha = np.zeros((h, w), dtype=np.uint8)
    for i in range(1, num_labels):
        area = stats[i, cv2.CC_STAT_AREA]
        if area > 15: # keep even thin chair legs
            clean_alpha[labels == i] = 255
            
    # Slight edge antialiasing
    clean_alpha = cv2.GaussianBlur(clean_alpha, (3, 3), 0)
    
    rgba = np.dstack([crop_rgb, clean_alpha])
    pil_img = Image.fromarray(rgba)
    
    b = pil_img.getbbox()
    if b:
        # Add 2px margin
        b = (max(0, b[0] - 2), max(0, b[1] - 2), min(w, b[2] + 2), min(h, b[3] + 2))
        pil_img = pil_img.crop(b)
        
    out_path = os.path.join('public/bestsellers', name)
    pil_img.save(out_path, 'PNG')
    print(f"Extracted {name}: {pil_img.size}")

# Precise bounding boxes for each furniture piece
extract_piece("sofa-anna.png", (22, 65, 275, 235))
extract_piece("dining-table-walnut.png", (280, 35, 525, 235))
extract_piece("lounge-chair-avery.png", (550, 60, 755, 235))
extract_piece("dining-chair-lena.png", (810, 35, 965, 240))

print("Color-distance extraction done!")
