import fitz
from PIL import Image, ImageDraw, ImageFont

doc = fitz.open('id_card.pdf')

# Page 1
p1 = doc[0]
pix1 = p1.get_pixmap(dpi=300)
ref_front = Image.frombytes("RGB", [pix1.width, pix1.height], pix1.samples)

# Page 2
p2 = doc[1]
pix2 = p2.get_pixmap(dpi=300)
ref_back = Image.frombytes("RGB", [pix2.width, pix2.height], pix2.samples)

# Save reference images
ref_front.save('public/id_card_assets/reference_front_exact.png')
ref_back.save('public/id_card_assets/reference_back_exact.png')

print("Reference images saved.")
