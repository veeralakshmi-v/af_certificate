import fitz
import os

doc = fitz.open('id_card.pdf')

os.makedirs('public/id_card_extracted', exist_ok=True)

for page_num, page in enumerate(doc):
    print(f"\n=== PAGE {page_num+1} (Dimensions: {page.rect.width} x {page.rect.height} pt) ===")
    
    # Save high-res page render
    pix = page.get_pixmap(dpi=300)
    pix.save(f"public/id_card_extracted/page_{page_num+1}_300dpi.png")
    
    # Extract embedded images
    for i, img in enumerate(page.get_images()):
        xref = img[0]
        base_img = doc.extract_image(xref)
        img_bytes = base_img["image"]
        img_ext = base_img["ext"]
        img_filename = f"public/id_card_extracted/p{page_num+1}_img{i}_{xref}.{img_ext}"
        with open(img_filename, "wb") as f:
            f.write(img_bytes)
        print(f"Extracted image: {img_filename} ({base_img['width']}x{base_img['height']})")

    # Text blocks
    for block in page.get_text('dict')['blocks']:
        if block.get('type') == 0:
            for line in block['lines']:
                for span in line['spans']:
                    bbox = [round(v, 2) for v in span['bbox']]
                    print(f"TEXT: {span['text']!r:30} | font={span['font']:20} | size={span['size']:5.2f} | color=#{span['color']:06x} | bbox={bbox}")
        elif block.get('type') == 1:
            bbox = [round(v, 2) for v in block['bbox']]
            print(f"IMAGE BLOCK: bbox={bbox}")
