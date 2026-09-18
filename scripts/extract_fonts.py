import fitz
import os

os.makedirs('public/fonts', exist_ok=True)
doc = fitz.open('af_intern_certificate.pdf')

for xref in range(1, doc.xref_length()):
    subtype = doc.xref_get_key(xref, 'Subtype')
    type_key = doc.xref_get_key(xref, 'Type')
    
    # Check if this xref is a FontFile or FontDescriptor or Font
    if doc.xref_is_stream(xref):
        stream = doc.xref_stream(xref)
        # Check if stream starts with TrueType magic (0x00010000 or 'OTTO' or 'true')
        if len(stream) > 4:
            if stream[:4] in [b'\x00\x01\x00\x00', b'OTTO', b'true', b'ttcf']:
                name = f"font_{xref}.ttf"
                with open(f"public/fonts/{name}", "wb") as f:
                    f.write(stream)
                print(f"Extracted TTF font xref {xref} ({len(stream)} bytes) -> public/fonts/{name}")

print("Font extraction complete!")
