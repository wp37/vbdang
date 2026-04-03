---
name: Skill_The_Thuc_VB_Dang_HD36
description: "Skill sinh văn bản Đảng (.docx) đúng thể thức theo Hướng dẫn 36-HD/VPTW. Hỗ trợ TẤT CẢ loại VB Đảng: Nghị quyết, Chỉ thị, Kết luận, Quyết định, Quy định, Quy chế, Báo cáo, Tờ trình, Thông báo, Hướng dẫn, Chương trình, Thông tri, Công văn, Biên bản. Dùng khi cần tạo VB cho cấp uỷ, cơ quan tham mưu, BCSĐ, ĐĐ, ban chỉ đạo ở mọi cấp từ TW đến chi bộ."
---

# Skill: Sinh Văn Bản Đảng (HD 36-HD/VPTW)

## Khi nào dùng skill này?

- Khi người dùng yêu cầu tạo văn bản **của Đảng** (cấp uỷ, ban tham mưu, BCSĐ, ĐĐ...)
- Khi thấy: "ĐẢNG CỘNG SẢN VIỆT NAM", "T/M", "tỉnh uỷ", "huyện uỷ", "chi bộ"...
- **KHÔNG dùng** cho VB hành chính nhà nước (NĐ30) → dùng `Skill_The_Thuc_VB_ND30`

## Workflow

### Bước 1: Xác định loại VB

Hỏi người dùng loại văn bản cần tạo:

| Script | Loại VB |
|---|---|
| `generate_vb_co_ten_loai.js` | NQ, CT, KL, QĐ, QĐi, QC, BC, TTr, TB, HD, CTr, TT |
| `generate_cong_van_dang.js` | CV (Công văn) |
| `generate_bien_ban.js` | BB (Biên bản hội nghị) |

### Bước 2: Thu thập thông tin

Tra cứu các file tham chiếu trong `references/`:

- **`quy_tac_the_thuc_dang.md`** → thông số thể thức (PHẢI đọc trước khi viết code)
- **`bang_viet_tat_dang.md`** → ký hiệu loại VB + cơ quan
- **`phan_quyen_ky_dang.md`** → xác định T/M, K/T hay T/L

Hỏi người dùng các thông tin:
- Cơ quan ban hành (+ cơ quan cấp trên nếu có)
- Số ký hiệu
- Địa danh, ngày tháng
- Trích yếu nội dung
- Nội dung chi tiết
- Người ký + quyền hạn + chức vụ
- Nơi nhận

### Bước 3: Tạo file JSON đầu vào

Tạo file JSON theo mẫu trong `assets/examples/`. Xem ví dụ:
- `assets/examples/nghi_quyet.json` (VB có tên loại)
- `assets/examples/cong_van.json` (Công văn)

### Bước 4: Chạy script

```bash
# VB có tên loại (NQ, QĐ, BC, CT, KL, TB, HD...)
node engine/generate_vb_co_ten_loai.js --input data.json --output output.docx

# Công văn
node engine/generate_cong_van_dang.js --input data.json --output output.docx

# Biên bản
node engine/generate_bien_ban.js --input data.json --output output.docx
```

### Bước 5: Kiểm tra

Mở file DOCX bằng Word, đối chiếu checklist cuối file `quy_tac_the_thuc_dang.md`.

## Cấu trúc JSON đầu vào

### VB Có Tên Loại (NQ, QĐ, BC, CT...)

```json
{
  "loai_van_ban": "nghi_quyet",
  "ky_hieu_loai": "NQ",
  "co_quan_cap_tren": "ĐẢNG BỘ TỈNH HÀ GIANG",
  "co_quan_ban_hanh": "HUYỆN UỶ ĐỒNG VĂN",
  "ky_hieu_co_quan": "HU",
  "so_ky_hieu": "Số 15-NQ/HU",
  "dia_danh": "Đồng Văn",
  "ngay": "15", "thang": "03", "nam": "2026",
  "trich_yeu": "về công tác cán bộ",
  "can_cu": ["Căn cứ Điều lệ Đảng..."],
  "noi_dung": "Nội dung...",
  "quyen_han_ky": "T/M HUYỆN UỶ",
  "chuc_vu_ky": "BÍ THƯ",
  "nguoi_ky": "Nguyễn Văn A",
  "noi_nhan": ["Các chi bộ trực thuộc", "Lưu VP Huyện uỷ"]
}
```

### Công Văn

```json
{
  "loai_van_ban": "cong_van",
  "so_ky_hieu": "Số 357-CV/BTCTU",
  "trich_yeu": "Chuẩn bị hội nghị trực tuyến",
  "kinh_gui": ["Ban Bí thư Trung ương Đảng"],
  "noi_dung": "...",
  ...
}
```

### Biên Bản

```json
{
  "loai_van_ban": "bien_ban",
  "trich_yeu": "Hội nghị Ban Chấp hành lần thứ 5",
  "noi_dung": "...",
  "nguoi_ghi": "Trần Thị B",
  "chu_tri": "Nguyễn Văn A",
  "chuc_vu_trai": "NGƯỜI GHI BIÊN BẢN",
  "chuc_vu_phai": "CHỦ TRÌ HỘI NGHỊ",
  "xac_nhan": {
    "quyen_han": "T/L BAN THƯỜNG VỤ",
    "chuc_vu": "CHÁNH VĂN PHÒNG",
    "nguoi_ky": "Lê Văn C"
  }
}
```

## Lưu Ý Quan Trọng

1. **LUÔN đọc `quy_tac_the_thuc_dang.md`** trước khi viết hoặc sửa script
2. VB Đảng KHÁC VB hành chính: lề phải 15mm, dấu sao (*), T/M có gạch chéo, Nơi nhận có gạch chân
3. Khoảng trống chữ ký: **4 dòng trống** (TUYỆT ĐỐI KHÔNG dùng `spacing: {before: 600}`)
4. Line spacing: **≥ 18pt Exactly** (KHÁC NĐ30: 17pt)
