# Stakeholders & Requirement Mapping

## Key stakeholders

- Patients: dùng hệ thống để đặt lịch, hủy lịch, xem lịch sử.
- Doctors: quản lý lịch, xem danh sách bệnh nhân, ghi chú sau khám.
- Clinic Administrators (Owner): quản lý hệ thống, xem báo cáo, quản lý hồ sơ bệnh nhân.

## Mapping (Functional & Non-functional)

| Stakeholder | Functional Requirements | Non-functional Requirements |
| ----------- | ----------------------- | --------------------------- |
| Patients    | - Login/Logout          |

- Đặt lịch: chọn ngày, giờ, bác sĩ (theo availability)
- Xem lịch đã đặt & hủy
- Nhận thông báo xác nhận | - Phản hồi < 2s cho thao tác đặt/tra cứu
- Dữ liệu mã hóa in-transit & at-rest
- Giao diện thân thiện, hỗ trợ tiếng Việt/English |
  | Doctors | - Login/Logout
- Xem danh sách bệnh nhân theo ngày
- Đánh dấu trạng thái (completed/pending/cancelled)
- Ghi chú nhanh sau khám | - Hạn mức số lượt khám/ngày
- Cập nhật thời gian thực
- Bảo mật dữ liệu bệnh nhân |
  | Admin | - Login/Logout
- Thống kê: số lượt khám/ngày, số hủy
- Quản lý hồ sơ bệnh nhân
- Xuất dữ liệu (Excel) | - Uptime ≥ 99%
- Backup dữ liệu hàng ngày
- Dễ dàng mở rộng khi tăng bác sĩ/bệnh nhân |

---
