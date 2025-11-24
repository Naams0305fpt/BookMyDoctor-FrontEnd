# Yêu cầu kỹ thuật (Technical Requirements)

Tài liệu này mô tả các yêu cầu kỹ thuật, kiến trúc và công cụ cần thiết cho dự án.

## 1. Stack & Công nghệ

- Frontend: React (>=18) + TypeScript
- State management: Context API (hiện có) / có thể bổ sung Redux nếu cần
- Routing: React Router v6
- HTTP client: Axios (đã có `src/services/api.ts`)
- Styling: CSS modules / plain CSS (hiện tại dùng CSS files)
- Testing: Jest + React Testing Library
- Build: Create React App (hoặc Vite nếu muốn nâng cấp sau này)

## 2. Cấu hình môi trường

- Biến môi trường frontend:

  - REACT_APP_API_BASE_URL
  - REACT_APP_SENTRY_DSN (nếu dùng Sentry)
  - REACT_APP_ENVIRONMENT

- Cấu hình production:
  - HTTPS bắt buộc
  - CDN cho resource tĩnh

## 3. CI / CD

- Thiết lập GitHub Actions để chạy lint, test và build trên mỗi PR.
- Pipeline nên bao gồm:
  - npm install
  - npm run lint
  - npm test -- --coverage
  - npm run build
  - Nếu build thành công -> deploy lên môi trường staging/production

## 4. API & Contracts

- Sử dụng JSON RESTful API. Các endpoint trả về cấu trúc chuẩn:
  - { success: boolean, data: any, message?: string, errors?: any }
- Xác thực: JWT hoặc session cookie HttpOnly. Endpoints bảo vệ nên trả 401/403 khi cần.
- Pagination cho endpoints trả danh sách (page, pageSize, total).

## 5. Data Models (tóm tắt)

- Patient: id, fullName, phone, email, dob, gender, medicalHistory, appointments[]
- Doctor: id, name, department, phone, email, availability, maxDailyAppointments
- Appointment: id, patientId, doctorId, date, timeSlot, status, notes, createdAt

## 6. Tính năng offline/độ tin cậy (tùy chọn)

- Sử dụng service worker (CRA PWA) để cache trang chính và cải thiện trải nghiệm mobile.
- Xử lý retry khi mạng thất bại (queued actions) cho các thao tác không quan trọng.

## 7. Observability

- Error tracking: Sentry
- Performance monitoring: Application Insights / NewRelic / Sentry Performance
- Logging: Server-side logs (structured JSON), client-side gửi lỗi tới Sentry

## 8. Security Best Practices

- Thực hiện Content Security Policy (CSP) khi deploy.
- Dùng HTTPS + HSTS.
- Cookies HttpOnly và SameSite cho token/session.
- Rate limiting trên API (backend).
- Scanner bảo mật ( Dependabot, Snyk ) để cập nhật dependency.

## 9. Testing Strategy

- Unit tests: Jest + RTL cho component, service
- Integration tests: Mock server (msw) để test flows với API giả lập
- E2E: Playwright hoặc Cypress cho kịch bản người dùng chính (đặt lịch, hủy, mark complete)

## 10. Deployment & Infra (gợi ý)

- Frontend: Host trên Netlify/Vercel hoặc S3 + CloudFront
- Backend: App Service / Azure/AWS ECS / Kubernetes
- Database: Managed Postgres / SQL Server
- Storage: Blob storage cho file export/backup

---

Ghi chú: Một số cấu hình (bảo mật, backup, APM) yêu cầu can thiệp phía backend/infra. Frontend cần phối hợp với team backend để thống nhất contract và cơ chế bảo mật.
