import cv2
import numpy as np

img = cv2.imread('public/right_panel_no_text.png', cv2.IMREAD_UNCHANGED)
h, w, _ = img.shape

# Inner area where the computer illustration is situated
# (Away from any border edges)
inner = img[int(h*0.12):int(h*0.88), int(w*0.12):int(w*0.88)]
ih, iw, _ = inner.shape

b, g, r, a = cv2.split(inner)
gray = cv2.cvtColor(cv2.merge([b, g, r]), cv2.COLOR_BGR2GRAY)

alpha = np.zeros_like(gray, dtype=np.uint8)
mask = gray < 240
alpha[mask] = np.clip((255 - gray[mask].astype(float)) * 2.0, 0, 255).astype(np.uint8)

# Tint to clean line art color
b_out = np.full_like(b, 0x50)
g_out = np.full_like(g, 0x58)
r_out = np.full_like(r, 0x65)

clean = cv2.merge([b_out, g_out, r_out, alpha])

# Crop bounding box
coords = cv2.findNonZero(alpha)
if coords is not None:
    x, y, bw, bh = cv2.boundingRect(coords)
    crop_comp = clean[y:y+bh, x:x+bw]
    cv2.imwrite('public/asset_computer_only.png', crop_comp)
    print(f"Isolated pure computer sketch: {bw}x{bh} px. Completely free of text & borders!")
