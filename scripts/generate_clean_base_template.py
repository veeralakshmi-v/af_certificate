import fitz

def generate_base_template():
    doc = fitz.open('af_intern_certificate.pdf')
    page = doc[0]

    # Dynamic text to redact/remove from the base template so we can render dynamic text cleanly over it:
    # 1. Student Name area (x: 30 to 550, y: 160 to 212)
    # 2. Description area (x: 30 to 550, y: 212 to 258)
    # 3. Dynamic QR code area (x: 460 to 580, y: 60 to 170)
    # 4. Duration date (x: 40 to 280, y: 498 to 525)
    # 5. Final Assessment topics (x: 40 to 280, y: 552 to 622)
    # 6. Noted Qualities title & text (x: 40 to 280, y: 622 to 780)

    # White covers for top presentation areas
    page.draw_rect(fitz.Rect(32, 162, 560, 210), color=(1, 1, 1), fill=(1, 1, 1))
    page.draw_rect(fitz.Rect(32, 212, 560, 258), color=(1, 1, 1), fill=(1, 1, 1))
    
    # White cover for old QR code (so live SVG QR is rendered dynamically)
    page.draw_rect(fitz.Rect(470, 68, 575, 172), color=(1, 1, 1), fill=(1, 1, 1))

    # Orange covers for bottom left dynamic areas
    # Orange color in PDF is approx (0.933, 0.514, 0.106)
    # Let's sample the exact orange pixel color from the left box
    orange_fill = (0.9333, 0.5137, 0.1058) # #ee831b
    
    # Duration date area
    page.draw_rect(fitz.Rect(44, 498, 280, 526), color=orange_fill, fill=orange_fill)
    
    # Final assessment topics area
    page.draw_rect(fitz.Rect(44, 552, 280, 622), color=orange_fill, fill=orange_fill)

    # Qualities area
    page.draw_rect(fitz.Rect(44, 624, 280, 775), color=orange_fill, fill=orange_fill)

    # Render at 300 DPI for pristine vector print quality
    pix = page.get_pixmap(dpi=300)
    pix.save('public/alphafly_certificate_base.png')
    print('Generated public/alphafly_certificate_base.png successfully!')

if __name__ == '__main__':
    generate_base_template()
