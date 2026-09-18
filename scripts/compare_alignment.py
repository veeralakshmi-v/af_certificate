import fitz

doc = fitz.open('id_card.pdf')

for p_num, page in enumerate(doc):
    print(f"\n================ PAGE {p_num + 1} ================")
    print(f"Page size: {page.rect.width} x {page.rect.height} pt")
    
    # Text spans with exact bbox and font
    for b in page.get_text('dict')['blocks']:
        if b.get('type') == 0:
            for l in b['lines']:
                for s in l['spans']:
                    bbox = [round(v, 2) for v in s['bbox']]
                    pct_x = round(bbox[0] / page.rect.width * 100, 2)
                    pct_y = round(bbox[1] / page.rect.height * 100, 2)
                    pct_w = round((bbox[2] - bbox[0]) / page.rect.width * 100, 2)
                    pct_h = round((bbox[3] - bbox[1]) / page.rect.height * 100, 2)
                    print(f"TEXT: {s['text']!r:28} | font={s['font']:20} | size={s['size']:5.2f} | top={pct_y:5.2f}% | left={pct_x:5.2f}% | w={pct_w:5.2f}% | h={pct_h:5.2f}%")

    # Images
    for info in page.get_image_info(xrefs=True):
        bbox = [round(v, 2) for v in info['bbox']]
        pct_x = round(bbox[0] / page.rect.width * 100, 2)
        pct_y = round(bbox[1] / page.rect.height * 100, 2)
        pct_w = round((bbox[2] - bbox[0]) / page.rect.width * 100, 2)
        pct_h = round((bbox[3] - bbox[1]) / page.rect.height * 100, 2)
        print(f"IMAGE: xref={info['xref']:3} | top={pct_y:5.2f}% | left={pct_x:5.2f}% | w={pct_w:5.2f}% | h={pct_h:5.2f}%")
