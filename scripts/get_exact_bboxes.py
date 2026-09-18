import fitz

doc = fitz.open('af_intern_certificate.pdf')
page = doc[0]
print(f"PDF Page Rect: {page.rect} (width: {page.rect.width}, height: {page.rect.height})")

# Text blocks and exact bboxes
blocks = page.get_text('dict')['blocks']
for b in blocks:
    if 'lines' in b:
        for l in b['lines']:
            for s in l['spans']:
                text = s['text'].strip()
                if text:
                    print(f"BBOX: {[round(x,1) for x in s['bbox']]} | Font: {s['font']:20} | Size: {s['size']:4.1f} | Text: '{text}'")

# Image blocks and exact bboxes
print("\n--- IMAGES IN PDF ---")
for img in page.get_images():
    xref = img[0]
    print("Image xref:", xref, "name:", img[7])
