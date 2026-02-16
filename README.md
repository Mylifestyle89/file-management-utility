# Tiện ích quản lý và đổi tên tệp

Ứng dụng web dùng File System Access API để đổi tên hàng loạt và sắp xếp file trong thư mục trên máy bạn (chạy hoàn toàn trên trình duyệt, không gửi file lên server).

## Tính năng

- **Chọn thư mục**: Mở một hoặc nhiều thư mục (tối đa 10) để làm việc.
- **Đổi tên hàng loạt**:
  - Thêm tiền tố / hậu tố
  - Tìm và thay thế (chuỗi hoặc regex)
  - Đổi kiểu chữ: thường, HOA, camelCase
  - Đánh số thứ tự (tùy chỉnh bắt đầu, độ rộng, ký tự phân cách)
  - Template: `{name}`, `{original}`, `{ext}`, `{index}`
- **Lọc**: Theo tên file và theo phần mở rộng.
- **Phạm vi áp dụng**: Toàn bộ file đang lọc hoặc chỉ file được chọn.
- **Sắp xếp**: Theo bảng chữ cái, theo đuôi file, ưu tiên theo tiền tố/hậu tố.
- **Tạo thư mục con theo tiền tố**: Tách tên file bằng ký tự (vd: `-_.`) và di chuyển file vào thư mục con trùng tên tiền tố.
- **Mẫu cấu hình (preset)**: Lưu/áp dụng/xóa cấu hình đổi tên (lưu trong localStorage).
- **Hoàn tác**: Hoàn tác toàn bộ lần đổi tên gần nhất.
- **Giao diện**: Dark/Light mode.

## Trình duyệt hỗ trợ

Cần trình duyệt hỗ trợ **File System Access API** (chọn thư mục và đọc/ghi file):

- **Chrome** (desktop) 86+
- **Edge** (desktop) 86+

Firefox và Safari hiện chưa hỗ trợ đầy đủ; mở app trên Chrome hoặc Edge để dùng đầy đủ chức năng.

## Cài đặt và chạy

```bash
npm install
npm run dev
```

Mở địa chỉ hiển thị (thường `http://localhost:5173`) trong Chrome hoặc Edge.

## Build production

```bash
npm run build
npm run preview   # xem bản build
```

## Cấu trúc dự án

- `src/types.ts` — Kiểu TypeScript và hằng số (settings mặc định, giới hạn thư mục, v.v.)
- `src/utils/` — Hàm thuần: format, tên file, đọc/ghi file hệ thống, kiểm tra xung đột.
- `src/components/` — MessageBar, FileTable, Sidebar.
- `src/App.tsx` — State và luồng xử lý chính, gắn kết components và utils.

## Bảo mật và quyền

- Ứng dụng chỉ truy cập thư mục/file mà bạn chọn qua hộp thoại của trình duyệt.
- Không có backend; mọi thao tác đọc/ghi file diễn ra trong trình duyệt trên máy bạn.
