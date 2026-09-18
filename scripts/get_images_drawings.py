import fitz

doc = fitz.open('af_intern_certificate.pdf')
page = doc[0]
for img_info in page.get_image_info():
    print("Image info:", {k: v for k, v in img_info.items() if k != 'image'})

for i, d in enumerate(page.get_drawings()[:10]):
    print(f"Drawing {i}: rect={d['rect']}")
