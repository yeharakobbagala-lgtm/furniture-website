import cv2
import numpy as np
from PIL import Image

ref_path = r'C:/Users/Yehara Kobbagala/.gemini/antigravity/brain/f3990146-2095-4482-8d7b-4dfd429fe90d/.user_uploaded/media_1795191094418_3bca90e0.jpg'
orig = cv2.imread(ref_path)

# Let's see card 4:
# x: 775 to 1015, y: 0 to 474
# Where is the chair exactly?
# Let's crop from y: 50 to 240, x: 810 to 980
chair4 = orig[50:240, 810:980]
cv2.imwrite('scratch/bestseller_analysis/lena_raw.png', chair4)
print('lena_raw saved, size:', chair4.shape)
