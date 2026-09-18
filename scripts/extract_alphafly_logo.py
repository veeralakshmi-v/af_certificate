import fitz
from PIL import Image

doc = fitz.open('af_intern_certificate.pdf')
page = doc[0]

# Render page at 300 DPI (scale = 300 / 72.0 = 4.1666667)
pix = page.get_pixmap(dpi=300)
full_img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

scale = 300 / 72.0

# 1. ALPHA FLY EDUCATION Logo Crop (x: 35 to 330, y: 70 to 116)
crop_logo = full_img.crop((int(35 * scale), int(70 * scale), int(330 * scale), int(116 * scale)))

# Make transparent
crop_rgba = crop_logo.convert("RGBA")
datas = crop_rgba.getdata()
new_data = []

for item in datas:
    r, g, b, a = item
    # If it's near white background, make transparent
    if r > 240 and g > 240 and b > 240:
        new_data.append((255, 255, 255, 0))
    else:
        new_data.append(item)

crop_rgba.putdata(new_data)
crop_rgba.save('public/alphafly_logo_exact.png')
print('Extracted public/alphafly_logo_exact.png successfully!')
