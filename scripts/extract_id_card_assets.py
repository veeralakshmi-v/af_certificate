import fitz
import os

os.makedirs('public/id_card_assets', exist_ok=True)
doc = fitz.open('id_card.pdf')

for page_idx, page in enumerate(doc):
    for img_idx, img in enumerate(page.get_images()):
        xref = img[0]
        base_img = doc.extract_image(xref)
        img_bytes = base_img["image"]
        img_ext = base_img["ext"]
        filename = f"public/id_card_assets/p{page_idx+1}_img{img_idx}_{xref}.{img_ext}"
        with open(filename, "wb") as f:
            f.write(img_bytes)
        print(f"Saved {filename} ({len(img_bytes)} bytes)")

for f in doc[0].get_fonts(full=True) + doc[1].get_fonts(full=True):
    xref = f[0]
    font_name = f[3].split('+')[-1]
    desc_xref = doc.xref_get_key(xref, 'FontDescriptor')
    if desc_xref[0] == 'xref':
        d_num = int(desc_xref[1].replace('0 R', '').strip())
        ff_xref = doc.xref_get_key(d_num, 'FontFile2')
        if ff_xref[0] == 'xref':
            ff_num = int(ff_xref[1].replace('0 R', '').strip())
            stream = doc.xref_stream(ff_num)
            with open(f"public/id_card_assets/{font_name}.ttf", "wb") as out:
                out.write(stream)
            print(f"Saved font public/id_card_assets/{font_name}.ttf")
