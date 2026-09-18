import fitz
import numpy as np
from PIL import Image

doc = fitz.open('id_card.pdf')

# 1. High-resolution render of page 1 and page 2 at 4x (approx 600 DPI)
p1 = doc[0]
p2 = doc[1]

# Render Page 1 (Front)
pix1 = p1.get_pixmap(dpi=300)
img1 = Image.frombytes("RGB", [pix1.width, pix1.height], pix1.samples)

# Render Page 2 (Back)
pix2 = p2.get_pixmap(dpi=300)
img2 = Image.frombytes("RGB", [pix2.width, pix2.height], pix2.samples)

# Save full reference renders
img1.save('public/id_card_assets/front_reference_300dpi.png')
img2.save('public/id_card_assets/back_reference_300dpi.png')

print(f"Front size: {img1.size}, Back size: {img2.size}")

# Let's create the Front Base without student photo and without text
# We can create an exact SVG or clean background for the front and back
