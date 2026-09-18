import fitz

doc = fitz.open('id_card.pdf')
print(f"Total pages: {len(doc)}")

for page_idx, page in enumerate(doc):
    print(f"\n--- PAGE {page_idx + 1} ---")
    print(f"Rect: {page.rect} (width: {page.rect.width}pt, height: {page.rect.height}pt)")
    pix = page.get_pixmap(dpi=300)
    pix.save(f"id_card_page_{page_idx + 1}_300dpi.png")
    print(f"Saved id_card_page_{page_idx + 1}_300dpi.png ({pix.width}x{pix.height} px)")
    
    # Text blocks
    blocks = page.get_text('dict')['blocks']
    for b in blocks:
        if 'lines' in b:
            for l in b['lines']:
                for s in l['spans']:
                    text = s['text'].strip()
                    if text:
                        print(f"BBOX: {[round(x,1) for x in s['bbox']]} | Font: {s['font']:25} | Size: {s['size']:4.1f} | Text: '{text}'")
                        
    # Images
    images = page.get_images()
    print(f"Images in page: {len(images)}")
    for img in images:
        print("Image info:", img)

    # Fonts
    print("\nFonts in page:")
    for f in page.get_fonts(full=True):
        print(f"Font xref {f[0]}: {f[3]}")
