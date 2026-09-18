import fitz

doc = fitz.open('af_intern_certificate.pdf')
page = doc[0]
pix = page.get_pixmap(dpi=300)
pix.save('page_300dpi.png')
print("Saved page_300dpi.png")
