import fitz

doc = fitz.open('af_intern_certificate.pdf')

streams = {
    'Garet-Regular.ttf': 102,
    'Barlow-Regular.ttf': 99,
    'Barlow-Bold.ttf': 101,
    'BebasNeue.ttf': 100,
    'Amsterdam-Four.ttf': 104,
    'GlacialIndifference.ttf': 105
}

for filename, xref in streams.items():
    stream = doc.xref_stream(xref)
    with open(f"public/fonts/{filename}", "wb") as f:
        f.write(stream)
    print(f"Saved public/fonts/{filename} ({len(stream)} bytes)")
