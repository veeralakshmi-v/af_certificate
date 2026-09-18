import fitz
from PIL import Image, ImageDraw

doc = fitz.open('id_card.pdf')

# ----------------- PAGE 1 (FRONT) -----------------
p1 = doc[0]
pix1 = p1.get_pixmap(dpi=300)
img1 = Image.frombytes("RGB", [pix1.width, pix1.height], pix1.samples).convert("RGBA")
draw1 = ImageDraw.Draw(img1)

sx = pix1.width / p1.rect.width
sy = pix1.height / p1.rect.height

# 1. Erase Student Name "AARTHI R" (bbox: [49.08, 59.33, 92.5, 70.06]) with black fill
draw1.rectangle([25 * sx, 55 * sy, 117 * sx, 74 * sy], fill=(0, 0, 0, 255))

# 2. Erase the student photo inside the circular ring (center: 70.81, 115.08, r: 37.24)
cx = 70.81 * sx
cy = 115.08 * sy
r = 35.5 * sx # inside the gold ring border
draw1.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(15, 23, 42, 255))

# 3. Erase the course text "TALLY" inside the white hexagon badge (bbox: [59.45, 160.76, 83.09, 169.78])
# The white ribbon badge is filled with pure white
draw1.rectangle([45 * sx, 157 * sy, 97 * sx, 173 * sy], fill=(255, 255, 255, 255))

# 4. Erase the contact phone number "7 3 9 7 1 6 5 1 9 5" (bbox: [66.34, 191.0, 110.66, 199.14])
draw1.rectangle([64 * sx, 188 * sy, 118 * sx, 202 * sy], fill=(0, 0, 0, 255))

img1.save('public/id_card_assets/front_clean_base.png', 'PNG')
print("Saved front_clean_base.png successfully!")


# ----------------- PAGE 2 (BACK) -----------------
p2 = doc[1]
pix2 = p2.get_pixmap(dpi=300)
img2 = Image.frombytes("RGB", [pix2.width, pix2.height], pix2.samples).convert("RGBA")
draw2 = ImageDraw.Draw(img2)

sx2 = pix2.width / p2.rect.width
sy2 = pix2.height / p2.rect.height

# Dynamic values on Back:
# 1. Phone number value "9384266256" (bbox: [53.18, 119.69, 90.68, 127.84])
draw2.rectangle([51 * sx2, 116 * sy2, 125 * sx2, 129 * sy2], fill=(0, 0, 0, 255))

# 2. DOB value "03/20/2002" (bbox: [50.34, 130.17, 86.41, 138.32])
draw2.rectangle([48 * sx2, 127 * sy2, 125 * sx2, 140 * sy2], fill=(0, 0, 0, 255))

# 3. Blood Group value "B+ve" (bbox: [72.39, 142.2, 86.95, 150.35])
draw2.rectangle([70 * sx2, 139 * sy2, 125 * sx2, 152 * sy2], fill=(0, 0, 0, 255))

# 4. Address value "6380245526" (bbox: [59.2, 154.95, 96.77, 163.11])
draw2.rectangle([56 * sx2, 151 * sy2, 130 * sx2, 165 * sy2], fill=(0, 0, 0, 255))

img2.save('public/id_card_assets/back_clean_base.png', 'PNG')
print("Saved back_clean_base.png successfully!")
