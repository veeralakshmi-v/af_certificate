import fitz

doc = fitz.open('af_intern_certificate.pdf')
page = doc[0]

# Check all drawings
print("Total drawings:", len(page.get_drawings()))
# Check all images
for img in page.get_images():
    print("Image:", img)

# Let's inspect the content stream of the PDF
for obj_xref in doc.xref_get_keys(page.xref):
    print("Page keys:", obj_xref)
