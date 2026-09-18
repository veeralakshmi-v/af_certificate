import fitz
import cv2
import numpy as np

# Let's inspect the front page vector drawings and image layers
doc = fitz.open('id_card.pdf')
page = doc[0]

# Let's redact the student photo image (image xref 152) and all text
doc_front = fitz.open('id_card.pdf')
page1 = doc_front[0]

# Redact all text
for b in page1.get_text('dict')['blocks']:
    if 'lines' in b:
        for l in b['lines']:
            for s in l['spans']:
                page1.add_redact_annot(fitz.Rect(s['bbox']), fill=None)

# Redact photo
page1.add_redact_annot(fitz.Rect(25.28, 71.41, 121.86, 199.7), fill=(0, 0, 0)) # or transparent
page1.apply_redactions()

pix1 = page1.get_pixmap(dpi=300, alpha=True)
pix1.save('public/id_card_assets/front_card_base.png')
print("Saved front_card_base.png")

# Also save the sample student photo as default
student_img = doc.extract_image(152)
with open('public/id_card_assets/sample_student_photo.jpg', 'wb') as f:
    f.write(student_img['image'])
print("Saved sample_student_photo.jpg")

# Also save the logo image / QR code
for img_xref in [80, 88, 93]:
    try:
        ext_img = doc.extract_image(img_xref)
        with open(f'public/id_card_assets/asset_{img_xref}.png', 'wb') as f:
            f.write(ext_img['image'])
        print(f"Saved asset_{img_xref}.png")
    except:
        pass
