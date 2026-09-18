import struct

with open('public/fonts/Garet-Regular.ttf', 'rb') as f:
    data = f.read()

print(f"Font length: {len(data)} bytes")
# Check SFNT version
scalar_type = data[:4]
print("Scalar type:", scalar_type)

# Parse table directory
num_tables = struct.unpack('>H', data[4:6])[0]
tables = {}
for i in range(num_tables):
    offset = 12 + i * 16
    tag = data[offset:offset+4].decode('latin1')
    check = struct.unpack('>I', data[offset+4:offset+8])[0]
    tbl_offset = struct.unpack('>I', data[offset+8:offset+12])[0]
    tbl_len = struct.unpack('>I', data[offset+12:offset+16])[0]
    tables[tag] = (tbl_offset, tbl_len)

print("Tables found:", list(tables.keys()))

# Check cmap
if 'cmap' in tables:
    cmap_off, cmap_len = tables['cmap']
    version, num_subtables = struct.unpack('>HH', data[cmap_off:cmap_off+4])
    print(f"cmap subtables: {num_subtables}")
    chars = []
    for s in range(num_subtables):
        sub_off = cmap_off + 4 + s * 8
        plat_id, enc_id, sub_data_off = struct.unpack('>HHI', data[sub_off:sub_off+8])
        fmt = struct.unpack('>H', data[cmap_off + sub_data_off:cmap_off + sub_data_off + 2])[0]
        if fmt == 4:
            f4_off = cmap_off + sub_data_off
            seg_count_x2 = struct.unpack('>H', data[f4_off+6:f4_off+8])[0]
            seg_count = seg_count_x2 // 2
            end_codes = struct.unpack(f'>{seg_count}H', data[f4_off+14:f4_off+14+seg_count*2])
            start_codes = struct.unpack(f'>{seg_count}H', data[f4_off+16+seg_count*2:f4_off+16+seg_count*4])
            for start, end in zip(start_codes, end_codes):
                if start != 0xFFFF:
                    for cp in range(start, end + 1):
                        chars.append(chr(cp))
            break
    print("Mapped chars in Garet-Regular.ttf (count:", len(chars), "):", "".join(chars))
