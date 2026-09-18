from PIL import Image

def make_white_transparent(img_path, out_path, threshold=240):
    img = Image.open(img_path).convert("RGBA")
    datas = img.getdata()
    new_data = []
    for item in datas:
        # If color is close to white, make transparent
        if item[0] > threshold and item[1] > threshold and item[2] > threshold:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    img.putdata(new_data)
    img.save(out_path, "PNG")
    print(f"Made transparent: {out_path}")

make_white_transparent('public/asset_signature.png', 'public/asset_signature_clean.png', 245)
make_white_transparent('public/asset_stamp.png', 'public/asset_stamp_clean.png', 248)
make_white_transparent('public/asset_watermark.png', 'public/asset_watermark_clean.png', 240)
make_white_transparent('public/asset_iso_badge.png', 'public/asset_iso_badge_clean.png', 250)
print('Transparency processing complete!')
