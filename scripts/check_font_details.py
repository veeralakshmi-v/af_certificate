import fitz

doc = fitz.open('af_intern_certificate.pdf')
for f in doc[0].get_fonts(full=True):
    font_name = f[3]
    if 'Garet' in font_name or 'Barlow' in font_name:
        xref = f[0]
        print(f"Font: {font_name}, xref: {xref}")
        # print unicode mapping / widths if available
