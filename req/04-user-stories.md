# User Stories (Tiếng Việt)

Bao gồm các user stories ưu tiên cho backlog.

## Epic: Quản lý lịch hẹn

### US-001: Đặt lịch khám

- As a: Bệnh nhân
- I want: Đặt lịch khám trực tuyến bằng cách chọn bác sĩ, ngày và giờ
- So that: Tôi có thể sắp xếp cuộc hẹn mà không cần gọi điện

**Tiêu chí chấp nhận**:

- Hiển thị khung giờ khả dụng theo bác sĩ
- Không cho đặt vào khung giờ đã bị đặt/không khả dụng
- Nhận thông báo xác nhận sau khi đặt

### US-002: Hủy lịch khám

- As a: Bệnh nhân
- I want: Hủy lịch khám trước giờ hẹn theo chính sách
- So that: Tôi có thể giải phóng khung giờ cho người khác

**Tiêu chí chấp nhận**:

- Chỉ cho hủy khi còn thời gian quy định (ví dụ >2 giờ trước)
- Gửi thông báo hủy cho bác sĩ

### US-003: Xem lịch sử khám

- As a: Bệnh nhân
- I want: Xem lịch sử bệnh nhân (đã khám/đã hủy/sắp tới)
- So that: Tôi biết tình trạng các cuộc hẹn

**Tiêu chí chấp nhận**:

- Lọc được theo trạng thái và phạm vi ngày
- Mỗi mục chứa thông tin bác sĩ, ngày giờ, ghi chú

## Epic: Quản lý bác sĩ

### US-004: Xem danh sách bệnh nhân hàng ngày

- As a: Bác sĩ
- I want: Xem danh sách bệnh nhân theo ngày và đánh dấu trạng thái
- So that: Tôi quản lý công việc hàng ngày hiệu quả

**Tiêu chí chấp nhận**:

- Hiển thị thời gian, tên, triệu chứng
- Cập nhật trạng thái thành completed/cancelled

### US-005: Đặt giới hạn số lượt khám/ngày

- As a: Bác sĩ
- I want: Thiết lập giới hạn số lượt khám mỗi ngày
- So that: Tôi không bị quá tải

**Tiêu chí chấp nhận**:

- Khi đạt giới hạn, hệ thống không cho bệnh nhân đặt thêm
- Hiển thị số lượt hiện tại/giới hạn

## Epic: Quản trị hệ thống

### US-006: Xuất dữ liệu bệnh nhân

- As a: Admin
- I want: Xuất danh sách bệnh nhân và lịch hẹn ra Excel
- So that: Tôi có thể làm báo cáo/luu trữ

**Tiêu chí chấp nhận**:

- Xuất theo bộ lọc hiện tại
- File Excel chứa trường cần thiết (tên, phone, email, DOB, lịch hẹn)

### US-007: Thống kê nhanh

- As a: Admin
- I want: Xem thống kê số lượt đặt/hủy trong ngày
- So that: Tôi theo dõi hiệu suất phòng khám

**Tiêu chí chấp nhận**:

- Biểu đồ / thẻ hiển thị tổng lượt, tỉ lệ hủy, top bác sĩ

---

Ghi chú: Các user stories trên được viết ngắn gọn để đưa vào backlog; mỗi story cần chi tiết thêm acceptance tests khi lên sprint planning.
