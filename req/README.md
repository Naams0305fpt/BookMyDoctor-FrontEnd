# Requirements & Documentation (req)

Thư mục `req` chứa tài liệu yêu cầu, phân tích và báo cáo tiến độ cho dự án BookMyDoctor-FE.

## Mục đích

- Lưu trữ các tài liệu phân tích yêu cầu, user stories và non-functional requirements
- Theo dõi tiến độ triển khai so với yêu cầu ban đầu
- Dùng làm nguồn tham chiếu cho phát triển và review

## 📚 Danh Sách Tài Liệu

### 📋 Phân tích & Yêu cầu

1. **`01-stakeholders-analysis.md`** - Phân tích stakeholders và mapping yêu cầu
2. **`02-functional-requirements.md`** - Yêu cầu chức năng chi tiết
3. **`03-non-functional-requirements.md`** - Yêu cầu phi chức năng (Performance, Security, Usability)
4. **`04-user-stories.md`** - User stories cho từng role (Patient, Doctor, Admin)
5. **`05-technical-requirements.md`** - Yêu cầu kỹ thuật và kiến trúc hệ thống

### 📊 Báo cáo & Kế hoạch

6. **`06-progress-report.md`** - Báo cáo tiến độ chi tiết

   - So sánh implementation vs requirements
   - API integration status (31 endpoints đã xác minh)
   - Roadmap 6 giai đoạn
   - **API Compliance Score: 87%** (17/31 endpoints đang dùng)
   - ✅ Đã xác minh: `/Register/user` và `/Profile/profile-me` tồn tại

7. **`07-api-integration-summary.md`** - Tóm tắt tích hợp API

   - Tổng quan nhanh (31 endpoints)
   - Vấn đề nghiêm trọng (3 mục)
   - Top 5 hành động tuần này
   - Checklist đồng bộ backend
   - ⚠️ **Lưu ý quan trọng**: Chat API response field là `Reply` không phải `response`

8. **`08-week1-action-plan.md`** - Kế hoạch thực thi tuần 1
   - Chi tiết từng ngày (5 ngày)
   - Code examples với tiếng Việt
   - Testing checklist
   - Chỉ số thành công
   - ✅ Ngày 1 hoàn thành: Đã xác minh 31 API endpoints

## 🎯 Tóm Tắt Nhanh

**Trạng thái dự án** (cập nhật: 11/11/2025):

- ✅ Tính năng cốt lõi: 90% hoàn thành
- ✅ Tích hợp API: 87% compliance (31/31 endpoints đã xác minh)
- ⚠️ Thiếu nghiêm trọng: UI AI Chatbot, Xuất Excel, Unit Tests
- � Ưu tiên #1: Triển khai UI AI Chatbot (API ✅ đã có - Gemini)
- 🔥 Ưu tiên #2: Schedule Management (0/7 endpoints - khoảng trống lớn)

**Xem nhanh**:

- Lộ trình → `06-progress-report.md` (phần 4)
- Vấn đề nghiêm trọng → `07-api-integration-summary.md`
- Kế hoạch hành động → `08-week1-action-plan.md`

## 📖 Hướng Dẫn Sử Dụng

1. **Khi bắt đầu feature mới**: Tham khảo `02-functional-requirements.md` và `04-user-stories.md`
2. **Khi review API**: Xem `07-api-integration-summary.md`
3. **Khi lập kế hoạch sprint**: Xem `06-progress-report.md` (Roadmap section)
4. **Khi implement tuần này**: Follow `08-week1-action-plan.md`

## 🔄 Cập Nhật

Các file báo cáo nên được cập nhật:

- **Progress Report**: Cuối mỗi sprint (2 tuần)
- **Action Plan**: Đầu mỗi tuần
- **Requirements**: Khi có thay đổi scope

---

**Last Updated**: 11/11/2025  
**Maintained By**: Development Team
