import fitz

doc = fitz.open('id_card.pdf')

for page_num in range(len(doc)):
    page = doc[page_num]
    print(f"\n================ PAGE {page_num+1} ================")
    print(f"Page rect: {page.rect}")
    for b in page.get_text('dict')['blocks']:
        if 'lines' in b:
            for l in b['lines']:
                for s in l['spans']:
                    print(f"Text: '{s['text']}' | Font: {s['font']} | Size: {s['size']:.1f} | Color: #{s['color']:06x} | bbox: {[round(x,1) for x in s['bbox']]}")
    
    print("\n--- IMAGES ---")
    for img_info in page.get_image_info():
        print("Image:", {k: v for k, v in img_info.items() if k != 'image'})
