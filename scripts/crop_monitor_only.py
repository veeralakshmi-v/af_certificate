import fitz
from PIL import Image

doc = fitz.open('af_intern_certificate.pdf')
page = doc[0]

# Render page at 300 DPI
pix = page.get_pixmap(dpi=300)
full_img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

scale = 300 / 72.0

# Crop only the computer monitor outline (x: 355 to 500, y: 500 to 615)
crop_monitor = full_img.crop((int(360 * scale), int(495 * scale), int(495 * scale), int(615 * scale)))

# Make white pixels transparent and remove orange text pixels
crop_rgba = crop_monitor.convert("RGBA")
datas = crop_rgba.getdata()
new_data = []

for item in datas:
    r, g, b, a = item
    # If it's orange text (high red, medium green, low blue like #EE831B)
    if r > 180 and g > 90 and b < 80:
        new_data.append((255, 255, 255, 0))
    # If it's white or near white background
    elif r > 230 and g > 230 and b > 230:
        new_data.append((255, 255, 255, 0))
    else:
        # Keep the subtle grey monitor lines
        new_data.append((r, g, b, 140))

crop_rgba.putdata(new_data)
crop_rgba.save('public/asset_computer_only.png')
print('Saved public/asset_computer_only.png cleanly!')
