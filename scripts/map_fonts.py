import fitz

doc = fitz.open('af_intern_certificate.pdf')
for f in doc[0].get_fonts(full=True):
    xref = f[0]
    font_name = f[3].split('+')[-1]
    desc_xref = doc.xref_get_key(xref, 'FontDescriptor')
    if desc_xref[0] == 'xref':
        d_num = int(desc_xref[1].replace('0 R', '').strip())
        ff_xref = doc.xref_get_key(d_num, 'FontFile2')
        if ff_xref[0] == 'xref':
            ff_num = int(ff_xref[1].replace('0 R', '').strip())
            print(f"Font: {font_name} -> stream xref {ff_num}")
            stream = doc.xref_stream(ff_num)
            with open(f"public/fonts/{font_name}.ttf", "wb") as out:
                out.write(stream)
            print(f"Saved public/fonts/{font_name}.ttf ({len(stream)} bytes)")
