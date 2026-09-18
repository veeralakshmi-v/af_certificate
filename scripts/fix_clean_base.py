import fitz
import numpy as np
from PIL import Image, ImageDraw

doc = fitz.open('id_card.pdf')
p1 = doc[0]

# Render page 1 at 300 DPI
pix = p1.get_pixmap(dpi=300)
img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples).convert("RGBA")

sx = pix.width / p1.rect.width
sy = pix.height / p1.rect.height

# 1. Clean the Student Name "AARTHI R"
# bbox is (49.08, 59.33, 92.50, 70.06) pt
# In pt, top is ~58 pt, bottom is ~71 pt.
# Let's fill cleanly with pure black (#000000) from y=57pt to y=72pt, x=20pt to x=122pt
draw = ImageDraw.Draw(img)
draw.rectangle([20 * sx, 57 * sy, 122 * sx, 72 * sy], fill=(0, 0, 0, 255))

# 2. Clean the Student Photo inside the Circle:
# The gold circle is at center (70.807, 115.085), radius 37.24 pt.
# Outer border thickness is ~1.5 pt.
# Inside radius is 35.8 pt.
# Let's fill the inside of the circle with #000000 (black) or transparent
cx = 70.807 * sx
cy = 115.085 * sy
r_in = 35.8 * sx
draw.ellipse([cx - r_in, cy - r_in, cx + r_in, cy + r_in], fill=(0, 0, 0, 255))

# 3. Clean the text "TALLY" inside the Course Badge:
# The badge rectangle is: x from 21.15 to 120.32 pt, y from 152.70 to 180.36 pt.
# The inner white area of the badge is between y = 153.8 pt and y = 179.2 pt, and x between 30 pt and 112 pt!
# Let's fill the text region (x: 45 to 97 pt, y: 156 to 176 pt) with PURE WHITE (255, 255, 255) strictly bounded inside the badge!
# Notice: The top border of the badge is at y = 152.70 pt. So filling y from 154.5 pt to 178.0 pt stays strictly inside the white badge without spilling into the black background!
draw.rectangle([35 * sx, 154.5 * sy, 107 * sx, 178.5 * sy], fill=(255, 255, 255, 255))

# 4. Clean the contact number "7 3 9 7 1 6 5 1 9 5":
# bbox is (66.34, 191.00, 110.66, 199.14) pt
# Fill with pure black (#000000)
draw.rectangle([64 * sx, 189 * sy, 115 * sx, 201 * sy], fill=(0, 0, 0, 255))

img.save('public/id_card_assets/front_clean_base.png', 'PNG')
print("Successfully generated surgical-precision front_clean_base.png!")
