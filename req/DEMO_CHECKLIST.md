# ✅ DEMO CHECKLIST - BOOKMYDOCTOR

**Mục đích**: Checklist từng bước để thực hiện demo hoàn chỉnh  
**Thời gian**: 30 phút  
**Ngày demo**: **_/_**/2025

---

## 📋 PHASE 0: CHUẨN BỊ TRƯỚC DEMO (15 phút)

### Step 0.1: Kiểm tra môi trường

- [ ] **Backend đang chạy**

  ```bash
  # Test backend
  curl http://localhost:5000/swagger
  # Hoặc mở browser: http://localhost:5000/swagger
  ```

  ✅ Expected: Swagger UI hiển thị

- [ ] **Frontend đang chạy**

  ```bash
  cd d:\Clone\BookMyDoctor-FE
  npm start
  # Wait for: "Compiled successfully!"
  # Browser auto-open: http://localhost:3000
  ```

  ✅ Expected: Trang Home hiển thị

- [ ] **Database có dữ liệu mẫu**
  - Ít nhất 5 doctors
  - Ít nhất 10 patients
  - Ít nhất 20 appointments (mixed status)
  - Ít nhất 15 schedules

### Step 0.2: Tạo test accounts (nếu chưa có)

- [ ] **Patient Account**

  ```
  Username: patient_demo
  Email: patient@demo.com
  Phone: 0901234567
  Password: Patient@123
  ```

  Cách tạo: Sign Up → Verify OTP → Done

- [ ] **Doctor Account**

  ```
  Username: dr_nguyen
  Email: doctor@demo.com
  Phone: 0912345678
  Password: Doctor@123
  Department: Tim mạch
  ```

  Cách tạo: Admin create doctor

- [ ] **Admin Account**
  ```
  Username: admin_demo
  Email: admin@demo.com
  Phone: 0909999999
  Password: Admin@123
  ```
  Cách tạo: Backend seed hoặc SQL insert

### Step 0.3: Setup browsers

- [ ] Mở **Browser 1** (Chrome): Patient/Doctor demo
- [ ] Mở **Browser 2** (Firefox/Edge): Admin demo
- [ ] Clear cache và cookies trên cả 2 browsers
- [ ] Mở DevTools (F12) - Optional, để show network

### Step 0.4: Final checks

- [ ] Có internet connection (cho OTP email)
- [ ] Screen resolution: 1920x1080 (optimal)
- [ ] Close unnecessary tabs/apps
- [ ] Có nước uống 💧
- [ ] Ready to go! 🚀

---

## 🎬 PHASE 1: PATIENT FLOW (10 phút)

### ✅ SCENE 1: Registration & Login (2 phút)

#### Step 1.1: Trang chủ

- [ ] Mở http://localhost:3000
- [ ] Giới thiệu Header (logo, navigation)
- [ ] Giới thiệu Hero section
- [ ] Scroll xuống xem Doctors Carousel
- [ ] Slide qua lại (prev/next buttons)

#### Step 1.2: Sign Up (Optional - nếu có thời gian)

- [ ] Click "Sign Up" button (Header)
- [ ] Điền form:
  - [ ] Username: `demo_patient_new`
  - [ ] Email: `newpatient@demo.com`
  - [ ] Phone: `0901111111`
  - [ ] Password: `Patient@123`
  - [ ] Confirm: `Patient@123`
  - [ ] Role: `Patient`
- [ ] Submit → Redirect to OTP page
- [ ] Check email, nhập OTP (hoặc test code: 123456)
- [ ] Verify → Success → Redirect to Login

#### Step 1.3: Login

- [ ] Click "Login" button (Header)
- [ ] Điền:
  - [ ] Email/Username: `patient@demo.com`
  - [ ] Password: `Patient@123`
- [ ] Submit
- [ ] ✅ Success: Welcome message, redirect to Home
- [ ] ✅ Header shows "User menu" (avatar icon)

**💬 Talking point**: "Cookie-based authentication, secure và persistent"

---

### ✅ SCENE 2: Đặt lịch khám (4 phút)

#### Step 2.1: Navigate to Booking

- [ ] Click "Book Appointment" (navigation)
- [ ] Page loads: `/booking`
- [ ] Form hiển thị với 4 sections

#### Step 2.2: Chọn bác sĩ

- [ ] Dropdown "Select Doctor" mở ra
- [ ] List doctors hiển thị (name, department, experience)
- [ ] Chọn "Dr. Nguyen - Tim mạch"
- [ ] ✅ Doctor info appears below

#### Step 2.3: Chọn ngày

- [ ] Click Date picker
- [ ] Chọn **ngày mai** (tomorrow)
- [ ] ✅ Available time slots auto-load (spinner → slots)

**💬 Talking point**: "Real-time check available slots từ doctor's schedule"

#### Step 2.4: Chọn giờ

- [ ] Xem các slots: 08:00, 09:00, 10:00...
- [ ] Click "9:00 AM" slot
- [ ] ✅ Slot turns active (blue/highlighted)

#### Step 2.5: Điền thông tin

- [ ] Patient Name: (auto-filled - verify)
- [ ] Phone: (auto-filled - verify)
- [ ] Symptoms: `Đau ngực, khó thở khi gắng sức, mệt mỏi`
- [ ] Notes: `Gia đình có tiền sử tim mạch. Mong bác sĩ tư vấn kỹ.`

#### Step 2.6: Submit

- [ ] Click "Book Appointment" button
- [ ] Loading spinner appears
- [ ] ✅ Success toast: "Appointment booked successfully!"
- [ ] Auto-redirect to `/booking-history`

**💬 Talking point**: "Validation đầy đủ, không cho book slot đã full"

---

### ✅ SCENE 3: Booking History (3 phút)

#### Step 3.1: View appointments

- [ ] Table hiển thị với pagination
- [ ] Columns: Doctor, Date, Time, Status, Symptoms, Actions
- [ ] Status badges: Blue (Scheduled), Green (Completed), Red (Cancelled)
- [ ] Pagination: "Showing 1-10 of X items"
- [ ] ✅ Appointment vừa tạo ở đầu list

#### Step 3.2: Test filters

**Filter by Status:**

- [ ] Click "Status" dropdown
- [ ] Select "Scheduled" → Chỉ show blue badges
- [ ] Select "Completed" → Chỉ show green badges
- [ ] Select "All" → Reset

**Filter by Date:**

- [ ] Click Date picker
- [ ] Select specific date (e.g., tomorrow)
- [ ] ✅ Table shows only appointments on that date
- [ ] Clear date → Reset

**Search Doctor:**

- [ ] Type "Nguyen" in search box
- [ ] ✅ Real-time filter, show only Dr. Nguyen's appointments

#### Step 3.3: Pagination

- [ ] Click "Next" page (nếu có > 10 items)
- [ ] Page 2 loads
- [ ] Click "Previous"
- [ ] Back to page 1

#### Step 3.4: Cancel appointment (nếu > 24h)

- [ ] Find a "Scheduled" appointment > 24h away
- [ ] Click "Cancel" button
- [ ] Confirm dialog: "Are you sure?"
- [ ] Click "Yes, Cancel"
- [ ] ✅ Success toast
- [ ] ✅ Status badge → Red (Cancelled)

**⚠️ 24h Policy Demo:**

- [ ] Try cancel appointment < 24h
- [ ] ✅ Error: "Cannot cancel within 24 hours"

**💬 Talking point**: "Business rule enforcement - 24h cancel policy"

#### Step 3.5: Export Excel (if implemented)

- [ ] Click "Export to Excel" button
- [ ] ✅ File downloads: `bookings.xlsx`
- [ ] Open file → Verify data

---

### ✅ SCENE 4: Profile Management (1 phút)

#### Step 4.1: View profile

- [ ] Click User menu (avatar icon)
- [ ] Click "Profile"
- [ ] Page loads: `/profile`
- [ ] View info: Name, Email, Phone, Gender, DOB, Address

#### Step 4.2: Edit profile

- [ ] Click "Edit Profile" button
- [ ] Fields become editable
- [ ] Update:
  - [ ] Address: `123 Nguyen Hue, Q1, HCMC`
  - [ ] Phone: `0901234999`
- [ ] Click "Save Changes"
- [ ] ✅ Success toast: "Profile updated"
- [ ] ✅ UI reflects changes immediately

**💬 Talking point**: "Auto-sync với AuthContext, không cần re-login"

---

## 🎬 PHASE 2: DOCTOR FLOW (8 phút)

### ✅ SCENE 5: Doctor Dashboard (1 phút)

#### Step 5.1: Logout patient

- [ ] Click User menu → Logout
- [ ] Redirect to Home

#### Step 5.2: Login as doctor

- [ ] Click "Login"
- [ ] Email: `doctor@demo.com`
- [ ] Password: `Doctor@123`
- [ ] Submit
- [ ] ✅ Auto-redirect to `/doctor-dashboard`

#### Step 5.3: View dashboard

- [ ] Welcome message: "Welcome back, Dr. Nguyen!"
- [ ] Stats cards:
  - [ ] Today's Appointments: X
  - [ ] Pending: X
  - [ ] Completed: X
- [ ] Tabs: "Appointments" (active), "My Schedule"

**💬 Talking point**: "Role-based routing - mỗi role có dashboard riêng"

---

### ✅ SCENE 6: Manage Appointments (3 phút)

#### Step 6.1: View appointments table

- [ ] Table với pagination (10 items/page)
- [ ] Columns: Date, Time, Patient, Phone, Symptoms, Status, Actions
- [ ] Filter bar: Search, Date picker

#### Step 6.2: Search patient

- [ ] Type "Nguyen" in search box
- [ ] ✅ Real-time filter
- [ ] Results update instantly

#### Step 6.3: Filter by date

- [ ] Click Date picker
- [ ] Select tomorrow
- [ ] ✅ Show only tomorrow's appointments

#### Step 6.4: Update appointment

- [ ] Click on a "Scheduled" appointment row (or Edit icon)
- [ ] Modal/Details opens
- [ ] View: Patient name, Symptoms
- [ ] Add notes:
  - [ ] Symptoms field: `Đau ngực, khó thở`
  - [ ] Prescription: `Aspirin 100mg, 1 viên/ngày sau bữa sáng. Tái khám sau 1 tuần.`
- [ ] Change Status: `Scheduled` → `Completed`
- [ ] Click "Save"
- [ ] ✅ Success toast
- [ ] ✅ Status badge → Green
- [ ] ✅ Notes saved

**💬 Talking point**: "Doctor có thể add medical notes & prescriptions vào patient record"

---

### ✅ SCENE 7: Schedule Management (4 phút)

#### Step 7.1: Navigate to Schedule tab

- [ ] Click "My Schedule" tab
- [ ] Table loads với pagination

#### Step 7.2: View current schedules

- [ ] Columns: Date, Start Time, End Time, Status, Actions
- [ ] Date navigation: Prev/Next day buttons
- [ ] "Create Schedule" button visible

#### Step 7.3: Create new schedule

- [ ] Click "Create Schedule" button
- [ ] Modal opens với form
- [ ] Fill in:
  - [ ] Date: (date picker) → Select **2 ngày sau**
  - [ ] Start Time: `08:00`
  - [ ] End Time: `17:00`
  - [ ] Status: `Scheduled`
  - [ ] Note: `Available all day for consultations`
- [ ] Click "Save"
- [ ] ✅ Success toast: "Schedule created successfully"
- [ ] ✅ Modal closes
- [ ] ✅ New row appears in table
- [ ] ✅ Pagination adjusts

**💬 Talking point**: "Doctor tự quản lý lịch làm việc của mình"

#### Step 7.4: Edit schedule

- [ ] Click "Edit" icon on a schedule row
- [ ] Modal opens pre-filled
- [ ] Modify:
  - [ ] End Time: `17:00` → `15:00`
  - [ ] Note: `Leave early - family event`
- [ ] Click "Save"
- [ ] ✅ Success toast
- [ ] ✅ Table updates with new data

#### Step 7.5: Delete schedule

- [ ] Click "Delete" icon (trash) on a schedule
- [ ] Confirm dialog appears:
  ```
  Are you sure you want to delete this schedule?
  Date: [date]
  This action cannot be undone.
  ```
- [ ] Click "Yes, Delete"
- [ ] ✅ Success toast: "Schedule deleted"
- [ ] ✅ Row disappears
- [ ] ✅ Pagination adjusts (if needed)

#### Step 7.6: Date navigation

- [ ] Click "Next Day" button
- [ ] ✅ Table shows next day's schedules
- [ ] Click "Previous Day"
- [ ] ✅ Back to previous day

**💬 Talking point**: "Full CRUD operations với smooth UX"

---

## 🎬 PHASE 3: ADMIN FLOW (10 phút)

### ✅ SCENE 8: Admin Dashboard (1 phút)

#### Step 8.1: Switch to Browser 2 (or logout doctor)

- [ ] Logout current user
- [ ] Or switch to Browser 2

#### Step 8.2: Login as admin

- [ ] Click "Login"
- [ ] Email: `admin@demo.com`
- [ ] Password: `Admin@123`
- [ ] Submit
- [ ] ✅ Auto-redirect to `/admin-dashboard`

#### Step 8.3: View dashboard

- [ ] Welcome: "Welcome, Administrator!"
- [ ] Tabs visible:
  - [ ] Overview
  - [ ] Doctor Management
  - [ ] Patient Management
  - [ ] Schedule Management
- [ ] Stats (nếu có):
  - [ ] Total Doctors: X
  - [ ] Total Patients: X
  - [ ] Total Appointments: X

**💬 Talking point**: "Admin có quyền quản lý toàn bộ hệ thống"

---

### ✅ SCENE 9: Doctor Management (3 phút)

#### Step 9.1: Navigate to Doctors tab

- [ ] Click "Doctor Management" tab
- [ ] Table loads với pagination

#### Step 9.2: View doctors table

- [ ] Columns: Name, Email, Phone, Department, Experience, Actions
- [ ] "Create Doctor" button visible
- [ ] Pagination: 10 doctors/page

#### Step 9.3: Create new doctor

**⚠️ QUAN TRỌNG - Test validation:**

- [ ] Click "Create Doctor" button
- [ ] Modal opens với extensive form
- [ ] Fill MOST fields (bỏ trống Department):
  - [ ] Username: `dr_new_test`
  - [ ] Email: `newdoctor@demo.com`
  - [ ] Password: `Doctor@123` (auto or manual)
  - [ ] Phone: `0911223344`
  - [ ] Name: `Dr. Le Van Minh`
  - [ ] ID Card: `079123456789`
  - [ ] Gender: `Male`
  - [ ] DOB: `1985-05-15`
  - [ ] ❌ Department: (LEAVE BLANK)
  - [ ] Experience: `10`
- [ ] Click "Create Doctor"
- [ ] ✅ **VALIDATION ERROR**: "Department is required" (red text under field)

**Fix và retry:**

- [ ] Fill Department: `Nội khoa`
- [ ] Click "Create Doctor" again
- [ ] ✅ Success toast: "Doctor created successfully!"
- [ ] ✅ Modal closes
- [ ] ✅ New doctor in table
- [ ] ✅ Pagination updates

**💬 Talking point**: "Backend validation đầy đủ, Department & Experience là required fields"

#### Step 9.4: Delete doctor

- [ ] Click "Delete" icon (trash) on doctor vừa tạo
- [ ] Confirm dialog: "Are you sure?"
- [ ] Click "Yes, Delete"
- [ ] ✅ Success toast
- [ ] ✅ Row disappears

---

### ✅ SCENE 10: Patient Management (3 phút)

#### Step 10.1: Navigate to Patients tab

- [ ] Click "Patient Management" tab
- [ ] Table loads với pagination

#### Step 10.2: View patients table

- [ ] Columns: Name, Email, Phone, DOB, Gender, Address, Appointments, Actions
- [ ] Filter bar: Search, Date, Status
- [ ] "Export to Excel" button (if implemented)

#### Step 10.3: Search patient

- [ ] Type "Nguyen" in search box
- [ ] ✅ Real-time filter
- [ ] Results: all patients with "Nguyen"

#### Step 10.4: Multi-filter

- [ ] Keep "Nguyen" in search
- [ ] Select Date: Tomorrow
- [ ] Select Status: "Scheduled"
- [ ] ✅ Results: Patients named Nguyen with scheduled appointments tomorrow

**💬 Talking point**: "Filters work together với AND logic"

#### Step 10.5: View patient appointments

- [ ] Click "View" or eye icon on a patient
- [ ] Modal shows patient's appointment history
- [ ] Columns: Doctor, Date, Time, Status
- [ ] Close modal

#### Step 10.6: Export Excel (if implemented)

- [ ] Clear filters (show all)
- [ ] Click "Export to Excel"
- [ ] ✅ File downloads: `patients.xlsx`
- [ ] Open → Verify data

---

### ✅ SCENE 11: Schedule Management (3 phút)

#### Step 11.1: Navigate to Schedule tab

- [ ] Click "Schedule Management" tab
- [ ] Table loads với ALL doctors' schedules

#### Step 11.2: View all schedules

- [ ] Columns: Doctor Name, Department, Date, Start Time, End Time, Status, Actions
- [ ] Filter: Search doctor name, Date picker
- [ ] Pagination: 10/page

**💬 Talking point**: "Admin thấy tất cả schedules của tất cả doctors, không chỉ của mình"

#### Step 11.3: Search by doctor

- [ ] Type "Nguyen" in search
- [ ] ✅ Show only Dr. Nguyen's schedules

#### Step 11.4: Filter by date

- [ ] Click Date picker
- [ ] Select specific date
- [ ] ✅ Show schedules on that date only

#### Step 11.5: Delete schedule (Admin power)

- [ ] Click "Delete" icon on any schedule
- [ ] Confirm dialog:
  ```
  Are you sure you want to delete this schedule?
  Doctor: Dr. Nguyen
  Date: 2025-11-16
  This action cannot be undone.
  ```
- [ ] Click "Yes, Delete"
- [ ] ✅ Success toast
- [ ] ✅ Row disappears

**💬 Talking point**: "Admin có quyền xóa bất kỳ schedule nào - ultimate power! 🔥"

---

## 🎬 PHASE 4: ADVANCED FEATURES (2 phút)

### ✅ SCENE 12: Settings Page

#### Step 12.1: Navigate to Settings

- [ ] Login as any user (Patient/Doctor/Admin)
- [ ] Click User menu → Settings
- [ ] Page loads: `/settings`

#### Step 12.2: Account Info tab

- [ ] View current info:
  - [ ] Email, Name, Phone
  - [ ] Account Type badge (color-coded)
  - [ ] Account Status: Active
  - [ ] Member Since: [date]
- [ ] Quick actions:
  - [ ] "Edit Profile" button → Click → Redirects to `/profile`
  - [ ] Go back to Settings
  - [ ] "Logout" button → Click → Logs out (but don't logout yet)

#### Step 12.3: Preferences tab 🆕

- [ ] Click "Preferences" tab
- [ ] **Language & Region section**:
  - [ ] Language dropdown: Select "Tiếng Việt"
  - [ ] ✅ Notification: "Language changed to Tiếng Việt"
  - [ ] Switch back to "English"
  - [ ] Timezone dropdown: Select "(GMT+8) Singapore"
  - [ ] ✅ Notification: "Timezone updated to Singapore"
- [ ] **Notifications section**:
  - [ ] Email Notifications toggle: ON → OFF
    - [ ] ✅ Notification: "Email Notifications Disabled"
  - [ ] Toggle back ON
    - [ ] ✅ Notification: "Email Notifications Enabled"
  - [ ] SMS Notifications: OFF → ON
    - [ ] ✅ Notification: "SMS Notifications Enabled"
  - [ ] Appointment Reminders: Keep ON
    - [ ] ✅ All toggles work smoothly

**💬 Talking point**: "Real-time feedback cho mọi setting change"

#### Step 12.4: Change Password tab

- [ ] Click "Change Password" tab
- [ ] Fill form:
  - [ ] Current Password: `[current password]`
  - [ ] New Password: `NewPass@123`
  - [ ] Confirm: `NewPass@123`
- [ ] Click "Change Password"

**Test validation (Optional):**

- [ ] Try wrong current password → ✅ Error
- [ ] Try mismatch confirm → ✅ Error
- [ ] Success case:
  - [ ] ✅ Success notification
  - [ ] ✅ Auto-redirect to home

**💬 Talking point**: "Full validation, secure password management"

---

## 🎬 PHASE 5: ERROR HANDLING (Optional - 3 phút)

### ✅ SCENE 13: Edge Cases & Errors

#### Test 13.1: Login failed

- [ ] Try login with wrong password
- [ ] ✅ Error notification: "Invalid credentials"
- [ ] Form stays, can retry

#### Test 13.2: Booking conflict

- [ ] (Cần 2 browsers)
- [ ] Browser 1: Start booking a slot (don't submit)
- [ ] Browser 2: Book SAME slot → Submit
- [ ] Browser 1: Submit now
- [ ] ✅ Error: "Time slot no longer available"

#### Test 13.3: Validation errors

- [ ] Create Doctor without Department
- [ ] ✅ Field-level error: "Department is required"
- [ ] Fill Department → Error disappears

#### Test 13.4: Network error (Optional)

- [ ] Open DevTools → Network tab
- [ ] Set to "Offline"
- [ ] Try any action
- [ ] ✅ Error: "Network error"
- [ ] Set back to "Online"

**💬 Talking point**: "Comprehensive error handling, user-friendly messages"

---

## 📊 DEMO COMPLETION SUMMARY

### Final Checklist:

**Features Demonstrated:**

- [ ] Authentication (Login/Logout/SignUp/OTP)
- [ ] Patient Booking (Full flow)
- [ ] Booking History (Pagination, Filters, Cancel)
- [ ] Profile Management
- [ ] Doctor Appointments (View, Update, Add notes)
- [ ] Doctor Schedule (CRUD operations)
- [ ] Admin Doctor Management (Create with validation, Delete)
- [ ] Admin Patient Management (View, Search, Filter)
- [ ] Admin Schedule Management (View all, Delete)
- [ ] Settings (3 tabs: Account, Preferences, Password)
- [ ] Error Handling & Validation

**Total**: 11 major features ✅

**Metrics:**

- [ ] 36/36 core features working
- [ ] 100% critical user flows completed
- [ ] 0 blocking bugs encountered
- [ ] Smooth UX demonstrated

---

## 💡 POST-DEMO NOTES

### Feedback thu thập được:

**Positive:**

1. ***
2. ***
3. ***

**Needs Improvement:**

1. ***
2. ***
3. ***

**Feature Requests:**

1. ***
2. ***
3. ***

### Bugs discovered during demo:

1. ***
2. ***
3. ***

### Action items:

- [ ] Update `ISSUES_TRACKER.md` with bugs
- [ ] Prioritize feature requests
- [ ] Send demo recording (if recorded)
- [ ] Update `PROJECT_STATUS.md` if needed
- [ ] Schedule follow-up meeting

---

## 🎯 SUCCESS CRITERIA

Demo được coi là thành công khi:

- ✅ Tất cả critical flows hoạt động không lỗi
- ✅ Stakeholders hiểu rõ các tính năng chính
- ✅ Questions được trả lời thỏa đáng
- ✅ Positive feedback > Critical feedback
- ✅ Clear next steps được define

**Demo Completion**: **_/_**/2025 **_:_** AM/PM  
**Demo Duration**: **\_\_\_** phút  
**Audience**: ****************\_****************  
**Overall Rating**: ⭐⭐⭐⭐⭐ (circle stars)

---

**Notes:**

- In checklist này ra và tick ✅ khi thực hiện
- Hoặc dùng editor để check off [ ] → [x]
- Time yourself để improve efficiency

**Good luck! 🚀**
