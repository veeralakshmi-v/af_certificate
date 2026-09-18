import fitz
import cv2
import numpy as np

# Let's inspect the cropped right_panel_no_text.png
img = cv2.imread('public/right_panel_no_text.png', cv2.IMREAD_UNCHANGED)
print("Channels:", img.shape)

# Let's make sure the background (white/transparent) is pure transparent and the computer sketch lines are crisp:
# In img, if it's RGBA or RGB:
if img.shape[2] == 4:
    b, g, r, a = cv2.split(img)
else:
    b, g, r = cv2.split(img)
    a = np.full_like(b, 255)

# Computer lines are dark grey (low intensity). Background is white (high intensity, ~255).
# Let's compute alpha for pure transparency:
gray = cv2.cvtColor(cv2.merge([b, g, r]), cv2.COLOR_BGR2GRAY)

# Darker pixels = higher alpha (solid lines)
# Pure white (255) = 0 alpha (transparent)
new_alpha = np.zeros_like(gray, dtype=np.uint8)
mask = gray < 245
# Smooth line opacity
new_alpha[mask] = np.clip((255 - gray[mask].astype(float)) * 1.8, 0, 255).astype(np.uint8)

# Set line color to the exact grey #6B7280 (or #718096)
b_out = np.full_like(b, 0x71)
g_out = np.full_like(g, 0x80)
r_out = np.full_like(r, 0x96)

clean_rgba = cv2.merge([b_out, g_out, r_out, new_alpha])

# Crop just the bounding box of non-zero alpha (the computer, keyboard, mouse)
coords = cv2.findNonZero(new_alpha)
if coords is not None:
    x, y, w, h = cv2.boundingRect(coords)
    cropped_computer = clean_rgba[y:y+h, x:x+w]
    cv2.imwrite('public/asset_computer_only.png', cropped_computer)
    print(f"Saved perfectly clean bounding box computer sketch: {w}x{h} px with 0 text!")
else:
    print("Warning: No drawing lines found")
