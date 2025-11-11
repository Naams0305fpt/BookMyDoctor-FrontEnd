# Báo Cáo Tiến Độ Dự Án (Progress Report)

**Ngày cập nhật**: 11/11/2025  
**Dự án**: BookMyDoctor - Frontend  
**Branch**: API_Web

## Mục đích

Tài liệu này so sánh các yêu cầu trong folder `req` với code hiện tại để:

- Đánh giá tính năng đã triển khai
- Xác định các chức năng còn thiếu
- Lập kế hoạch cải tiến cho giai đoạn tiếp theo

---

## 1. Tổng Quan Triển Khai

### ✅ Đã hoàn thành (Implemented)

| Module                        | Chức năng                                      | File liên quan                                  | Ghi chú                 |
| ----------------------------- | ---------------------------------------------- | ----------------------------------------------- | ----------------------- |
| **Authentication**            | Đăng ký, đăng nhập, đăng xuất                  | `SignUp.tsx`, `Login.tsx`, `AuthContext.tsx`    | ✅ Hoàn chỉnh           |
| **Patient - Đặt lịch**        | Xem danh sách bác sĩ, chọn khung giờ, đặt lịch | `BookingForm.tsx`                               | ✅ Hoàn chỉnh           |
| **Patient - Lịch sử**         | Xem lịch sử đặt khám, lọc theo trạng thái      | `BookingHistory.tsx`                            | ✅ Hoàn chỉnh           |
| **Patient - Profile**         | Quản lý thông tin cá nhân                      | `PatientProfile.tsx`                            | ✅ Hoàn chỉnh           |
| **Doctor - Lịch bệnh nhân**   | Xem danh sách bệnh nhân theo ngày              | `AppointmentTable.tsx`                          | ✅ Hoàn chỉnh           |
| **Doctor - Quản lý lịch**     | Thiết lập giờ làm việc                         | `ScheduleManagement.tsx` (doctor)               | ✅ Hoàn chỉnh           |
| **Doctor - Ghi chú**          | Thêm chẩn đoán/đơn thuốc                       | `AppointmentTable.tsx`                          | ✅ Có UI, cần cải thiện |
| **Admin - Quản lý bác sĩ**    | Tạo, xóa, tìm kiếm bác sĩ                      | `DoctorManagement.tsx`, `CreateDoctorModal.tsx` | ✅ Hoàn chỉnh           |
| **Admin - Quản lý bệnh nhân** | Xem, tìm kiếm bệnh nhân                        | `PatientManagement.tsx`                         | ✅ Hoàn chỉnh           |
| **Admin - Xem lịch**          | Xem lịch tất cả bác sĩ                         | `ScheduleManagement.tsx` (admin)                | ✅ Hoàn chỉnh           |
| **UI/UX**                     | Responsive, hero, footer, carousel             | `Hero.tsx`, `Footer.tsx`, `DoctorsCarousel.tsx` | ✅ Hoàn chỉnh           |

### ⚠️ Đã có nhưng chưa đầy đủ (Partial)

| Chức năng           | Tình trạng              | File liên quan         | Cần bổ sung                                       |
| ------------------- | ----------------------- | ---------------------- | ------------------------------------------------- |
| **Hủy lịch khám**   | UI có nút Cancel        | `BookingHistory.tsx`   | ⚠️ Thiếu policy (không cho hủy < 2h trước)        |
| **Thống kê cơ bản** | Hiển thị một số số liệu | `BookingHistory.tsx`   | ⚠️ Chưa có dashboard chuyên biệt, chưa có biểu đồ |
| **Xóa bác sĩ**      | Có chức năng xóa        | `DoctorManagement.tsx` | ⚠️ Chưa kiểm tra lịch hẹn sắp tới trước khi xóa   |
| **Validation**      | Client-side validation  | `BookingForm.tsx`      | ⚠️ Có, nhưng chưa đồng nhất toàn bộ form          |

### ❌ Chưa triển khai (Missing)

| Yêu cầu                                       | Mức độ ưu tiên | File cần tạo/sửa                                | Lý do quan trọng                |
| --------------------------------------------- | -------------- | ----------------------------------------------- | ------------------------------- |
| **FR-N-001..004: Thông báo Email/SMS**        | 🔴 Cao         | Backend + notification service                  | Bệnh nhân cần xác nhận đặt lịch |
| **FR-D-013..015: Giới hạn số lượt khám/ngày** | 🔴 Cao         | Backend API + `BookingForm.tsx`                 | Tránh bác sĩ bị quá tải         |
| **FR-A-014..015: Xuất Excel/CSV**             | 🔴 Cao         | `PatientManagement.tsx`, `DoctorManagement.tsx` | Admin cần báo cáo               |
| **NFR-U-005: Đa ngôn ngữ (i18n)**             | 🟡 Trung bình  | Toàn bộ components                              | Hỗ trợ Tiếng Việt + English     |
| **NFR-M-003: Unit Tests**                     | 🔴 Cao         | `*.test.tsx` files                              | Đảm bảo chất lượng code         |
| **NFR-L-001: Error Tracking (Sentry)**        | 🟡 Trung bình  | `index.tsx` + config                            | Giám sát lỗi production         |
| **NFR-M-004: CI/CD Pipeline**                 | 🟡 Trung bình  | `.github/workflows/`                            | Tự động hóa build/test/deploy   |
| **FR-N-002: Nhắc nhở 24h trước**              | 🟡 Trung bình  | Backend cron job                                | Giảm no-show                    |
| **NFR-P: Performance optimization**           | 🟢 Thấp        | Lazy loading, code splitting                    | Cải thiện tốc độ tải            |
| **Dark mode**                                 | 🟢 Thấp        | Theme context + CSS                             | Trải nghiệm người dùng tốt hơn  |

---

## 2. Chi Tiết So Sánh Theo Module

### 2.1. Module Bệnh nhân (Patient)

#### ✅ Đã triển khai

**FR-P-001**: Đăng ký tài khoản

- File: `src/components/auth/SignUp.tsx`
- API: `api.register()`
- Trạng thái: ✅ Hoàn chỉnh

**FR-P-002**: Đăng nhập / Đăng xuất

- File: `src/components/auth/Login.tsx`, `src/contexts/AuthContext.tsx`
- API: `api.login()`, `api.logout()`
- Trạng thái: ✅ Hoàn chỉnh

**FR-P-003**: Xem danh sách bác sĩ theo chuyên khoa

- File: `src/components/booking/BookingForm.tsx`
- API: `api.getAllDoctors()`
- Trạng thái: ✅ Hoàn chỉnh (có filter Department)

**FR-P-004**: Xem khung giờ trống của bác sĩ

- File: `src/components/booking/BookingForm.tsx`
- API: `api.getSlotBusyByDoctor()`
- Trạng thái: ✅ Hoàn chỉnh (hiển thị busy slots)

**FR-P-005**: Đặt lịch khám

- File: `src/components/booking/BookingForm.tsx`
- API: `api.submitBooking()`
- Trạng thái: ✅ Hoàn chỉnh (gồm: bác sĩ, ngày, giờ, triệu chứng)

**FR-P-008**: Xem lịch sử đặt khám

- File: `src/components/pages/BookingHistory.tsx`
- API: `api.getMyHistoryAppointments()`
- Trạng thái: ✅ Hoàn chỉnh (filter theo status: Scheduled/Completed/Cancelled)

**FR-P-010**: Quản lý thông tin cá nhân

- File: `src/components/profiles/PatientProfile.tsx`
- Trạng thái: ✅ UI hoàn chỉnh

#### ❌ Chưa triển khai

**FR-P-007**: Nhận thông báo xác nhận (email/app)

- Trạng thái: ❌ Thiếu
- Cần: Backend email service + frontend hiển thị toast
- Ưu tiên: 🔴 Cao

**FR-P-009**: Hủy lịch (theo chính sách)

- Trạng thái: ⚠️ Có nút Cancel nhưng chưa có policy (không cho hủy < 2h)
- File cần sửa: `src/components/pages/BookingHistory.tsx`
- Ưu tiên: 🟡 Trung bình

---

### 2.2. Module Bác sĩ (Doctor)

#### ✅ Đã triển khai

**FR-D-001**: Đăng nhập / Đăng xuất

- File: `src/components/auth/Login.tsx`
- Trạng thái: ✅ Hoàn chỉnh

**FR-D-002**: Xem danh sách bệnh nhân theo ngày

- File: `src/components/doctor/AppointmentTable.tsx`
- API: `api.getPatients()`
- Trạng thái: ✅ Hoàn chỉnh (calendar view + filter by date)

**FR-D-003**: Đánh dấu trạng thái cuộc hẹn

- File: `src/components/doctor/AppointmentTable.tsx`
- Trạng thái: ✅ Hoàn chỉnh (Scheduled/Completed/Cancelled)

**FR-D-004**: Ghi chú nhanh sau khám

- File: `src/components/doctor/AppointmentTable.tsx`
- Trạng thái: ✅ Có UI cho Prescription và Symptoms
- Cải tiến cần: Auto-save, print prescription

**FR-D-005**: Thiết lập giờ làm việc

- File: `src/components/doctor/ScheduleManagement.tsx`
- Trạng thái: ✅ Hoàn chỉnh

**FR-D-007**: Tìm kiếm bệnh nhân

- File: `src/components/doctor/AppointmentTable.tsx`
- Trạng thái: ✅ Hoàn chỉnh (search by name/phone)

#### ❌ Chưa triển khai

**FR-D-006**: Thiết lập giới hạn số cuộc hẹn tối đa/ngày

- Trạng thái: ❌ Thiếu hoàn toàn
- Cần: Backend thêm field `MaxDailyAppointments`, API check trước khi book
- File cần tạo/sửa: `src/components/profiles/DoctorProfile.tsx`, `src/components/booking/BookingForm.tsx`
- Ưu tiên: 🔴 Cao (business critical)

---

### 2.3. Module Quản trị (Admin)

#### ✅ Đã triển khai

**FR-A-001**: Đăng nhập quản trị

- File: `src/components/auth/Login.tsx`
- Trạng thái: ✅ Hoàn chỉnh

**FR-A-002**: Quản lý tài khoản bác sĩ (tạo, xóa)

- File: `src/components/admin/DoctorManagement.tsx`, `CreateDoctorModal.tsx`
- API: `api.createDoctor()`, `api.deleteDoctor()`
- Trạng thái: ✅ Hoàn chỉnh
- Cải tiến cần: Kiểm tra lịch hẹn trước khi xóa

**FR-A-003**: Quản lý danh sách bệnh nhân

- File: `src/components/admin/PatientManagement.tsx`
- API: `api.getPatients()`
- Trạng thái: ✅ Hoàn chỉnh (search, filter by date/status)

**FR-A-008..010**: Xem lịch tất cả bác sĩ

- File: `src/components/admin/ScheduleManagement.tsx`
- API: `api.getSchedules()`
- Trạng thái: ✅ Hoàn chỉnh (search by doctor name, filter by date)

#### ⚠️ Đã có nhưng chưa đầy đủ

**FR-A-004**: Xem báo cáo thống kê

- File: `src/components/pages/BookingHistory.tsx`
- Trạng thái: ⚠️ Có hiển thị số liệu cơ bản, chưa có dashboard chuyên nghiệp
- Cần: Biểu đồ (chart), breakdown by doctor/department
- Ưu tiên: 🟡 Trung bình

#### ❌ Chưa triển khai

**FR-A-005**: Xuất dữ liệu sang Excel/CSV

- Trạng thái: ❌ Thiếu hoàn toàn
- Cần: Thư viện `xlsx`, nút Export trong `PatientManagement.tsx`, `DoctorManagement.tsx`
- Ưu tiên: 🔴 Cao (stakeholder yêu cầu)

**FR-A-006**: Cấu hình quy tắc toàn cục

- Trạng thái: ❌ Thiếu
- Cần: Admin settings page
- Ưu tiên: 🟡 Trung bình

---

### 2.4. Hệ thống thông báo (Notification)

#### ❌ Tất cả chưa triển khai

**FR-N-001**: Email xác nhận sau đặt lịch

- Trạng thái: ❌ Thiếu
- Cần: Backend email service (nodemailer/SendGrid)
- Ưu tiên: 🔴 Cao

**FR-N-002**: Email/SMS nhắc nhở 24h trước

- Trạng thái: ❌ Thiếu
- Cần: Backend cron job + email/SMS gateway
- Ưu tiên: 🟡 Trung bình

**FR-N-003**: Thông báo cho bác sĩ khi có booking mới

- Trạng thái: ❌ Thiếu
- Cần: Real-time notification (WebSocket/polling) hoặc email
- Ưu tiên: 🟡 Trung bình

**FR-N-004**: Thông báo khi có ghi chú/phác đồ mới

- Trạng thái: ❌ Thiếu
- Ưu tiên: 🟢 Thấp

---

## 3. Yêu Cầu Phi Chức Năng (Non-Functional)

### 3.1. Hiệu năng (Performance)

| Yêu cầu                         | Trạng thái   | Ghi chú                                 |
| ------------------------------- | ------------ | --------------------------------------- |
| NFR-P-001: Response time ≤ 2s   | ⚠️ Chưa đo   | Cần performance monitoring              |
| NFR-P-003: 200 concurrent users | ❌ Chưa test | Cần load testing (k6/JMeter)            |
| Code splitting                  | ❌ Chưa có   | Nên dùng React.lazy()                   |
| Image optimization              | ⚠️ Partial   | Images trong `public/images`, chưa WebP |

**Khuyến nghị**:

- Thêm React.lazy() cho các component lớn (AdminDashboard, DoctorDashboard)
- Convert images sang WebP
- Thiết lập performance monitoring (Lighthouse CI)

### 3.2. Bảo mật (Security)

| Yêu cầu                       | Trạng thái           | Ghi chú                             |
| ----------------------------- | -------------------- | ----------------------------------- |
| NFR-S-001: HTTPS/TLS          | ⚠️ Phụ thuộc hosting | Cần cấu hình khi deploy             |
| NFR-S-003: RBAC               | ✅ Đã có             | Role-based routing trong `App.tsx`  |
| NFR-S-004: Input validation   | ⚠️ Partial           | Có ở `BookingForm.tsx`, cần mở rộng |
| NFR-S-002: Encryption at-rest | ⚠️ Backend           | Frontend không kiểm soát được       |

**Khuyến nghị**:

- Thêm validation helpers toàn cục
- CSP headers khi deploy
- Regular security audit (npm audit, Snyk)

### 3.3. Khả dụng & Tin cậy (Availability)

| Yêu cầu                    | Trạng thái         | Ghi chú                             |
| -------------------------- | ------------------ | ----------------------------------- |
| NFR-R-001: Uptime ≥ 99%    | ⚠️ Phụ thuộc infra | Cần hosting đáng tin cậy            |
| NFR-R-002: Daily backup    | ❌ Chưa cấu hình   | Backend/database responsibility     |
| NFR-R-004: Retry mechanism | ⚠️ Partial         | Axios interceptor có, cần cải thiện |

**Khuyến nghị**:

- Thiết lập health check endpoint
- Monitoring & alerting (Sentry/UptimeRobot)

### 3.4. Khả năng bảo trì (Maintainability)

| Yêu cầu                        | Trạng thái   | Ghi chú                    |
| ------------------------------ | ------------ | -------------------------- |
| NFR-M-001: Documentation       | ⚠️ Có README | Cần JSDoc cho components   |
| NFR-M-002: ESLint + TypeScript | ✅ Đã có     | TypeScript được dùng       |
| NFR-M-003: Unit tests ≥ 70%    | ❌ Thiếu     | Chỉ có `App.test.tsx` stub |
| NFR-M-004: CI/CD               | ❌ Chưa có   | Cần GitHub Actions         |

**Khuyến nghị**:

- Viết tests cho `api.ts`, `BookingForm.tsx`, `AuthContext.tsx`
- Setup GitHub Actions: lint → test → build → deploy
- Thêm Storybook cho component documentation

### 3.5. Khả năng sử dụng (Usability)

| Yêu cầu                      | Trạng thái    | Ghi chú                         |
| ---------------------------- | ------------- | ------------------------------- |
| NFR-U-001: Mobile responsive | ✅ Đã có      | CSS responsive trong components |
| NFR-U-002: Multi-language    | ❌ Thiếu      | Cần react-i18next               |
| NFR-U-003: WCAG 2.1 AA       | ⚠️ Chưa audit | Cần test với axe-core           |

**Khuyến nghị**:

- Thêm i18n với react-i18next (file `vi.json`, `en.json`)
- Accessibility audit và fix
- Loading skeletons cho UX tốt hơn

---

## 4. Kế Hoạch Cải Tiến (Roadmap)

### Phase 1: Critical (2-3 tuần)

**Tuần 1-2**:

- [ ] **FR-D-006**: Implement doctor appointment limit
  - Backend: Add `MaxDailyAppointments` field
  - Frontend: Settings UI trong `DoctorProfile.tsx`
  - Pre-check trong `BookingForm.tsx`
- [ ] **FR-A-005**: Excel export
  - Install `xlsx`, `file-saver`
  - Tạo util `src/utils/excelExport.ts`
  - Thêm nút Export trong `PatientManagement.tsx`, `DoctorManagement.tsx`

**Tuần 2-3**:

- [ ] **FR-N-001**: Email notification system

  - Backend: Setup nodemailer/SendGrid
  - Email templates cho booking confirmation
  - Frontend: Toast notification sau khi book thành công

- [ ] **NFR-M-003**: Unit tests (70% coverage cho critical paths)
  - Tests cho `api.ts`
  - Tests cho `BookingForm.tsx`
  - Tests cho `AuthContext.tsx`

### Phase 2: High Priority (2-3 tuần)

**Tuần 4-5**:

- [ ] **NFR-L-001**: Error tracking & monitoring

  - Setup Sentry
  - Error boundary components
  - Performance monitoring

- [ ] **NFR-M-004**: CI/CD pipeline
  - GitHub Actions workflow
  - Auto lint, test, build on PR
  - Deploy to staging/production

**Tuần 5-6**:

- [ ] **NFR-P**: Performance optimization

  - React.lazy() cho code splitting
  - Image optimization (WebP)
  - Lighthouse audit & fixes

- [ ] **FR-N-002**: Reminder notifications
  - Backend cron job (24h before)
  - Email/SMS integration

### Phase 3: Medium Priority (3-4 tuần)

**Tuần 7-8**:

- [ ] **NFR-U-002**: Internationalization (i18n)
  - Install react-i18next
  - Extract strings to `locales/vi.json`, `locales/en.json`
  - Language switcher trong header

**Tuần 8-9**:

- [ ] **FR-A-004**: Advanced statistics dashboard
  - Install chart library (recharts/chart.js)
  - Dashboard component với graphs
  - Metrics: appointments/day, cancellation rate, top doctors

**Tuần 9-10**:

- [ ] **NFR-U-003**: Accessibility improvements
  - Run axe-core audit
  - Fix ARIA labels, keyboard navigation
  - Color contrast fixes

### Phase 4: Nice-to-have (4+ tuần)

- [ ] Dark mode
- [ ] PWA với offline support
- [ ] Push notifications (Web Push API)
- [ ] Advanced search & filters
- [ ] Doctor rating system
- [ ] Telemedicine integration

---

## 5. Metrics & KPIs

### Mục tiêu đo lường

| Metric                  | Target | Current     | Trạng thái |
| ----------------------- | ------ | ----------- | ---------- |
| Test coverage           | ≥ 70%  | ~5%         | ❌         |
| Lighthouse Performance  | ≥ 90   | Chưa đo     | ⚠️         |
| Load time (FCP)         | < 1.8s | Chưa đo     | ⚠️         |
| API response time       | < 1s   | Chưa đo     | ⚠️         |
| Uptime                  | ≥ 99%  | Chưa deploy | ⚠️         |
| Booking completion rate | ≥ 85%  | Chưa đo     | ⚠️         |
| User satisfaction (NPS) | ≥ 8/10 | Chưa đo     | ⚠️         |

### Công cụ cần thiết

- **Testing**: Jest, React Testing Library, Cypress/Playwright
- **Performance**: Lighthouse CI, Web Vitals
- **Monitoring**: Sentry, Google Analytics
- **CI/CD**: GitHub Actions
- **Load testing**: k6, Apache JMeter

---

## 6. Rủi Ro & Thách Thức

### Rủi ro kỹ thuật

1. **Backend dependencies**: Một số tính năng (email, appointment limit) cần backend support

   - Giải pháp: Phối hợp chặt chẽ với backend team, API contract rõ ràng

2. **Performance trên production**: Chưa test với real load

   - Giải pháp: Load testing trước khi launch, CDN cho static assets

3. **Security vulnerabilities**: Dependency outdated
   - Giải pháp: Regular `npm audit`, Dependabot, Snyk

### Rủi ro về tiến độ

1. **Thiếu tests**: Viết tests cho codebase lớn tốn thời gian

   - Giải pháp: Ưu tiên critical paths, viết tests song song với features mới

2. **i18n migration**: Extract strings từ 40+ components
   - Giải pháp: Làm từng module, automated extraction tools

---

## 7. Tổng Kết

### Điểm mạnh ✅

1. **Kiến trúc tốt**: Component hierarchy rõ ràng, separation of concerns
2. **TypeScript**: Type safety tốt, ít lỗi runtime
3. **UI/UX**: Thiết kế đẹp, responsive, user-friendly
4. **Core features**: Booking, scheduling, profile management hoàn chỉnh
5. **API integration**: Centralized trong `api.ts`, có error handling

### Điểm cần cải thiện ⚠️

1. **Thiếu tests**: Code coverage thấp, rủi ro regression
2. **Thiếu monitoring**: Không có error tracking, performance monitoring
3. **Thiếu i18n**: Hard-coded strings, khó maintain
4. **Performance chưa tối ưu**: Không có code splitting, lazy loading
5. **CI/CD chưa có**: Manual build/deploy, dễ sai sót

### Tính năng thiếu quan trọng ❌

1. **Email/SMS notifications** (🔴 Critical)
2. **Doctor appointment limit** (🔴 Critical)
3. **Excel export** (🔴 Critical)
4. **Unit tests** (🔴 Critical)
5. **i18n** (🟡 High)
6. **Sentry monitoring** (🟡 High)

### Khuyến nghị hành động ngay

1. **Ngay lập tức** (tuần này):

   - Viết tests cho `api.ts` và `BookingForm.tsx`
   - Implement Excel export cho admin
   - Setup GitHub Actions cho lint + test

2. **Tuần tới**:

   - Implement doctor appointment limit
   - Setup Sentry error tracking
   - Email notification cho booking confirmation

3. **Tháng tới**:
   - i18n với react-i18next
   - Performance optimization
   - Advanced statistics dashboard

---

## 8. Tài Liệu Tham Khảo

- [Stakeholders Analysis](01-stakeholders-analysis.md)
- [Functional Requirements](02-functional-requirements.md)
- [Non-Functional Requirements](03-non-functional-requirements.md)
- [User Stories](04-user-stories.md)
- [Technical Requirements](05-technical-requirements.md)
- [README.md](../README.md)
- [REQUIREMENTS.md](../REQUIREMENTS.md)

---

**Cập nhật bởi**: GitHub Copilot  
**Ngày**: 11/11/2025  
**Phiên bản**: 1.0
