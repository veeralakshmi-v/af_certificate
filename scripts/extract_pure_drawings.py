import fitz
import cv2
import numpy as np

doc = fitz.open('af_intern_certificate.pdf')
page = doc[0]

# Let's inspect drawings in the right box region:
# PDF coordinates of right box: x ~ 290..570, y ~ 460..825
rect = fitz.Rect(293, 466, 570, 821)

# In PyMuPDF, we can create a new blank page or draw the paths:
# Or we can redact all text on the page and then render to 300 DPI pixmap!
# When text is redacted/removed, ONLY the clean vector drawings remain!
doc_copy = fitz.open('af_intern_certificate.pdf')
page_copy = doc_copy[0]

# Find all text instances and redact them
blocks = page_copy.get_text('dict')['blocks']
for b in blocks:
    if 'lines' in b:
        for l in b['lines']:
            for s in l['spans']:
                r = fitz.Rect(s['bbox'])
                page_copy.add_redact_annot(r, fill=None) # remove text without filling color

page_copy.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE)

# Render the page with text removed at 300 DPI
pix = page_copy.get_pixmap(dpi=300, alpha=True)
pix.save('page_no_text.png')
print("Rendered page_no_text.png without text!")

# Now let's crop the right box from page_no_text.png
img = cv2.imread('page_no_text.png', cv2.IMREAD_UNCHANGED)
h, w, _ = img.shape
scale = h / 842.25

# Right panel inner area (excluding the orange border):
x1 = int(297 * scale)
y1 = int(469 * scale)
x2 = int(566 * scale)
y2 = int(818 * scale)

crop = img[y1:y2, x1:x2]
cv2.imwrite('public/right_panel_no_text.png', crop)
print(f"Cropped right panel without text: {crop.shape}")

# Let's also crop just the computer illustration (monitor, keyboard, mouse)
# in the middle of the box:
ch, cw, _ = crop.shape
comp_crop = crop[int(ch*0.15):int(ch*0.75), int(cw*0.05):int(cw*0.95)]
cv2.imwrite('public/asset_computer_only.png', comp_crop)
print("Saved 100% text-free vector computer asset to public/asset_computer_only.png!")
