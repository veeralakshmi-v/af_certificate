import fitz
import cv2
import numpy as np

# Let's open the original PDF and render at 300 DPI
doc = fitz.open('af_intern_certificate.pdf')
page = doc[0]
pix = page.get_pixmap(dpi=300)
pix.save('page_orig_300.png')

# Load the image
img = cv2.imread('page_orig_300.png')
h, w, _ = img.shape
scale = h / 842.25

# The right box in PDF is at:
# Drawing / rect: Rect(293.09, 570.21, ...)
# Let's crop the exact right white panel inside the orange border
x1 = int(297 * scale)
y1 = int(468 * scale)
x2 = int(566 * scale)
y2 = int(818 * scale)

crop = img[y1:y2, x1:x2]
cv2.imwrite('public/right_panel_raw.png', crop)
print(f"Right panel cropped: {crop.shape}")

# Let's inspect the computer illustration inside the original crop
# In the original certificate, the right box has:
# 1. Orange quote text at top
# 2. Black address text at bottom
# 3. A grey line-art computer sketch watermark in the middle / background.
# Let's see what the sketch looks like.
