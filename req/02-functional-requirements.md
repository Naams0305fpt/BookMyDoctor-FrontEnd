# Yêu cầu chức năng (Functional Requirements)

Tài liệu này mô tả các yêu cầu chức năng chính cho hệ thống BookMyDoctor.

## 1. Module Bệnh nhân (Patient)

- FR-P-001: Đăng ký tài khoản (email/phone) với xác thực OTP.
- FR-P-002: Đăng nhập / Đăng xuất.
- FR-P-003: Xem danh sách bác sĩ theo chuyên khoa.
- FR-P-004: Xem khung giờ trống của bác sĩ theo ngày.
- FR-P-005: Đặt lịch khám: chọn bác sĩ, ngày, giờ, mô tả triệu chứng.
- FR-P-006: Hệ thống kiểm tra trùng khung giờ và giới hạn số lượt khám/ngày trước khi cho đặt.
- FR-P-007: Nhận thông báo xác nhận (email/app) sau khi đặt thành công.
- FR-P-008: Xem lịch sử đặt khám (đã hoàn thành, đã huỷ, sắp tới).
- FR-P-009: Hủy lịch (theo chính sách, ví dụ: không cho hủy trong vòng 2 giờ trước giờ hẹn).
- FR-P-010: Quản lý thông tin cá nhân (họ tên, ngày sinh, số điện thoại, dị ứng, tiền sử bệnh).

## 2. Module Bác sĩ (Doctor)

- FR-D-001: Đăng nhập / Đăng xuất.
- FR-D-002: Xem danh sách bệnh nhân theo ngày (calendar/danh sách).
- FR-D-003: Đánh dấu trạng thái cuộc hẹn: Scheduled / Completed / Cancelled.
- FR-D-004: Ghi chú nhanh sau khám (chẩn đoán, đơn thuốc) và lưu vào hồ sơ bệnh nhân.
- FR-D-005: Thiết lập giờ làm việc và các khung giờ không làm việc (block slots).
- FR-D-006: Thiết lập giới hạn số cuộc hẹn tối đa mỗi ngày.
- FR-D-007: Tìm kiếm bệnh nhân theo tên hoặc số điện thoại.

## 3. Module Quản trị (Admin / Clinic Owner)

- FR-A-001: Đăng nhập / Đăng xuất với quyền quản trị.
- FR-A-002: Quản lý tài khoản bác sĩ (tạo, sửa, khóa, xóa — xóa cần archive lịch sử).
- FR-A-003: Quản lý danh sách bệnh nhân (xem, tìm kiếm, filter, export).
- FR-A-004: Xem báo cáo thống kê: tổng số lượt khám/ngày, tỷ lệ hủy, số lượt theo bác sĩ.
- FR-A-005: Xuất dữ liệu sang Excel/CSV theo bộ lọc.
- FR-A-006: Cấu hình quy tắc toàn cục (chính sách hủy, thời gian giới hạn đặt trước, thời gian nhắc nhở).

## 4. Hệ thống thông báo (Notification)

- FR-N-001: Gửi email xác nhận sau khi đặt lịch thành công.
- FR-N-002: Gửi email/SMS nhắc nhở 24 giờ trước giờ hẹn (cấu hình bật/tắt).
- FR-N-003: Thông báo cho bác sĩ khi có cuộc hẹn mới hoặc hủy.
- FR-N-004: Gửi thông báo khi bác sĩ cập nhật ghi chú/phác đồ cho bệnh nhân.

## 5. Tìm kiếm & Lọc

- FR-S-001: Tìm bác sĩ theo tên, chuyên khoa.
- FR-S-002: Lọc khung giờ có sẵn theo ngày.
- FR-S-003: Tìm lịch hẹn theo tên bệnh nhân, tên bác sĩ, phạm vi ngày, trạng thái.

## 6. Các yêu cầu chức năng hỗ trợ khác

- FR-UX-001: Hiển thị loading/placeholder khi tải dữ liệu.
- FR-UX-002: Hiển thị dialog xác nhận cho hành động xóa/hủy.
- FR-API-001: API phải trả lỗi rõ ràng (mã lỗi + thông điệp) để frontend hiển thị chính xác.

---

Ghi chú: Các mục có thể map vào các component hiện có trong `src/components` như `BookingForm.tsx`, `AppointmentTable.tsx`, `PatientManagement.tsx`, `DoctorManagement.tsx`.
