# 🗺️ Component - API Mapping Analysis

## Tổng Quan

**Tài liệu này phân tích cấu trúc 58 components** trong dự án BookMyDoctor-FE và đề xuất API endpoints phù hợp cho từng component. Mục đích là **quản lý và đánh giá** trước khi triển khai code.

### Thống Kê

| Metric                     | Số Lượng | Ghi Chú                           |
| -------------------------- | -------- | --------------------------------- |
| **Tổng Components**        | 58       | Trong thư mục `src/components/`   |
| **Đã dùng API**            | 20       | 34% coverage                      |
| **Chưa dùng API**          | 38       | 66% chưa tích hợp                 |
| **Chỉ UI (không cần API)** | ~15      | Layout, Hero, Footer, About, etc. |
| **Cần thêm API**           | ~23      | Ưu tiên triển khai                |

### Ưu Tiên Triển Khai

| Priority  | Task                       | Components | Timeline | Status              |
| --------- | -------------------------- | ---------- | -------- | ------------------- |
| 🔴 **P0** | Schedule API (6 endpoints) | 3          | Ngày 1-3 | ⭐ URGENT           |
| 🟠 **P1** | Cancel < 24h, Export Excel | 4          | Ngày 4-5 | 📋 Planned          |
| 🟠 **P1** | Auth Refactor              | 3          | Ngày 5-7 | 📋 Planned          |
| 🟢 **P2** | Forgot Password, UI/UX     | Multiple   | Tuần 2-3 | 🔍 Research         |
| ⚪ **P3** | ChatBot (OPTIONAL)         | 1          | TBD      | ⏸️ On Hold - Chờ BE |

### Coverage API Theo Controller

| Controller   | Endpoints | Đã Dùng | Tỷ Lệ | Ghi Chú                                           | Ưu Tiên |
| ------------ | --------- | ------- | ----- | ------------------------------------------------- | ------- |
| **Schedule** | 7         | 1       | 14%   | 🔴 **CRITICAL GAP** - Chỉ có `getAllSchedules`    | 🔴 P0   |
| **Auth**     | 8         | 2       | 25%   | Login, ResetPassword, EmailVerification hoạt động | 🟠 P1   |
| **Register** | 1         | 1       | 100%  | ✅ SignUp hoạt động                               | ✅ Done |
| **Profile**  | 2         | 2       | 100%  | ✅ Profile pages sử dụng đầy đủ                   | ✅ Done |
| **Booking**  | 3         | 3       | 100%  | ✅ BookingForm và BookingHistory hoạt động        | ✅ Done |
| **Doctors**  | 3         | 3       | 100%  | ✅ DoctorsCarousel, DoctorManagement hoạt động    | ✅ Done |
| **Patients** | 4         | 4       | 100%  | ✅ PatientManagement hoạt động                    | ✅ Done |
| **Owner**    | 1         | 1       | 100%  | ✅ DoctorManagement sử dụng                       | ✅ Done |
| **Chat**     | 2         | 0       | 0%    | ⚪ **OPTIONAL** - BE đang phát triển              | ⚪ P3   |

---

## 📊 Section 1: Components Đã Dùng API (20)

### 1.1 Admin Components (4 components)

#### ✅ `admin/DoctorManagement.tsx`

**APIs đang dùng:**

- `GET /Doctors/List_All_Doctor` - Lấy danh sách bác sĩ
- `POST /Owner/Create_Doctors` - Tạo bác sĩ mới

**Trạng thái:** ✅ Hoạt động tốt

**Ghi chú:**

- Có tìm kiếm theo tên bác sĩ
- Có modal CreateDoctorModal
- Export Excel chưa triển khai (theo action plan)

---

#### ✅ `admin/PatientManagement.tsx`

**APIs đang dùng:**

- `GET /Patients/List_All_Patient` - Lấy danh sách bệnh nhân
- Các endpoints Booking: `GET /Booking/All_Bookings`, `PUT /Booking/Cancel_Booking`

**Trạng thái:** ✅ Hoạt động tốt

**Ghi chú:**

- Có date navigation và search
- Hiển thị lịch hẹn của bệnh nhân
- Export Excel chưa triển khai (theo action plan)

---

#### 🟡 `admin/ScheduleManagement.tsx`

**APIs đang dùng:**

- `GET /Schedule/List_All_Schedules_Doctors` - Lấy tất cả lịch của tất cả bác sĩ (admin view)

**APIs cần thêm:**

- `DELETE /Schedule/Delete_Schedule_Doctor` - Xóa lịch (Admin có quyền)

**Trạng thái:** 🟡 **Thiếu Delete functionality**

**Priority:** 🔴 **P0 CRITICAL** - Admin cần giám sát lịch toàn hệ thống

**Ghi chú:**

- ✅ Đã dùng List_All_Schedules_Doctors với client-side filtering
- ❌ Admin **KHÔNG THỂ** tạo/sửa lịch (theo API Authorization - chỉ R02/Doctor)
- Cần thêm Delete button (Admin có quyền xóa - R01, R02)
- Export Excel chưa triển khai
- Export Excel chưa triển khai

---

#### ✅ `admin/CreateDoctorModal.tsx`

**APIs đang dùng:**

- `POST /Owner/Create_Doctors` - Tạo bác sĩ mới

**Trạng thái:** ✅ Hoạt động tốt

**Ghi chú:**

- Modal popup để tạo doctor
- Called từ DoctorManagement

---

### 1.2 Auth Components (2 components)

#### ✅ `auth/ResetPassword.tsx`

**APIs đang dùng:**

- `POST /Auth/reset-password` - Reset mật khẩu

**Trạng thái:** ✅ Hoạt động tốt

---

#### ✅ `auth/EmailVerification.tsx`

**APIs đang dùng:**

- `POST /Auth/verify-email` - Xác thực email

**Trạng thái:** ✅ Hoạt động tốt

---

### 1.3 Booking Component (1 component)

#### ✅ `booking/BookingForm.tsx`

**APIs đang dùng:**

- `GET /Doctors/List_All_Doctor` - Lấy danh sách bác sĩ
- `GET /Schedule/available-dates` - Lấy ngày có lịch (chưa implement trong api.ts)
- `GET /Schedule/available-slots` - Lấy slot trống (chưa implement trong api.ts)
- `POST /Booking/Create_Booking` - Tạo lịch hẹn

**APIs cần thêm vào `api.ts`:**

- `GET /Schedule/available-dates` - **CRITICAL** để hiển thị calendar
- `GET /Schedule/available-slots` - **CRITICAL** để chọn giờ

**Trạng thái:** 🟡 **Thiếu 2 Schedule APIs**

**Priority:** 🔴 **HIGH** - Component chính cho patient booking

**Ghi chú:**

- Code đã sẵn sàng, chỉ thiếu Schedule endpoints trong api.ts
- Cần implement 2 endpoints còn thiếu để booking flow hoàn chỉnh

---

### 1.4 Common Component (1 component)

#### ✅ `common/DoctorsCarousel.tsx`

**APIs đang dùng:**

- `GET /Doctors/List_All_Doctor` - Lấy danh sách bác sĩ để hiển thị carousel

**Trạng thái:** ✅ Hoạt động tốt

**Ghi chú:**

- Hiển thị slider bác sĩ trên homepage
- Chỉ cần GET doctors

---

### 1.5 Doctor Components (2 components)

#### ✅ `doctor/AppointmentTable.tsx`

**APIs đang dùng:**

- `GET /Booking/List_Bookings_1_Doctor` - Lấy lịch hẹn của bác sĩ
- `PUT /Booking/Cancel_Booking` - Hủy lịch hẹn

**Trạng thái:** ✅ Hoạt động tốt

**Ghi chú:**

- Hiển thị danh sách bệnh nhân
- Có chức năng Cancel < 24h (theo action plan cần disable)

---

#### 🟡 `doctor/ScheduleManagement.tsx`

**APIs đang dùng:**

- `GET /Schedule/List_Schedules_1_Doctor` - Lấy lịch của bác sĩ

**APIs cần thêm:**

- `GET /Schedule/List_Schedules_1_Doctor` - Lấy lịch của doctor hiện tại
- `GET /Schedule/Get_Schedule_ById` - Lấy chi tiết 1 lịch để edit
- `POST /Schedule/Add_Schedule_Doctor` - Tạo lịch mới (**CHỈ R02**)
- `PUT /Schedule/Update_Schedule_Doctor` - Cập nhật lịch (**CHỈ R02**)
- `DELETE /Schedule/Delete_Schedule_Doctor` - Xóa lịch

**Trạng thái:** 🟡 **Thiếu full CRUD operations**

**Priority:** 🔴 **P0 CRITICAL** - Doctor cần tự quản lý lịch làm việc

**Ghi chú:**

- Hiện tại chỉ xem lịch (read-only), không có Create/Update/Delete UI
- Theo FR-D-005: Bác sĩ cần "thiết lập giờ làm việc và block slots"
- **Authorization:** Add/Update endpoints yêu cầu role R02 (Doctor only)
- Cần integrate ScheduleFormModal cho CRUD

---

### 1.6 Pages Components (2 components)

#### ✅ `pages/Settings.tsx`

**APIs đang dùng:**

- `PUT /Profile/Update_Profile` - Cập nhật thông tin cá nhân
- `POST /Auth/change-password` - Đổi mật khẩu

**Trạng thái:** ✅ Hoạt động tốt

**Ghi chú:**

- Settings page cho tất cả user types
- Có form đổi password và update profile

---

#### ✅ `pages/BookingHistory.tsx`

**APIs đang dùng:**

- `GET /Booking/List_Bookings_1_Patient` - Lấy lịch sử của bệnh nhân
- `PUT /Booking/Cancel_Booking` - Hủy lịch hẹn

**Trạng thái:** ✅ Hoạt động tốt

**Ghi chú:**

- Chỉ cho patient
- Hiển thị history và cho phép cancel
- Cần implement disable Cancel < 24h (theo action plan)

---

### 1.7 Profiles Components (2 components)

#### ✅ `profiles/DoctorProfile.tsx`

**APIs đang dùng:**

- `GET /Profile/profile-me` - Lấy thông tin profile
- `PUT /Profile/Update_Profile` - Cập nhật profile

**Trạng thái:** ✅ Hoạt động tốt

---

#### ✅ `profiles/PatientProfile.tsx`

**APIs đang dùng:**

- `GET /Profile/profile-me` - Lấy thông tin profile
- `PUT /Profile/Update_Profile` - Cập nhật profile

**Trạng thái:** ✅ Hoạt động tốt

---

## 📋 Section 2: Components Cần Thêm API (23)

### 2.1 Auth Components (3 components - Medium Priority)

#### 🟡 `auth/Login.tsx`

**APIs cần thêm:**

- `POST /Auth/login` - **Đã có trong backend**, chưa dùng trong component

**Trạng thái:** 🟡 Đang dùng cơ chế khác (cookie-based)

**Priority:** 🟠 **MEDIUM** - Component hoạt động nhưng nên chuẩn hóa

**Ghi chú:**

- Hiện tại Login component không import `api.ts`
- Có thể đang dùng direct axios call hoặc context
- Cần kiểm tra và chuẩn hóa với `api.ts`

---

#### 🟡 `auth/SignUp.tsx`

**APIs đang dùng (gián tiếp):**

- `POST /Register/user` - Được gọi qua AuthContext

**Trạng thái:** ✅ Hoạt động nhưng không import trực tiếp

**Priority:** 🟢 **LOW** - Refactor code structure

**Ghi chú:**

- SignUp hoạt động tốt
- Có thể refactor để import `api.ts` trực tiếp

---

#### 🔴 `auth/ForgotPassword.tsx` (Nếu có)

**APIs cần thêm:**

- `POST /Auth/forgot-password` - Request reset password link

**Trạng thái:** ❓ Chưa rõ component này có tồn tại không

**Priority:** 🟠 **MEDIUM** - Nếu có trong backend API

**Ghi chú:**

- Kiểm tra xem backend có endpoint `/Auth/forgot-password` không
- Nếu có, cần tạo component

---

### 2.2 Dashboard Components (2 components - UI only)

#### ✅ `dashboard/AdminDashboard.tsx`

**APIs:** Không cần API riêng

**Trạng thái:** ✅ Chỉ là container component

**Ghi chú:**

- Render 3 tabs: DoctorManagement, PatientManagement, ScheduleManagement
- Các child components đã có API integration

---

#### ✅ `dashboard/DoctorDashboard.tsx`

**APIs:** Không cần API riêng

**Trạng thái:** ✅ Chỉ là container component

**Ghi chú:**

- Render 2 tabs: ScheduleManagement, AppointmentTable
- Các child components đã có API integration

---

### 2.3 Layout Components (3 components - UI only)

#### ✅ `layout/Header.tsx`

**APIs:** Không cần API

**Trạng thái:** ✅ Pure UI component

**Ghi chú:**

- Navigation, logo, search bar
- Chỉ UI, không cần backend

---

#### ✅ `layout/Footer.tsx`

**APIs:** Không cần API

**Trạng thái:** ✅ Pure UI component

**Ghi chú:**

- Footer links, social icons
- Chỉ UI, không cần backend

---

#### 🟡 `layout/UserMenu.tsx`

**APIs có thể cần:**

- `POST /Auth/logout` - Đăng xuất

**Trạng thái:** 🟡 Đang dùng AuthContext

**Priority:** 🟢 **LOW** - Hoạt động tốt

**Ghi chú:**

- User dropdown menu
- Logout có thể cần API call để invalidate session
- Hiện tại dùng context, hoạt động tốt

---

### 2.4 Common Components (2 components - UI only)

#### ✅ `common/Hero.tsx`

**APIs:** Không cần API

**Trạng thái:** ✅ Pure UI component

**Ghi chú:**

- Hero section với carousel
- Chỉ UI static

---

#### ✅ `common/Notification.tsx`

**APIs:** Không cần API (hiện tại)

**APIs có thể cần trong tương lai:**

- `GET /Notifications/user-notifications` (nếu có backend)
- `PUT /Notifications/mark-as-read` (nếu có backend)

**Trạng thái:** ✅ Client-side notification component

**Priority:** 🟢 **LOW** - Chưa cần ngay

**Ghi chú:**

- Hiện tại là client notification system
- Trong tương lai có thể tích hợp server notifications

---

### 2.5 Pages Components (5 components)

#### ✅ `pages/Home.tsx`

**APIs:** Không cần API riêng

**Trạng thái:** ✅ Container component

**Ghi chú:**

- Render Hero + DoctorsCarousel + BookingForm (cho patient)
- Render Dashboard (cho admin/doctor)
- Các child components đã có API

---

#### ✅ `pages/About.tsx`

**APIs:** Không cần API

**Trạng thái:** ✅ Static content page

**Ghi chú:**

- Trang giới thiệu
- Chỉ UI static

---

#### ✅ `pages/Information.tsx`

**APIs:** Không cần API (nếu static)

**APIs có thể cần:**

- `GET /CMS/information` (nếu content dynamic)

**Trạng thái:** ✅ Giả định là static content

**Priority:** 🟢 **LOW**

**Ghi chú:**

- Nếu content cần quản trị, cần CMS API
- Hiện tại giả định là static

---

#### ✅ `pages/Demo.tsx`

**APIs:** Không cần API

**Trạng thái:** ✅ Demo/Testing page

**Ghi chú:**

- Page để demo login các user types
- Chỉ để testing

---

#### ✅ `pages/Profile.tsx`

**APIs:** Không cần API riêng

**Trạng thái:** ✅ Router component

**Ghi chú:**

- Render AdminProfile/DoctorProfile/PatientProfile theo userType
- Các profile components đã có API

---

### 2.6 Profiles Component (1 component)

#### ✅ `profiles/AdminProfile.tsx`

**APIs đang dùng (giả định):**

- `GET /Profile/profile-me` - Lấy thông tin admin
- `PUT /Profile/Update_Profile` - Cập nhật profile

**Trạng thái:** ✅ Giống PatientProfile và DoctorProfile

**Ghi chú:**

- Cần confirm component này có tồn tại không
- Nếu có, sử dụng Profile APIs

---

### 2.7 Optional Feature: Chat/ChatBot (0 components - OPTIONAL)

#### ⚪ `common/ChatBot.tsx` (CHƯA CÓ - OPTIONAL)

**APIs cần implement:**

- `POST /Chat/send-message` - Gửi tin nhắn
- `GET /Chat/chat-history` - Lấy lịch sử chat

**Trạng thái:** ⚪ **OPTIONAL FEATURE** - Backend đang phát triển

**Priority:** ⚪ **P3 - OPTIONAL** - Chờ Backend hoàn thiện

**Ghi chú:**

- Backend Chat API đang trong quá trình phát triển
- Chưa có timeline cụ thể
- 6 intents dự kiến: Booking, Cancel, Doctor Search, FAQ, Schedule, Contact
- **Không triển khai cho đến khi Backend sẵn sàng**

**Action Items (Khi Backend sẵn sàng):**

1. Tạo component `common/ChatBot.tsx`
2. Implement 2 Chat APIs trong `api.ts`:
   ```typescript
   sendChatMessage: async (message: string) => {
     return await apiClient.post("/Chat/send-message", { message });
   },
   getChatHistory: async (userId?: string) => {
     return await apiClient.get("/Chat/chat-history", {
       params: { userId }
     });
   }
   ```
3. Test 6 intents
4. Mobile responsive design

---

## 🎯 Section 3: Tổng Hợp Components Chỉ UI (15)

Các components sau **KHÔNG CẦN** API integration:

| #   | Component                       | Loại             | Ghi Chú                    |
| --- | ------------------------------- | ---------------- | -------------------------- |
| 1   | `layout/Header.tsx`             | Layout           | Navigation UI              |
| 2   | `layout/Footer.tsx`             | Layout           | Footer UI                  |
| 3   | `common/Hero.tsx`               | Hero             | Carousel UI                |
| 4   | `common/Notification.tsx`       | Utility          | Client notification        |
| 5   | `pages/Home.tsx`                | Container        | Render child components    |
| 6   | `pages/About.tsx`               | Static           | Giới thiệu                 |
| 7   | `pages/Information.tsx`         | Static           | Thông tin (giả định)       |
| 8   | `pages/Demo.tsx`                | Testing          | Demo page                  |
| 9   | `pages/Profile.tsx`             | Router           | Profile router             |
| 10  | `dashboard/AdminDashboard.tsx`  | Container        | Tab container              |
| 11  | `dashboard/DoctorDashboard.tsx` | Container        | Tab container              |
| 12  | `auth/Login.tsx`                | Auth (special)   | Dùng context               |
| 13  | `auth/SignUp.tsx`               | Auth (special)   | Dùng context               |
| 14  | `layout/UserMenu.tsx`           | Layout (special) | Dùng context               |
| 15  | `admin/CreateDoctorModal.tsx`   | Modal            | Called từ DoctorManagement |

---

## 📈 Section 4: Đề Xuất Ưu Tiên Triển Khai

### 🔴 Priority 0 (P0): CRITICAL - Tuần Này (Ngày 1-3)

#### 1. **Schedule API Full Implementation** ⭐ QUAN TRỌNG NHẤT

**Ảnh hưởng:** 3 components (admin/ScheduleManagement, doctor/ScheduleManagement, booking/BookingForm)

**Lý do ưu tiên cao nhất:**

- ❌ BookingForm không thể hoàn chỉnh booking flow (thiếu available-dates/slots)
- ❌ ScheduleManagement chỉ READ, không có CREATE/UPDATE/DELETE
- ❌ Vi phạm Functional Requirements (FR-D-005)
- ✅ Backend API đã sẵn sàng (đã verify 7 endpoints)

**APIs cần thêm vào `api.ts`:**

```typescript
// Schedule Controller - 6 endpoints còn thiếu

// 1. Lấy tất cả lịch (admin view)
getAllSchedules: async (doctorName?: string, date?: string) => {
  const params = new URLSearchParams();
  if (doctorName) params.append("doctorName", doctorName);
  if (date) params.append("date", date);
  return await apiClient.get(`/Schedule/AllSchedules?${params}`);
},

// 2. Tạo lịch mới (doctor/admin)
createSchedule: async (scheduleData: CreateScheduleRequest) => {
  return await apiClient.post("/Schedule/Create_Schedules", scheduleData);
},

// 3. Cập nhật lịch (doctor/admin)
updateSchedule: async (scheduleId: string, scheduleData: UpdateScheduleRequest) => {
  return await apiClient.put(`/Schedule/UpdateSchedule`, scheduleData);
},

// 4. Xóa lịch (doctor/admin)
deleteSchedule: async (scheduleId: string) => {
  return await apiClient.delete(`/Schedule/DeleteSchedule?scheduleId=${scheduleId}`);
},

// 5. Lấy ngày có lịch (patient booking) - CRITICAL cho BookingForm
getAvailableDates: async (doctorId: string) => {
  return await apiClient.get(`/Schedule/available-dates?doctorId=${doctorId}`);
},

// 6. Lấy slot trống (patient booking) - CRITICAL cho BookingForm
getAvailableSlots: async (doctorId: string, date: string) => {
  return await apiClient.get(`/Schedule/available-slots?doctorId=${doctorId}&date=${date}`);
}
```

**Timeline:** Ngày 1-3 (Tuần này)

**Impact:**

- ✅ BookingForm: Hoàn thiện booking flow (available-dates, available-slots)
- ✅ ScheduleManagement (admin): View All + Delete only (theo API Authorization)
- ✅ ScheduleManagement (doctor): Full CRUD cho lịch của mình (R02 required)
- ✅ API Coverage: 55% → 76% (+21%)

**Checklist:**

- [ ] Define TypeScript interfaces (CreateScheduleRequest, UpdateScheduleRequest)
- [ ] Implement 6 endpoints trong `api.ts`
- [ ] Update `booking/BookingForm.tsx` (available-dates, available-slots)
- [ ] Update `admin/ScheduleManagement.tsx` (CRUD buttons + modals)
- [ ] Update `doctor/ScheduleManagement.tsx` (CRUD buttons + modals)
- [ ] End-to-end testing

---

### 🟠 Priority 1 (P1): HIGH - Tuần Sau (Ngày 4-7)

#### 2. **Cancel Booking Logic < 24h**

**Ảnh hưởng:** 2 components (BookingHistory, AppointmentTable)

**Lý do ưu tiên:**

- Business rule quan trọng
- Tránh cancel last-minute
- Theo action plan Ngày 4

**Action Items:**

- [ ] Disable Cancel button nếu appointment < 24h
- [ ] Hiển thị warning message rõ ràng
- [ ] Update UI state trong `pages/BookingHistory.tsx`
- [ ] Update UI state trong `doctor/AppointmentTable.tsx`

**Timeline:** Ngày 4

**Impact:**

- ✅ Tuân thủ business rules
- ✅ UX tốt hơn (warning rõ ràng)

---

#### 3. **Export Excel Feature**

**Ảnh hưởng:** 2 components (DoctorManagement, PatientManagement)

**Lý do ưu tiên:**

- Admin cần export data để báo cáo
- Theo action plan Ngày 4

**Action Items:**

- [ ] Install xlsx library (`npm install xlsx`)
- [ ] Thêm Export button trong `admin/DoctorManagement.tsx`
- [ ] Thêm Export button trong `admin/PatientManagement.tsx`
- [ ] Implement client-side export function
- [ ] Test với data thực

**Timeline:** Ngày 4-5

**Impact:**

- ✅ Admin có thể export báo cáo
- ✅ Tiện lợi cho quản lý data

---

#### 4. **Chuẩn Hóa Auth Flow**

**Ảnh hưởng:** 3 components (Login, SignUp, UserMenu)

**Lý do ưu tiên:**

- Code structure consistency
- Dễ maintain

**Action Items:**

- [ ] Kiểm tra `auth/Login.tsx` có import `api.ts` không
- [ ] Chuẩn hóa login flow với `POST /Auth/login`
- [ ] Implement logout API call trong `layout/UserMenu.tsx` (nếu cần)
- [ ] Refactor SignUp để import `api.ts` trực tiếp

**Timeline:** Ngày 5-7

**Impact:**

- ✅ Code dễ đọc, dễ maintain
- ✅ Consistency trong codebase

---

### 🟢 Priority 2 (P2): MEDIUM - Tuần 2-3

#### 5. **Forgot Password Flow**

**Ảnh hưởng:** 1 component mới (auth/ForgotPassword.tsx)

**Action Items:**

- [ ] Kiểm tra backend có endpoint `/Auth/forgot-password` không
- [ ] Nếu có, tạo component `auth/ForgotPassword.tsx`
- [ ] Implement UI flow (email input → send link)
- [ ] Link với ResetPassword component

**Timeline:** Tuần 2

---

#### 6. **UI/UX Improvements**

**Ảnh hưởng:** Multiple components

**Action Items:**

- [ ] Loading states cho tất cả API calls
- [ ] Error handling improvements
- [ ] Success notifications
- [ ] Mobile responsive checks

**Timeline:** Tuần 2-3

---

### ⚪ Priority 3 (P3): OPTIONAL - Chờ Backend

#### 7. **ChatBot Component & API Integration** (OPTIONAL)

**Ảnh hưởng:** Tính năng mới hoàn toàn

**Trạng thái:** ⚪ Backend Chat API đang phát triển

**Lý do OPTIONAL:**

- Backend chưa sẵn sàng
- Không có timeline cụ thể
- Không block các tính năng chính

**Action Items (Khi Backend sẵn sàng):**

- [ ] Confirm Chat API endpoints hoàn thiện
- [ ] Tạo component `common/ChatBot.tsx`
- [ ] Implement 2 Chat APIs trong `api.ts`
- [ ] Test 6 intents (Booking, Cancel, Search, FAQ, Schedule, Contact)
- [ ] Mobile responsive design
- [ ] Integrate vào Layout (floating button?)

**Timeline:** TBD - Chờ Backend team

---

### 🎯 Tóm Tắt Ưu Tiên

| Priority  | Task            | Timeline            | API Endpoints   | Components   | Status      |
| --------- | --------------- | ------------------- | --------------- | ------------ | ----------- |
| 🔴 **P0** | Schedule API    | Tuần này (Ngày 1-3) | +6 endpoints    | 3 components | 🔄 Urgent   |
| 🟠 **P1** | Cancel < 24h    | Ngày 4              | 0 (logic only)  | 2 components | 📋 Planned  |
| 🟠 **P1** | Export Excel    | Ngày 4-5            | 0 (client-side) | 2 components | 📋 Planned  |
| 🟠 **P1** | Auth Refactor   | Ngày 5-7            | 0 (refactor)    | 3 components | 📋 Planned  |
| 🟢 **P2** | Forgot Password | Tuần 2              | +1 endpoint (?) | 1 component  | 🔍 Research |
| 🟢 **P2** | UI/UX Improve   | Tuần 2-3            | 0 (UI only)     | Multiple     | 🔍 Research |
| ⚪ **P3** | ChatBot         | TBD                 | +2 endpoints    | 1 component  | ⏸️ On Hold  |

---

## 🔍 Section 5: Schedule API Gap Analysis

### Hiện Trạng

**Trong `src/services/api.ts`:**

```typescript
// ✅ ĐÃ CÓ (1/7)
getAllSchedules: async (doctorName?: string, date?: string) => {
  // Gọi /Schedule/List_Schedules_1_Doctor
};
```

### Đã có và cần thêm

| #   | Endpoint                               | Method | Authorization | Mục Đích                | Component Cần             | Status  |
| --- | -------------------------------------- | ------ | ------------- | ----------------------- | ------------------------- | ------- |
| 1   | `/Schedule/List_All_Schedules_Doctors` | GET    | R01, R02      | Lấy tất cả lịch (admin) | admin/ScheduleManagement  | ✅ Done |
| 2   | `/Schedule/List_Schedules_1_Doctor`    | GET    | R01, R02      | Lịch của 1 bác sĩ       | doctor/ScheduleManagement | ⏳ TODO |
| 3   | `/Schedule/Get_Schedule_ById`          | GET    | R01, R02      | Chi tiết 1 lịch         | Edit modal                | ✅ Done |
| 4   | `/Schedule/Add_Schedule_Doctor`        | POST   | **R02 ONLY**  | Tạo lịch mới            | doctor/ScheduleManagement | ✅ Done |
| 5   | `/Schedule/Update_Schedule_Doctor`     | PUT    | **R02 ONLY**  | Cập nhật lịch           | doctor/ScheduleManagement | ✅ Done |
| 6   | `/Schedule/Delete_Schedule_Doctor`     | DELETE | R01, R02      | Xóa lịch                | admin + doctor            | ✅ Done |
| 7   | `/Booking/info_slot_busy`              | GET    | Public        | Slot bận của bác sĩ     | booking/BookingForm       | ✅ Done |

### Impact Analysis

**Nếu không bổ sung:**

1. ❌ ScheduleManagement (admin) không có Delete function
2. ❌ ScheduleManagement (doctor) không thể tự quản lý lịch (thiếu CRUD UI)
3. ❌ Vi phạm FR-D-005: "Thiết lập giờ làm việc và block slots"

**Sau khi bổ sung đầy đủ:**

1. ✅ Admin xem và xóa lịch (giám sát toàn hệ thống) - **R01**
2. ✅ Doctor full CRUD cho lịch của mình - **R02 ONLY**
3. ✅ Booking flow đã hoàn chỉnh (dùng info_slot_busy)
4. ✅ Đáp ứng functional requirements đầy đủ
5. ✅ API compliance: 65% → 84% (6 endpoints mới)

---

## 📝 Section 6: Action Items Summary

### Week 1 (Ngày 1-5 - Theo Action Plan)

#### ✅ Ngày 1 (Đã hoàn thành)

- [x] Verify 31 API endpoints
- [x] Update `api.ts` nếu cần
- [x] Test SignUp flow
- [x] Tạo file component-API mapping analysis

#### 🔄 Ngày 2-3 (80% HOÀN THÀNH - P0 CRITICAL)

**Focus: Schedule API Implementation** ⭐

- [x] Define TypeScript interfaces (AddScheduleRequest, UpdateScheduleRequest, ScheduleDetailResponse)
- [x] Implement 5 Schedule endpoints trong `api.ts` (getAllSchedulesForAdmin, getScheduleById, addSchedule, updateSchedule, deleteSchedule)
- [x] Update `admin/ScheduleManagement.tsx` - Dùng getAllSchedulesForAdmin với client-side filtering
- [x] Create `ScheduleFormModal.tsx` + CSS với role check (R02 only)
- [ ] Add Delete button vào `admin/ScheduleManagement.tsx`
- [ ] Update `doctor/ScheduleManagement.tsx` - Full CRUD với modal
- [ ] Test với doctor account (R02)

#### 📋 Ngày 4 (P1 - Kế hoạch)

- [ ] Update `admin/ScheduleManagement.tsx` (CRUD buttons + modals)
- [ ] Update `doctor/ScheduleManagement.tsx` (CRUD buttons + modals)
- [ ] Disable Cancel button < 24h trong `BookingHistory.tsx`
- [ ] Disable Cancel button < 24h trong `AppointmentTable.tsx`
- [ ] Warning message cho Cancel restrictions
- [ ] Export Excel trong `DoctorManagement.tsx`
- [ ] Export Excel trong `PatientManagement.tsx`

#### 📋 Ngày 5-7 (P1 - Kế hoạch)

- [ ] Chuẩn hóa Auth flow (Login, SignUp, UserMenu)
- [ ] Full testing Schedule CRUD operations
- [ ] Code review và cleanup

---

### Week 2-3 (Schedule Full Integration) - 80% HOÀN THÀNH

#### Schedule API Implementation

- [x] Define TypeScript interfaces (AddScheduleRequest, UpdateScheduleRequest, ScheduleDetailResponse)
- [x] Implement 5 Schedule endpoints trong `api.ts`
- [ ] Update `admin/ScheduleManagement.tsx`:
  - [x] Dùng getAllSchedulesForAdmin API
  - [x] Client-side filtering
  - ~~Add Create button~~ (**ADMIN KHÔNG CÓ QUYỀN**)
  - ~~Add Edit button~~ (**ADMIN KHÔNG CÓ QUYỀN**)
  - [ ] Add Delete button + confirmation (Admin có quyền - R01, R02)
- [ ] Update `doctor/ScheduleManagement.tsx`:
  - [ ] Dùng List_Schedules_1_Doctor API
  - [ ] Add Create button + ScheduleFormModal (**R02 ONLY**)
  - [ ] Add Edit button + ScheduleFormModal (**R02 ONLY**)
  - [ ] Add Delete button + confirmation
  - [ ] Test CRUD operations với doctor account
- [x] `booking/BookingForm.tsx` đã hoàn chỉnh (dùng info_slot_busy)

---

## 🎯 Kết Luận

### Thống Kê Cuối Cùng

| Danh Mục               | Số Lượng | Ghi Chú                  |
| ---------------------- | -------- | ------------------------ |
| **Tổng Components**    | 58       |                          |
| **Đã hoàn thiện API**  | 17       | 29% hoàn toàn tích hợp   |
| **Cần bổ sung API**    | 3        | Schedule x2, BookingForm |
| **Chỉ UI (không cần)** | 15       | 26% pure UI              |
| **Missing Feature**    | 1        | ChatBot component        |
| **Chuẩn hóa/Refactor** | 3        | Login, SignUp, UserMenu  |

### API Coverage sau khi hoàn thiện

| Controller       | Before      | After       | Improvement | Note                        |
| ---------------- | ----------- | ----------- | ----------- | --------------------------- |
| Schedule         | 14% (1/7)   | 100% (7/7)  | +86%        | P0 - Tuần này               |
| Auth             | 25% (2/8)   | 50% (4/8)   | +25%        | P1 - Tuần sau               |
| Chat             | 0% (0/2)    | 0% (0/2)    | 0%          | P3 - Optional, chờ BE       |
| **TOTAL**        | 55% (17/31) | 81% (25/31) | +26%        | Không tính Chat             |
| **TOTAL (Full)** | 55% (17/31) | 87% (27/31) | +32%        | Nếu tính cả Chat (optional) |

### Next Steps - Ưu Tiên Theo Thứ Tự

1. **🔴 TUẦN NÀY (Ngày 1-3) - P0 CRITICAL:**

   - ⭐ Bổ sung 6 Schedule APIs vào `api.ts`
   - ⭐ Test Schedule integration trong 3 components
   - ⭐ Booking flow hoàn chỉnh (available-dates/slots)
   - **Mục tiêu:** API Coverage 55% → 76%

2. **🟠 TUẦN NÀY (Ngày 4-5) - P1 HIGH:**

   - Cancel booking restrictions (< 24h)
   - Export Excel cho 2 admin pages
   - **Mục tiêu:** Business rules compliance

3. **🟠 TUẦN SAU (Ngày 5-7) - P1 HIGH:**

   - Chuẩn hóa Auth flow
   - Code review và testing
   - **Mục tiêu:** Code quality improvement

4. **🟢 TUẦN 2-3 - P2 MEDIUM:**

   - Forgot Password flow (nếu BE có)
   - UI/UX improvements
   - **Mục tiêu:** Enhanced UX

5. **⚪ TBD - P3 OPTIONAL:**
   - ChatBot component (chờ Backend sẵn sàng)
   - **Điều kiện:** Backend Chat API hoàn thiện

---

**Tài liệu tạo:** 11 Nov 2025  
**Phiên bản:** 1.1  
**Trạng thái:** Ready for implementation  
**Ghi chú:** ChatBot được chuyển sang OPTIONAL (P3) - Chờ Backend phát triển xong
