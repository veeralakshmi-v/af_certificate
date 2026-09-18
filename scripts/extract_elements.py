import fitz
from PIL import Image

doc = fitz.open('af_intern_certificate.pdf')
page = doc[0]

# Render page at high resolution (300 DPI)
pix = page.get_pixmap(dpi=300)
full_img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

scale = 300 / 72.0 # 4.166666666666667

# 1. ISO Badge (x: 420 to 475, y: 65 to 135)
crop_iso = full_img.crop((int(422 * scale), int(64 * scale), int(478 * scale), int(136 * scale)))
crop_iso.save('public/asset_iso_badge.png')
print('Saved asset_iso_badge.png')

# 2. Satheeshkumar Nagaraj Signature (x: 35 to 275, y: 265 to 345)
crop_sig = full_img.crop((int(35 * scale), int(265 * scale), int(275 * scale), int(345 * scale)))
crop_sig.save('public/asset_signature.png')
print('Saved asset_signature.png')

# 3. Best Student Stamp (x: 375 to 515, y: 275 to 395)
crop_stamp = full_img.crop((int(375 * scale), int(275 * scale), int(515 * scale), int(395 * scale)))
crop_stamp.save('public/asset_stamp.png')
print('Saved asset_stamp.png')

# 4. Computer illustration watermark (x: 340 to 520, y: 490 to 625)
crop_watermark = full_img.crop((int(340 * scale), int(490 * scale), int(520 * scale), int(625 * scale)))
crop_watermark.save('public/asset_watermark.png')
print('Saved asset_watermark.png')

print('All assets extracted!')
