# Yêu cầu phi chức năng (Non-Functional Requirements)

Tài liệu này tổng hợp các yêu cầu phi chức năng cho hệ thống BookMyDoctor.

## 1. Hiệu năng (Performance)

- NFR-P-001: Thời gian phản hồi cho thao tác đặt lịch hoặc tìm kiếm ≤ 2 giây (cho truy vấn đơn giản).
- NFR-P-002: Thời gian tải trang chính ≤ 3 giây trên kết nối broadband.
- NFR-P-003: Hệ thống có khả năng phục vụ tối thiểu 200 người dùng đồng thời.
- NFR-P-004: API trả lời các truy vấn đơn giản ≤ 1s (nếu có cache).

## 2. Bảo mật (Security)

- NFR-S-001: Mọi kết nối phải đi qua HTTPS/TLS.
- NFR-S-002: Lưu trữ thông tin nhạy cảm (PII) được mã hóa tại-rest.
- NFR-S-003: Xác thực và phân quyền theo vai trò (RBAC). Token JWT hoặc session cookie HttpOnly.
- NFR-S-004: Kiểm tra đầu vào (input validation) phía client và server để chống XSS/SQL Injection.
- NFR-S-005: Không log thông tin nhạy cảm (mã hóa hoặc masking trong logs).

## 3. Khả dụng & Tin cậy (Availability & Reliability)

- NFR-R-001: Uptime ≥ 99% (dịch vụ không quá ~7.2 giờ downtime/tháng).
- NFR-R-002: Backup dữ liệu hàng ngày với thời gian lưu trữ tối thiểu 30 ngày.
- NFR-R-003: Cơ chế 恢复 (recovery) với RTO ≤ 4 giờ.
- NFR-R-004: Retry tự động cho các lỗi tạm thời (circuit breaker/backoff) ở tầng client và server.

## 4. Khả năng mở rộng (Scalability)

- NFR-SC-001: Thiết kế theo mô hình có thể scale ngang cho frontend/back-end.
- NFR-SC-002: Sử dụng CDN cho tài nguyên tĩnh (assets).
- NFR-SC-003: Hệ thống hỗ trợ sharding/partition database khi số lượng user > 10,000.

## 5. Khả năng bảo trì (Maintainability)

- NFR-M-001: Codebase có comment, README, và hướng dẫn phát triển cơ bản.
- NFR-M-002: Kiểm tra chất lượng mã bằng ESLint + Prettier, TypeScript strict mode.
- NFR-M-003: Unit tests cho các module quan trọng; coverage tối thiểu 70% cho business logic.
- NFR-M-004: Quy trình CI/CD cho build/test/deploy.

## 6. Khả năng sử dụng (Usability)

- NFR-U-001: Giao diện thân thiện và dễ dùng với người không chuyên.
- NFR-U-002: Hỗ trợ đa ngôn ngữ (tối thiểu Tiếng Việt và Tiếng Anh).
- NFR-U-003: Tuân thủ WCAG 2.1 Level AA (contrast, keyboard navigation, aria-labels cơ bản).

## 7. Tương thích trình duyệt & thiết bị

- NFR-C-001: Hỗ trợ Chrome/Firefox/Edge/Safari (2 phiên bản mới nhất).
- NFR-C-002: Responsive trên mobile (≥ 320px) và tablet.

## 8. Giám sát & logging

- NFR-L-001: Thiết lập error tracking (Sentry hoặc tương tự).
- NFR-L-002: Audit logs cho các hành động nhạy cảm (đăng nhập, xóa dữ liệu, thay đổi quyền).
- NFR-L-003: Giám sát hiệu năng (APM) và cảnh báo khi lỗi vượt ngưỡng.

---

Ghi chú: Một số yêu cầu phi chức năng (mã hóa, backup, APM) cần cấu hình ở tầng hạ tầng/backend; frontend chỉ đảm nhiệm một phần (HTTPS, client-side validation, i18n).
