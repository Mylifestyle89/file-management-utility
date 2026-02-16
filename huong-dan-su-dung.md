# Hướng dẫn sử dụng — Tiện ích quản lý và đổi tên tệp

Tài liệu này mô tả chi tiết mọi chức năng hiện có của công cụ. Khi có thay đổi tính năng hoặc hành vi, phần **Changelog** ở cuối file sẽ được cập nhật.

---

## 1. Giới thiệu

Công cụ là ứng dụng web chạy trên trình duyệt, dùng **File System Access API** để:

- Đổi tên hàng loạt file trong thư mục bạn chọn
- Tạo thư mục con và di chuyển file theo tiền tố tên file
- Lọc, sắp xếp và xem trước kết quả trước khi áp dụng

Mọi thao tác đọc/ghi file diễn ra **trên máy của bạn**, không gửi dữ liệu lên server.

---

## 2. Yêu cầu trình duyệt

Cần trình duyệt hỗ trợ **File System Access API** (chọn thư mục và đọc/ghi file):

| Trình duyệt        | Hỗ trợ |
|--------------------|--------|
| Chrome (desktop) 86+ | Có     |
| Edge (desktop) 86+   | Có     |
| Firefox, Safari      | Chưa đầy đủ |

Nếu mở công cụ trên trình duyệt không hỗ trợ, giao diện sẽ hiển thị thông báo và không thể chọn thư mục.

---

## 3. Giao diện tổng quan

- **Bên trái (sidebar)**: Chọn thư mục, danh sách thư mục, bộ lọc, phạm vi áp dụng, tạo thư mục theo tiền tố, mẫu cấu hình, kiểu sắp xếp và toàn bộ cấu hình đổi tên (tiền tố, hậu tố, tìm/thay thế, kiểu chữ, đánh số, template).
- **Bên phải (main)**: Tên thư mục đang xem, nút **Hoàn tác** và **Áp dụng thay đổi**, thông báo lỗi/thành công, bảng danh sách file với cột Chọn / Tệp / Phần mở rộng / Dung lượng / Tên hiện tại / **Tên mới (xem trước)**.

Góc trên bên phải sidebar có nút chuyển **Dark / Light** (biểu tượng Mặt trăng / Mặt trời).

---

## 4. Chọn thư mục

### 4.1. Chọn lại

- **Nút "Chọn lại"**: Mở hộp thoại chọn thư mục của trình duyệt.
- Sau khi chọn, thư mục mới **thay thế** toàn bộ danh sách thư mục hiện tại; công cụ chỉ làm việc với một thư mục đó.
- Bạn cần cấp quyền **đọc/ghi** khi trình duyệt hỏi; nếu từ chối, công cụ sẽ báo lỗi và không tải file.

### 4.2. Thêm thư mục

- **Nút "Thêm thư mục"**: Mở hộp thoại chọn thư mục và **thêm** thư mục đó vào danh sách (không xóa các thư mục đã chọn trước đó).
- Tối đa **10 thư mục** trong một danh sách; khi đã đủ 10, nút sẽ bị vô hiệu hóa và có thông báo tương ứng.
- Nếu chọn trùng một thư mục đã có trong danh sách (cùng thư mục), công cụ báo lỗi và không thêm.

### 4.3. Danh sách thư mục

- Dưới hai nút là **Danh sách thư mục (số hiện tại / 10)**.
- Mỗi dòng: **checkbox** (tick để chọn thư mục tham gia thao tác “Tạo thư mục con theo tiền tố”), **tên thư mục** (bấm để chuyển sang xem thư mục đó), nút **Xóa** (gỡ thư mục khỏi danh sách).
- Thư mục đang được xem (danh sách file bên phải) có nền khác (xanh nhạt).
- **Tick tất cả / Bỏ tick tất cả**: Chọn hoặc bỏ chọn toàn bộ checkbox thư mục trong danh sách.

---

## 5. Phạm vi và bộ lọc

Khu vực **“Phạm vi và bộ lọc”** dùng để giới hạn file áp dụng đổi tên và thao tác “Tạo thư mục theo tiền tố”.

### 5.1. Lọc theo tên tệp

- Ô **“Lọc theo tên tệp”**: Chỉ giữ lại những file có **tên** (không phân biệt hoa thường) chứa chuỗi bạn nhập.
- Để trống = không lọc theo tên; tất cả file trong thư mục đang xem đều nằm trong danh sách đã lọc.

### 5.2. Lọc đuôi tệp

- Ô **“Lọc đuôi tệp (vd: png)”**: Chỉ giữ lại file có **phần mở rộng** khớp với chuỗi nhập (không phân biệt hoa thường, không cần gõ dấu chấm).
- Ví dụ: `png` hoặc `PNG` đều lọc file `.png`.
- Để trống = không lọc theo đuôi.

Hai bộ lọc **kết hợp**: file phải thỏa cả “lọc theo tên” và “lọc đuôi” mới xuất hiện trong bảng và được tính khi áp dụng.

### 5.3. Phạm vi áp dụng đổi tên

- **Dropdown**:
  - **“Áp dụng cho tệp đang lọc”**: Mọi file còn lại sau khi lọc (theo tên + đuôi) đều bị áp dụng quy tắc đổi tên (trừ khi bạn bật “Chỉ áp dụng cho tệp đã chọn” và không chọn file nào).
  - **“Chỉ áp dụng cho tệp đã chọn”**: Chỉ những file được **tick trong bảng** mới bị đổi tên.
- **Nút “Chọn tất cả” / “Bỏ đánh dấu tất cả”**: Chọn hoặc bỏ chọn toàn bộ file **đang hiển thị trong bảng** (đã qua bộ lọc).

---

## 6. Tạo thư mục con theo tiền tố

Chức năng này **tạo các thư mục con** trong thư mục đích, mỗi thư mục mang tên là **tiền tố** của tên file (phần trước ký tự phân tách), rồi **di chuyển** file vào đúng thư mục con đó.

### 6.1. Ký tự phân tách

- Ô **“Ký tự phân tách (vd: -_.)”**: Danh sách ký tự dùng để **tách** phần tên file (bỏ phần mở rộng) thành các đoạn; **tiền tố** là **đoạn đầu tiên** (sau khi trim khoảng trắng).
- Ví dụ: với ký tự `-_.”`, file `Cao Phuong Nam_abc.pdf` có stem `Cao Phuong Nam_abc`, tách bằng `_` → tiền tố `Cao Phuong Nam` → file được chuyển vào thư mục con tên `Cao Phuong Nam`.

### 6.2. Thư mục được áp dụng

- Nếu có **ít nhất một thư mục được tick** trong “Danh sách thư mục”: thao tác chạy trên **các thư mục đã tick** (mỗi thư mục xử lý file trong chính nó).
- Nếu **không tick thư mục nào** nhưng đang xem **một thư mục** (đã chọn bằng “Chọn lại” hoặc “Thêm thư mục”): thao tác chạy trên **thư mục đang xem**.
- Nếu có nhiều thư mục trong danh sách nhưng không tick thư mục nào, công cụ báo lỗi “Vui lòng tick ít nhất một thư mục để thực hiện.”.

### 6.3. Thực hiện

- **Nút “Tạo thư mục và di chuyển theo tiền tố”**: Sau khi nhập ít nhất một ký tự phân tách và đảm bảo có thư mục được chọn/tick đúng, bấm nút sẽ mở **hộp thoại xác nhận**. Chỉ khi bấm **“Thực hiện”** thì công cụ mới bắt đầu tạo thư mục và di chuyển file.
- File không có tiền tố (ví dụ không chứa bất kỳ ký tự phân tách nào trong tên) sẽ bị bỏ qua; file đích đã tồn tại (trùng tên trong thư mục con) sẽ không ghi đè, công cụ báo lại trong thông báo kết quả (số file di chuyển, không có tiền tố, trùng tên, lỗi).

---

## 7. Mẫu cấu hình (Preset)

Bạn có thể **lưu** toàn bộ cấu hình đổi tên hiện tại (tiền tố, hậu tố, tìm/thay thế, regex, kiểu chữ, đánh số, template) thành một **mẫu** và **áp dụng** lại sau.

### 7.1. Lưu mẫu

- Nhập **tên mẫu** vào ô “Tên mẫu cấu hình”, bấm **“Lưu”**. Cấu hình hiện tại được lưu với tên đó; nếu không nhập tên, công cụ báo lỗi.

### 7.2. Áp dụng mẫu

- Trong danh sách mẫu, bấm vào **tên một mẫu** → toàn bộ cấu hình đổi tên được thay bằng cấu hình của mẫu đó; bảng “Tên mới (xem trước)” cập nhật theo.

### 7.3. Xóa mẫu

- Bấm **“Xóa”** bên cạnh tên mẫu để xóa mẫu đó khỏi danh sách.

Mẫu được lưu trong **localStorage** của trình duyệt (theo domain); xóa dữ liệu site sẽ mất danh sách mẫu.

---

## 8. Kiểu sắp xếp

Dropdown **“Kiểu sắp xếp”** quyết định thứ tự file trong bảng (và thứ tự index khi dùng đánh số thứ tự / template):

| Giá trị               | Ý nghĩa                                                                 |
|-----------------------|-------------------------------------------------------------------------|
| Theo bảng chữ cái     | Sắp xếp theo tên file (localeCompare).                                  |
| Theo phần mở rộng     | Sắp xếp theo đuôi file, rồi theo tên nếu đuôi trùng.                   |
| Ưu tiên theo tiền tố  | File có tên **bắt đầu** bằng chuỗi trong ô “Tiền tố để ưu tiên” lên trước (không phân biệt hoa thường), còn lại sắp theo tên. |
| Ưu tiên theo hậu tố   | File có tên **kết thúc** bằng chuỗi trong ô “Hậu tố để ưu tiên” lên trước, còn lại sắp theo tên. |

Khi chọn “Ưu tiên theo tiền tố” hoặc “Ưu tiên theo hậu tố”, ô nhập tương ứng hiện ra bên dưới.

---

## 9. Cấu hình đổi tên (xem trước tên mới)

Mọi ô và tùy chọn trong sidebar (dưới “Kiểu sắp xếp”) đều tham gia vào **quy tắc đổi tên**. Thứ tự áp dụng trong công cụ: **Tìm & thay thế** (trên stem) → **Thêm tiền tố / hậu tố** → **Áp dụng kiểu chữ** → **Đánh số thứ tự** (nếu bật) → **Template** (nếu bật) → **Ghép phần mở rộng**. Cột **“Tên mới (xem trước)”** trong bảng bên phải cập nhật theo thời gian thực.

### 9.1. Thêm tiền tố / hậu tố

- **“Thêm tiền tố”**: Chuỗi được thêm vào **đầu** phần tên (stem) trước khi đổi kiểu chữ / đánh số / template.
- **“Thêm hậu tố”**: Chuỗi được thêm vào **cuối** phần tên (stem) tương tự.

### 9.2. Tìm kiếm và thay thế

- **“Tìm kiếm”** và **“Thay thế”**: Áp dụng trên **stem** (tên file bỏ phần mở rộng).
  - **Không bật “Dùng Regex”**: Thay thế **chuỗi cố định** — mọi lần xuất hiện chuỗi “Tìm kiếm” trong stem được thay bằng “Thay thế”.
  - **Bật “Dùng Regex”**: “Tìm kiếm” là **biểu thức chính quy**; “Thay thế” có thể dùng nhóm bắt (vd. `$1`). Khi bật regex, ô **“Cờ Regex (vd: gi)”** hiện ra — bạn nhập cờ (vd. `g` toàn cục, `i` không phân biệt hoa thường). Nếu regex không hợp lệ, stem giữ nguyên.

### 9.3. Kiểu chữ

- **Dropdown “Kiểu chữ”**:
  - **Giữ nguyên**: Không đổi chữ hoa/thường.
  - **chữ thường**: Toàn bộ stem chuyển thành chữ thường.
  - **CHỮ HOA**: Toàn bộ stem chuyển thành chữ hoa.
  - **kiểu camelCase**: Chuyển stem thành camelCase (tách theo khoảng trắng, dấu `-`, `_`; từ đầu viết thường, các từ sau viết hoa chữ đầu).

### 9.4. Đánh số thứ tự

- **Checkbox “Bật đánh số thứ tự”**: Khi bật, mỗi file (theo thứ tự trong bảng đã sắp xếp) được gắn một số thứ tự.
- **“Giữ tên gốc + số thứ tự”**: Nếu tick: tên mới = stem hiện tại + ký tự phân cách + số (vd. `file_01`, `file_02`). Nếu bỏ tick: dùng **“Tên gốc mới”** thay cho stem (vd. `tep_01`, `tep_02`).
- **Ba ô số/chuỗi** (trong “đánh số”):
  - Số bắt đầu (vd. `1`).
  - Độ rộng số (pad), ví dụ `2` → `01`, `02`.
  - Ký tự phân cách giữa stem (hoặc tên gốc mới) và số (vd. `_`).

### 9.5. Template tên file

- **Checkbox “Bật template tên file”**: Khi bật, ô **“Template”** dùng để tạo lại **stem** cuối cùng từ các biến.
- **Biến hỗ trợ**:
  - `{name}`: stem sau khi đã qua tiền tố/hậu tố, kiểu chữ, đánh số (nếu có).
  - `{original}`: stem gốc (trước mọi thay đổi).
  - `{ext}`: phần mở rộng.
  - `{index}`: số thứ tự đã pad (cùng cách với đánh số thứ tự).

Sau khi thay thế các biến trong template, chuỗi kết quả trở thành stem; **phần mở rộng** (extension) của file gốc luôn được giữ và ghép lại thành `stem.extension` cho tên file cuối (trừ file không có đuôi).

---

## 10. Bảng danh sách file (main)

- **Cột**: Chọn (checkbox) | Tệp (icon) | Phần mở rộng | Dung lượng | Tên hiện tại | **Tên mới (xem trước)**.
- **Checkbox**: Chỉ có ý nghĩa khi phạm vi áp dụng là **“Chỉ áp dụng cho tệp đã chọn”**; file được tick mới bị đổi tên khi bấm “Áp dụng thay đổi”.
- **Tên mới (xem trước)**:
  - Màu xanh dương: tên sẽ thay đổi và nằm trong phạm vi áp dụng (sẽ bị đổi khi áp dụng).
  - Màu vàng: tên sẽ thay đổi nhưng **không** nằm trong phạm vi áp dụng (ví dụ chọn “Chỉ áp dụng cho tệp đã chọn” và file này không được tick).
  - Màu xám: tên không đổi so với hiện tại.

Phía trên bảng có dòng thống kê “Đang chọn X / Y tệp trong danh sách” và nút “Chọn tất cả” / “Bỏ đánh dấu tất cả” cho danh sách đang hiển thị.

---

## 11. Áp dụng thay đổi và Hoàn tác

### 11.1. Áp dụng thay đổi

- **Nút “Áp dụng thay đổi (số)”**: Chỉ kích hoạt khi đã chọn thư mục và có ít nhất một file **sẽ bị đổi tên** (trong phạm vi áp dụng).
- Khi bấm, **hộp thoại xác nhận** hiện ra (nội dung nhắc số file sẽ đổi và có thể dùng “Hoàn tác lần gần nhất”). Chỉ khi bấm **“Áp dụng”** thì công cụ mới thực hiện đổi tên trên đĩa.
- Nếu có **xung đột tên** (nhiều file trùng tên mới, hoặc tên mới trùng với file không đổi tên), công cụ **không** đổi tên và báo lỗi kèm vài tên bị trùng.

### 11.2. Hoàn tác lần gần nhất

- **Nút “Hoàn tác lần gần nhất (số)”**: Chỉ kích hoạt khi vừa có một **lần** “Áp dụng thay đổi” thành công. Bấm sẽ **đổi ngược** toàn bộ file trong lần đó về tên cũ (theo thứ tự an toàn để tránh ghi đè).
- Mỗi lần “Áp dụng thay đổi” mới sẽ **ghi đè** “lần gần nhất”; bạn chỉ hoàn tác được **một** lần áp dụng gần nhất.

---

## 12. Thông báo và trạng thái

- **Vàng (cảnh báo)**: Trình duyệt không hỗ trợ File System Access API.
- **Đỏ (lỗi)**: Lỗi quyền, trùng thư mục, xung đột tên, validation (thiếu tick thư mục, thiếu ký tự phân tách, v.v.) hoặc lỗi khi đọc/ghi file.
- **Xanh (thành công)**: Đã tải file, đã đổi tên X file, đã hoàn tác, đã lưu/áp dụng mẫu, đã xóa thư mục, kết quả “Tạo thư mục con theo tiền tố”.
- **“Đang tải danh sách file…”**: Hiển thị khi đang đọc nội dung thư mục (sau khi chọn/thêm thư mục hoặc chuyển thư mục đang xem).

---

## 13. Changelog

Phần này ghi lại thay đổi tính năng hoặc hành vi của công cụ theo thời gian. Khi có bất kỳ cập nhật nào, hãy bổ sung mục tương ứng dưới đây.

---

### Chưa phát hành (Unreleased)

- (Chưa có thay đổi.)

---

### Phiên bản hiện tại (tính năng tại thời điểm tạo tài liệu)

- Chọn thư mục: Chọn lại, Thêm thư mục (tối đa 10), danh sách thư mục với tick/xóa/chuyển thư mục đang xem.
- Phạm vi và bộ lọc: Lọc theo tên, lọc theo đuôi, áp dụng cho tất cả file đang lọc hoặc chỉ file đã chọn; Chọn tất cả / Bỏ chọn tất cả.
- Tạo thư mục con theo tiền tố: Nhập ký tự phân tách, tick thư mục đích, xác nhận qua hộp thoại trước khi thực hiện.
- Mẫu cấu hình: Lưu / áp dụng / xóa preset (localStorage).
- Sắp xếp: Theo bảng chữ cái, theo đuôi, ưu tiên theo tiền tố/hậu tố (có ô nhập).
- Đổi tên: Tiền tố, hậu tố, tìm & thay thế (chuỗi hoặc regex + cờ), kiểu chữ (giữ nguyên, thường, HOA, camelCase), đánh số thứ tự (bắt đầu, pad, phân cách, giữ stem hay tên gốc mới), template với `{name}`, `{original}`, `{ext}`, `{index}`.
- Bảng file: Checkbox chọn, cột phần mở rộng, dung lượng, tên hiện tại, tên mới xem trước (màu theo trạng thái áp dụng).
- Áp dụng thay đổi: Hộp thoại xác nhận trước khi đổi tên; kiểm tra xung đột tên.
- Hoàn tác: Hoàn tác toàn bộ lần đổi tên gần nhất.
- Giao diện: Dark/Light mode; thông báo lỗi/thành công/cảnh báo; trạng thái “Đang tải danh sách file”.

---

*Tài liệu này thuộc dự án Tiện ích quản lý và đổi tên tệp. Cập nhật lần cuối khi thêm file hướng dẫn và changelog.*
