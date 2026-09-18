import cv2
import numpy as np

img = cv2.imread('public/right_panel_raw.png')
h, w, _ = img.shape
print(f"Loaded right panel: {w}x{h}")

# Let's inspect the middle section where the computer sketch is:
# In the original, the computer sketch is located between y = 20% and 80% of the box
# Let's extract the computer sketch by removing only the solid text (top orange quote and bottom black text)
# and keeping all sketch lines intact and crisp!

# Top text is at y < 0.28 * h
# Bottom text is at y > 0.65 * h
# The computer illustration is clearly visible in the middle!
sketch_crop = img[int(h*0.22):int(h*0.78), int(w*0.08):int(w*0.92)].copy()
sh, sw, _ = sketch_crop.shape

# Make white background transparent
# Let's calculate grayscale intensity
gray = cv2.cvtColor(sketch_crop, cv2.COLOR_BGR2GRAY)

# The background is white (255)
# Any sketch line or shadow has intensity < 250
# Let's create an alpha channel based on darkness:
# alpha = (255 - gray) scaled so faint sketch lines are clearly visible
alpha = np.zeros_like(gray, dtype=np.uint8)
mask = gray < 250
# Boost the sketch visibility so it's sharp and clean:
alpha[mask] = np.clip((255 - gray[mask].astype(float)) * 2.2, 0, 255).astype(np.uint8)

# Convert sketch_crop to RGBA
b, g, r = cv2.split(sketch_crop)
# Tint the sketch lines to a clean dark grey/graphite #4A5568
b_out = np.full_like(b, 0x4A)
g_out = np.full_like(g, 0x55)
r_out = np.full_like(r, 0x68)

rgba = cv2.merge([b_out, g_out, r_out, alpha])

cv2.imwrite('public/asset_computer_only.png', rgba)
print("Generated crisp public/asset_computer_only.png with proper visibility!")
