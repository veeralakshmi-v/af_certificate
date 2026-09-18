import cv2
import numpy as np

# Load right_box_crop.png
img = cv2.imread('right_box_crop.png')

# In right_box_crop, the computer is in the middle / bottom-middle.
# Let's inspect where the text vs computer is, and remove text.
# The quote "The best way to predict the future is to invent it." is orange #EE831B (BGR: ~27, 131, 238).
# The bottom address text is black.
# The computer sketch lines are faint grey/orange lines.

# Let's create a transparent PNG with just the clean computer sketch lines
h, w, _ = img.shape
# Orange border is at edges. Let's inside crop:
inner = img[int(h*0.05):int(h*0.95), int(w*0.05):int(w*0.95)]
ih, iw, _ = inner.shape

# The computer illustration is between y = 25% and 75% of height
comp_region = inner[int(ih*0.28):int(ih*0.72), int(iw*0.05):int(iw*0.95)]

# Convert to RGBA
# Let's find dark/sketch pixels that belong to the computer and make white transparent
gray = cv2.cvtColor(comp_region, cv2.COLOR_BGR2GRAY)
# Invert: white background (255) -> 0
alpha = 255 - gray
# Filter out pure white/very light background
alpha = np.where(alpha < 15, 0, alpha)

# Remove text areas:
# Top text (if any) and bottom text
# In comp_region, the computer is the monitor and keyboard sketch
rgba = cv2.cvtColor(comp_region, cv2.COLOR_BGR2BGRA)
rgba[:, :, 3] = alpha

# Also remove orange text pixels from the alpha if any remain
# Orange has high Red, medium Green, low Blue
b, g, r, a = cv2.split(rgba)
orange_mask = (r > 180) & (g > 80) & (b < 100) & (r - b > 80)
# Black text mask
black_mask = (r < 50) & (g < 50) & (b < 50) & (a > 50)

# Set alpha to 0 for text masks
rgba[orange_mask, 3] = 0
rgba[black_mask, 3] = 0

cv2.imwrite('public/asset_computer_only.png', rgba)
print("Saved ultra-clean public/asset_computer_only.png")
