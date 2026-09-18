import fitz

doc = fitz.open('af_intern_certificate.pdf')
page = doc[0]
text_instances = page.get_text('dict')

print(f"Page dimensions: width={page.rect.width}, height={page.rect.height}")

for block in text_instances['blocks']:
    if 'lines' in block:
        for line in block['lines']:
            for span in line['spans']:
                text = span['text'].strip()
                if text:
                    bbox = [round(x, 1) for x in span['bbox']]
                    print(f"bbox={bbox} font='{span['font']}' size={span['size']:.1f} color={hex(span['color'])} -> {repr(text)}")
