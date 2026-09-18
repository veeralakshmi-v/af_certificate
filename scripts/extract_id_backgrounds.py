import fitz

doc = fitz.open('id_card.pdf')

# Render page 1 without text (clean background for Front)
doc_front = fitz.open('id_card.pdf')
page1 = doc_front[0]
blocks1 = page1.get_text('dict')['blocks']
for b in blocks1:
    if 'lines' in b:
        for l in b['lines']:
            for s in l['spans']:
                page1.add_redact_annot(fitz.Rect(s['bbox']), fill=None)
# Also redact the student photo area so we have a clean photo placeholder / frame background
# Photo bbox in page 1: (25.28, 71.41, 121.86, 199.7)
photo_rect = fitz.Rect(25.28, 71.41, 121.86, 199.7)
# Redact photo image if needed or extract background

page1.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE)
pix1 = page1.get_pixmap(dpi=300, alpha=True)
pix1.save('public/id_card_assets/front_bg_no_text.png')
print("Saved front_bg_no_text.png")

# Page 2 without text (clean background for Back)
doc_back = fitz.open('id_card.pdf')
page2 = doc_back[1]
blocks2 = page2.get_text('dict')['blocks']
for b in blocks2:
    if 'lines' in b:
        for l in b['lines']:
            for s in l['spans']:
                page2.add_redact_annot(fitz.Rect(s['bbox']), fill=None)

page2.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE)
pix2 = page2.get_pixmap(dpi=300, alpha=True)
pix2.save('public/id_card_assets/back_bg_no_text.png')
print("Saved back_bg_no_text.png")
