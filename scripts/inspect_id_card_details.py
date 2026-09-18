import fitz
import json

doc = fitz.open('id_card.pdf')

for page_num, page in enumerate(doc):
    print(f"\n================ PAGE {page_num + 1} (Width: {page.rect.width}, Height: {page.rect.height}) ================")
    
    # Drawings (vector shapes)
    drawings = page.get_drawings()
    print(f"--- Vector Shapes ({len(drawings)}) ---")
    for i, d in enumerate(drawings):
        print(f"Shape {i}: fill={d.get('fill')}, stroke={d.get('color')}, rect={d.get('rect')}")
        for item in d.get('items', []):
            print(f"   item: {item}")
            
    # Text spans
    print("--- Text Spans ---")
    data = json.loads(page.get_text('rawjson'))
    for b in data.get('blocks', []):
        if 'lines' in b:
            for line in b['lines']:
                for span in line['spans']:
                    txt = span['text']
                    fnt = span['font']
                    sz = span['size']
                    clr = f"#{span['color']:06x}"
                    ox, oy = span['origin']
                    bbox = span['bbox']
                    print(f"[{ox:5.1f}, {oy:5.1f}] Size:{sz:4.1f} Color:{clr} Font:{fnt:20} -> {txt!r}")

    # Images
    print("--- Image Placements ---")
    for img_info in page.get_image_info(xrefs=True):
        print(f"Image xref {img_info.get('xref')}: bbox={img_info.get('bbox')}")
