# 📋 DANH SÁCH TOÀN BỘ API ENDPOINTS - BOOKMYDOCTOR

> **Project**: BookMyDoctor_WebAPI  
> **Framework**: .NET 8  
> **Base URL**: `http://localhost:7243` (development) / `https://doctorcare.id.vn` (production)

---

## 📑 MỤC LỤC

1. [Auth Controller](#1-auth-controller) - 8 endpoints
2. [Register Controller](#2-register-controller) - 1 endpoint
3. [Profile Controller](#3-profile-controller) - 2 endpoints
4. [Booking Controller](#4-booking-controller) - 3 endpoints
5. [Doctor Controller](#5-doctors-controller) - 3 endpoints
6. [Patient Controller](#6-patients-controller) - 4 endpoints
7. [Schedule Controller](#7-schedule-controller) - 7 endpoints
8. [Owner Controller](#8-owner-controller) - 1 endpoint
9. [Chat Controller](#9-chat-controller) - 2 endpoints

**Tổng cộng**: **31 API Endpoints**

---

## 1. AUTH CONTROLLER

**Base Route**: `/api/Auth`

### 1.1. **POST** `/api/Auth/login`

- **Chức năng**: Đăng nhập hệ thống
- **Authorization**: `[AllowAnonymous]`
- **Request Body**:

```json
{
  "username": "string",
  "password": "string"
}
```

- **Response 200 OK**:

```json
{
  "message": "Đăng nhập thành công!"
}
```

- **Side Effect**: Set `HttpOnly Cookie` (expires 30 phút)

---

### 1.2. **POST** `/api/Auth/logout`

- **Chức năng**: Đăng xuất (xóa session cookie)
- **Authorization**: `[Authorize]` ✅
- **Response**: `204 No Content`

---

### 1.3. **POST** `/api/Auth/change-password`

- **Chức năng**: Đổi mật khẩu (khi đã đăng nhập)
- **Authorization**: `[Authorize]` ✅
- **Request Body**:

```json
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmNewPassword": "string"
}
```

- **Response**: `204 No Content`

---

### 1.4. **POST** `/api/Auth/request-otp`

- **Chức năng**: Gửi mã OTP qua email (reset password)
- **Authorization**: `[AllowAnonymous]`
- **Request Body**:

```json
{
  "destination": "email@example.com",
  "purpose": "RESET_PASSWORD",
  "channel": "EMAIL"
}
```

- **Response 200 OK**:

```json
{
  "message": "Mã OTP đã được gửi."
}
```

---

### 1.5. **POST** `/api/Auth/verify-otp`

- **Chức năng**: Xác thực mã OTP
- **Authorization**: `[AllowAnonymous]`
- **Request Body**:

```json
{
  "destination": "email@example.com",
  "otpCode": "123456",
  "purpose": "RESET_PASSWORD",
  "channel": "EMAIL"
}
```

- **Response 200 OK**:

```json
{
  "message": "Xác thực OTP thành công."
}
```

- **Side Effect**: Set `HttpOnly Cookie` chứa `otp_token` (10 phút)

---

### 1.6. **POST** `/api/Auth/change-password-otp`

- **Chức năng**: Đổi mật khẩu bằng OTP token
- **Authorization**: `[AllowAnonymous]`
- **Request Body**:

```json
{
  "otpToken": "string (optional - tự lấy từ cookie)",
  "newPassword": "string",
  "confirmNewPassword": "string"
}
```

- **Response 200 OK**:

```json
{
  "message": "Đổi mật khẩu thành công."
}
```

- **Lưu ý**: Backend tự động lấy `otpToken` từ cookie nếu không truyền trong body

---

### 1.7. **GET** `/api/Auth/check-role`

- **Chức năng**: Kiểm tra role của user hiện tại
- **Authorization**: `[Authorize]` ✅
- **Response 200 OK**:

```json
{
  "userId": "1",
  "username": "admin",
  "roleId": "R01",
  "roleName": "Admin"
}
```

---

### 1.8. **GET** `/api/Auth/unauthorized`

- **Chức năng**: Endpoint 401 redirect
- **Authorization**: `[AllowAnonymous]`
- **Response 401**:

```json
{
  "field": "auth",
  "message": "Bạn chưa đăng nhập hoặc phiên đã hết hạn."
}
```

---

## 2. REGISTER CONTROLLER

**Base Route**: `/api/Register`

### 2.1. **POST** `/api/Register/user`

- **Chức năng**: Đăng ký tài khoản mới (Patient)
- **Authorization**: `[AllowAnonymous]`
- **Request Body**:

```json
{
  "username": "user01",
  "password": "Password@123",
  "confirmPassword": "Password@123",
  "email": "user01@gmail.com",
  "phone": "0912345678"
}
```

- **Validation Rules**:

  - `username`: 4-100 ký tự, chỉ chữ, số, gạch dưới
  - `password`: 8-100 ký tự
  - `confirmPassword`: phải trùng `password`
  - `email` (optional): chỉ chấp nhận `@gmail.com`, đúng quy tắc Gmail
  - `phone` (optional): 9-15 chữ số

- **Response 201 Created**:

```json
{
  "userId": 15,
  "username": "user01",
  "email": "user01@gmail.com",
  "phone": "0912345678",
  "roleId": "R03",
  "message": "Đăng ký thành công."
}
```

- **Error Responses**:

```json
// 409 Conflict
{ "field": "username", "message": "Tên đăng nhập đã tồn tại." }
{ "field": "email", "message": "Email đã tồn tại." }
{ "field": "phone", "message": "Số điện thoại đã tồn tại." }

// 400 Bad Request
{ "field": "username", "message": "Tên đăng nhập phải từ 4–100 ký tự." }
{ "field": "password", "message": "Mật khẩu phải từ 8–100 ký tự." }
{ "field": "confirmPassword", "message": "Mật khẩu xác nhận không trùng khớp." }
{ "field": "email", "message": "Chỉ chấp nhận email đuôi @gmail.com." }
```

---

## 3. PROFILE CONTROLLER

**Base Route**: `/api/Profile`

### 3.1. **GET** `/api/Profile/profile-me`

- **Chức năng**: Lấy thông tin profile của user hiện tại
- **Authorization**: `[Authorize]` ✅
- **Response 200 OK** (Patient):

```json
{
  "userId": 15,
  "username": "patient01",
  "roleId": "R03",
  "patientId": 10,
  "name": "Nguyễn Văn A",
  "phone": "0912345678",
  "email": "patient@gmail.com",
  "gender": "Male",
  "dateOfBirth": "1990-01-15",
  "address": "123 Đường ABC, Quận 1, TP.HCM"
}
```

- **Response 200 OK** (Doctor):

```json
{
  "userId": 25,
  "username": "doctor01",
  "roleId": "R02",
  "doctorId": 12,
  "name": "BS. Trần Thị B",
  "phone": "0987654321",
  "email": "doctor@gmail.com",
  "gender": "Female",
  "dateOfBirth": "1985-05-20",
  "department": "Nội khoa",
  "experienceYears": 10,
  "identification": "012345678901"
}
```

---

### 3.2. **PUT** `/api/Profile/Update_Profile_Me`

- **Chức năng**: Cập nhật thông tin profile
- **Authorization**: `[Authorize]` ✅
- **Request Body** (Patient):

```json
{
  "name": "Nguyễn Văn A Updated",
  "phone": "0912345678",
  "email": "newemail@gmail.com",
  "gender": "Male",
  "dateOfBirth": "1990-01-15",
  "address": "456 Đường DEF, Quận 2, TP.HCM"
}
```

- **Request Body** (Doctor):

```json
{
  "name": "BS. Trần Thị B",
  "phone": "0987654321",
  "email": "doctor@gmail.com",
  "gender": "Female",
  "dateOfBirth": "1985-05-20",
  "department": "Nội khoa",
  "experienceYears": 12
}
```

- **Response 200 OK**:

```json
{
  "message": "Cập nhật profile thành công."
}
```

---

## 4. BOOKING CONTROLLER

**Base Route**: `/api/Booking`

### 4.1. **POST** `/api/Booking/public`

- **Chức năng**: Đặt lịch khám (không cần đăng nhập)
- **Authorization**: `[AllowAnonymous]`
- **Request Body**:

```json
{
  "fullName": "Nguyễn Văn A",
  "phone": "0912345678",
  "email": "patient@gmail.com",
  "appointDate": "2025-11-15",
  "doctorId": 12,
  "appointHour": "14:00",
  "gender": "Male",
  "dateOfBirth": "1990-01-01",
  "symptom": "Đau đầu, chóng mặt"
}
```

- **Response 200 OK**:

```json
{
  "AppointmentId": 101,
  "DoctorName": "BS. Trần Thị B",
  "Date": "2025-11-15",
  "AppointHour": "14:00",
  "Message": "Đặt lịch thành công"
}
```

- **Error Responses**:

```json
// 409 Conflict
{ "message": "Khung giờ này vừa có người đặt. Vui lòng chọn giờ khác." }

// 404 Not Found
{ "message": "Không tìm thấy bác sĩ." }
```

---

### 4.2. **GET** `/api/Booking/info_slot_busy`

- **Chức năng**: Lấy danh sách giờ đã đặt của bác sĩ
- **Authorization**: `[AllowAnonymous]`
- **Query Parameters**:

  - `doctorId` (required): ID bác sĩ
  - `date` (required): Ngày (YYYY-MM-DD)

- **Request Example**:

```
GET /api/Booking/info_slot_busy?doctorId=12&date=2025-11-15
```

- **Response 200 OK**:

```json
[
  { "AppointHour": "08:00" },
  { "AppointHour": "09:00" },
  { "AppointHour": "14:00" }
]
```

---

### 4.3. **DELETE** `/api/Booking/cancel/{bookingId}`

- **Chức năng**: Hủy lịch hẹn
- **Authorization**: `[Authorize]` ✅
- **Path Parameter**: `bookingId` (integer)

- **Request Example**:

```
DELETE /api/Booking/cancel/101
```

- **Response 200 OK**:

```json
{
  "message": "Cancelled."
}
```

- **Error 404**:

```json
{
  "message": "Không tìm thấy lịch hẹn."
}
```

---

## 5. DOCTORS CONTROLLER

**Base Route**: `/api/Doctors`

### 5.1. **GET** `/api/Doctors/All-Doctors`

- **Chức năng**: Lấy danh sách tất cả bác sĩ
- **Authorization**: `[AllowAnonymous]`
- **Response 200 OK**:

```json
[
  {
    "DoctorId": 12,
    "UserId": 25,
    "Name": "BS. Trần Thị B",
    "Phone": "0987654321",
    "Email": "doctor@gmail.com",
    "Gender": "Female",
    "DateOfBirth": "1985-05-20",
    "Department": "Nội khoa",
    "Experience_year": 10,
    "Identification": "012345678901",
    "IsActive": true
  }
]
```

---

### 5.2. **GET** `/api/Doctors/Search-Doctors`

- **Chức năng**: Tìm kiếm bác sĩ theo nhiều tiêu chí
- **Authorization**: `[AllowAnonymous]`
- **Query Parameters** (all optional):

  - `name`: Tên bác sĩ (partial match)
  - `department`: Chuyên khoa (LIKE)
  - `gender`: Giới tính
  - `phone`: Số điện thoại (partial)
  - `workDate`: Ngày làm việc (DateTime)

- **Request Example**:

```
GET /api/Doctors/Search-Doctors?department=Nội khoa&workDate=2025-11-15
```

- **Response 200 OK**:

```json
[
  {
    "DoctorId": 12,
    "Name": "BS. Nguyễn Văn A",
    "Department": "Nội khoa",
    "Phone": "0912345678",
    "Email": "doctor@gmail.com",
    "Experience_year": 10,
    "Schedules": [
      {
        "ScheduleId": 101,
        "WorkDate": "2025-11-15",
        "StartTime": "08:00",
        "EndTime": "17:00",
        "Status": "Scheduled"
      }
    ]
  }
]
```

- **Error 404**:

```json
{
  "message": "Không tìm thấy bác sĩ phù hợp với tiêu chí tìm kiếm."
}
```

---

### 5.3. **DELETE** `/api/Doctors/DeleteDoctor`

- **Chức năng**: Xóa bác sĩ (Admin only)
- **Authorization**: `[Authorize(Roles = "R01")]` 🔒
- **Query Parameter**: `id` (integer)

- **Request Example**:

```
DELETE /api/Doctors/DeleteDoctor?id=15
```

- **Response 200 OK**:

```json
{
  "message": "Xóa bác sĩ thành công."
}
```

- **Error 409 Conflict**:

```json
{
  "message": "Bác sĩ còn lịch hẹn chưa diễn ra. Hủy/di chuyển lịch trước khi xóa."
}
```

---

## 6. PATIENTS CONTROLLER

**Base Route**: `/api/Patients`

### 6.1. **GET** `/api/Patients/AllPatientsAndSearch`

- **Chức năng**: Lấy danh sách bệnh nhân (có filter)
- **Authorization**: `[Authorize(Roles = "R01, R02")]` 🔒 Admin/Doctor only
- **Query Parameters** (all optional):

  - `name`: Tên bệnh nhân
  - `appointDate`: Ngày hẹn (DateTime)
  - `status`: Trạng thái (Scheduled/Completed/Cancelled)
  - `doctorId`: Lọc theo bác sĩ

- **Request Example**:

```
GET /api/Patients/AllPatientsAndSearch?doctorId=12&status=Scheduled
```

- **Response 200 OK**:

```json
[
  {
    "FullName": "Nguyễn Văn E",
    "Username": "patient01",
    "DateOfBirth": "1995-08-20",
    "Gender": "Male",
    "PhoneNumber": "0934567890",
    "Email": "patient@gmail.com",
    "Address": "123 Đường ABC, Quận 1, TP.HCM",
    "Status": "Scheduled",
    "Symptoms": "Đau đầu, sốt nhẹ",
    "Prescription": "Paracetamol 500mg x 3 lần/ngày",
    "AppointDate": "2025-11-15",
    "AppointHour": "14:00",
    "DoctorId": 12
  }
]
```

- **Error 404**:

```json
{
  "message": "Không tìm thấy bệnh nhân nào."
}
```

---

### 6.2. **GET** `/api/Patients/MyHistoryAppoint`

- **Chức năng**: Lịch sử khám bệnh của Patient hiện tại
- **Authorization**: `[Authorize(Roles = "R03")]` 🔒 Patient only
- **Lưu ý**: Tự động lấy `userId` từ token

- **Response 200 OK**:

```json
[
  {
    "NamePatient": "Nguyễn Văn E",
    "NameDoctor": "BS. Trần Thị B",
    "PhoneDoctor": "0987654321",
    "Department": "Nội khoa",
    "AppointHour": "14:00",
    "AppointDate": "2025-11-15",
    "Status": "Completed",
    "Symptoms": "Đau đầu",
    "Prescription": "Paracetamol 500mg x 3 lần/ngày"
  }
]
```

- **Error 404**:

```json
{
  "message": "Không có bệnh nhân nào thuộc tài khoản này."
}
```

---

### 6.3. **PUT** `/api/Patients/UpdateAppointment`

- **Chức năng**: Cập nhật trạng thái, triệu chứng và đơn thuốc của lịch hẹn
- **Authorization**: `[Authorize(Roles = "R02")]` 🔒 Doctor only
- **Query Parameters**:

  - `patientId` (required): integer
  - `appointDate` (required): string (YYYY-MM-DD)
  - `appointHour` (required): string (HH:mm)
  - `appointId` (required): integer

- **Request Body**:

```json
{
  "Status": "Completed",
  "Symptoms": "Đau đầu kéo dài, buồn nôn",
  "Prescription": "Paracetamol 500mg, uống 3 lần/ngày sau ăn"
}
```

**Giá trị Status hợp lệ**: `"Scheduled"`, `"Completed"`, `"Cancelled"`

- **Request Example**:

```
PUT /api/Patients/UpdateAppointment?patientId=25&appointDate=2025-11-15&appointHour=14:00&appointId=123
Content-Type: application/json

{
  "Status": "Completed",
  "Symptoms": "Đau đầu kéo dài, buồn nôn",
  "Prescription": "Paracetamol 500mg, uống 3 lần/ngày sau ăn"
}
```

- **Response 200 OK**:

```json
{
  "message": "Cập nhật triệu chứng và toa thuốc thành công."
}
```

---

### 6.4. **DELETE** `/api/Patients/DeletePatient`

- **Chức năng**: Xóa bệnh nhân (soft delete)
- **Authorization**: `[Authorize(Roles = "R01")]` 🔒 Admin only
- **Query Parameter**: `id` (integer)

- **Request Example**:

```
DELETE /api/Patients/DeletePatient?id=25
```

- **Response 200 OK**:

```json
{
  "message": "Xóa bệnh nhân thành công."
}
```

---

## 7. SCHEDULE CONTROLLER

**Base Route**: `/api/Schedule`

### 7.1. **GET** `/api/Schedule/List_All_Schedules_Doctors`

- **Chức năng**: Lấy tất cả lịch làm việc của tất cả bác sĩ
- **Authorization**: `[AllowAnonymous]`
- **Response 200 OK**:

```json
[
  {
    "ScheduleId": 101,
    "DoctorId": 12,
    "WorkDate": "2025-11-15",
    "StartTime": "08:00",
    "EndTime": "17:00",
    "Status": "Scheduled",
    "IsActive": true
  }
]
```

- **Error 404**:

```json
{
  "message": "Không có lịch làm việc nào được tìm thấy."
}
```

---

### 7.2. **GET** `/api/Schedule/List_Schedules_1_Doctor`

- **Chức năng**: Lấy lịch làm việc của 1 bác sĩ (có filter)
- **Authorization**: `[AllowAnonymous]`
- **Query Parameters** (optional):

  - `doctorName`: Tên bác sĩ
  - `date`: Ngày cụ thể (DateOnly)

- **Request Example**:

```
GET /api/Schedule/List_Schedules_1_Doctor?doctorName=Trần Thị B&date=2025-11-15
```

- **Response 200 OK**:

```json
[
  {
    "ScheduleId": 101,
    "DoctorId": 12,
    "DoctorName": "BS. Trần Thị B",
    "WorkDate": "2025-11-15",
    "StartTime": "08:00",
    "EndTime": "17:00",
    "Status": "Scheduled",
    "IsActive": true
  }
]
```

---

### 7.3. **GET** `/api/Schedule/Get_Schedule_ById`

- **Chức năng**: Lấy chi tiết lịch làm việc theo ID
- **Authorization**: `[AllowAnonymous]`
- **Query Parameter**: `scheduleId` (required)

- **Request Example**:

```
GET /api/Schedule/Get_Schedule_ById?scheduleId=101
```

- **Response 200 OK**:

```json
{
  "ScheduleId": 101,
  "DoctorId": 12,
  "WorkDate": "2025-11-15",
  "StartTime": "08:00",
  "EndTime": "17:00",
  "Status": "Scheduled",
  "IsActive": true
}
```

- **Error 404**:

```json
{
  "message": "Schedule not found."
}
```

---

### 7.4. **POST** `/api/Schedule/Add_Schedule_Doctor`

- **Chức năng**: Thêm lịch làm việc mới
- **Authorization**: `[Authorize(Roles = "R02")]` 🔒 Doctor only
- **Request Body**:

```json
{
  "DoctorId": 12,
  "WorkDate": "2025-11-20",
  "StartTime": "08:00",
  "EndTime": "17:00",
  "Status": "Scheduled"
}
```

- **Response 201 Created**:

```json
{
  "ScheduleId": 150,
  "DoctorId": 12,
  "WorkDate": "2025-11-20",
  "StartTime": "08:00",
  "EndTime": "17:00",
  "Status": "Scheduled",
  "IsActive": true
}
```

- **Error 409 Conflict**:

```json
{
  "message": "Lịch làm việc đã tồn tại cho ngày này."
}
```

---

### 7.5. **PUT** `/api/Schedule/Update_Schedule_Doctor`

- **Chức năng**: Cập nhật lịch làm việc
- **Authorization**: `[Authorize(Roles = "R02")]` 🔒 Doctor only
- **Request Body**:

```json
{
  "ScheduleId": 101,
  "DoctorId": 12,
  "WorkDate": "2025-11-15",
  "StartTime": "09:00",
  "EndTime": "16:00",
  "Status": "Scheduled"
}
```

- **Response**: `204 No Content`

- **Error 404**:

```json
{
  "message": "Schedule not found."
}
```

---

### 7.6. **DELETE** `/api/Schedule/Delete_Schedule_Doctor`

- **Chức năng**: Xóa lịch làm việc
- **Authorization**: `[Authorize(Roles = "R01, R02")]` 🔒 Admin/Doctor
- **Query Parameter**: `scheduleId` (required)

- **Request Example**:

```
DELETE /api/Schedule/Delete_Schedule_Doctor?scheduleId=101
```

- **Response 200 OK**:

```json
{
  "message": "Xóa lịch thành công."
}
```

- **Error 404**:

```json
{
  "message": "Schedule not found."
}
```

---

## 8. OWNER CONTROLLER

**Base Route**: `/api/Owner`

### 8.1. **POST** `/api/Owner/create-doctor`

- **Chức năng**: Tạo tài khoản bác sĩ (Admin only)
- **Authorization**: `[Authorize(Roles = "R01")]` 🔒 Admin only
- **Request Body**:

```json
{
  "username": "doctor01",
  "password": "Password@123",
  "email": "doctor@gmail.com",
  "phone": "0987654321",
  "name": "BS. Trần Văn C",
  "gender": "Male",
  "dateOfBirth": "1985-05-20",
  "department": "Nội khoa",
  "experienceYears": 10,
  "identification": "012345678901"
}
```

- **Response 200 OK**:

```json
{
  "message": "Doctor account created successfully."
}
```

- **Auto-Generated**:

  1. Tạo `User` với role `R02` (Doctor)
  2. Hash password (SHA512 + Salt)
  3. Tạo `Doctor` record
  4. Tạo lịch làm việc mặc định (T2-T7, 08:00-17:00, 1 tuần)

- **Error Responses**:

```json
// 400 Bad Request
{ "message": "Username already exists." }
{ "message": "Email already in use." }
{ "message": "Phone number already in use." }
```

---

## 9. CHAT CONTROLLER

**Base Route**: `/api/Chat`

### 9.1. **POST** `/api/Chat`

- **Chức năng**: Xử lý tin nhắn chatbot (Gemini AI)
- **Authorization**: `[AllowAnonymous]`
- **Request Body**:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Tìm bác sĩ khoa Nội"
    }
  ]
}
```

- **Response 200 OK**:

```json
{
  "Reply": "Mình tìm được vài bác sĩ phù hợp:\n• BS. Nguyễn Văn A – Nội khoa (ID 12)\n• BS. Trần Thị B – Nội khoa (ID 15)\n\nBạn muốn xem giờ trống của bác sĩ nào và ngày nào (YYYY-MM-DD)?"
}
```

- **Supported Intents**:

  1. **SearchDoctors**: Tìm bác sĩ
  2. **GetBusySlots**: Xem giờ trống
  3. **CreatePublicBooking**: Đặt lịch
  4. **CancelBooking**: Hủy lịch
  5. **Faq**: Câu hỏi thường gặp
  6. **GreetingHelp**: Chào hỏi

- **Error 502 Bad Gateway**:

```json
{
  "message": "Xin lỗi, dịch vụ AI đang lỗi. Bạn thử lại sau nhé."
}
```

---

### 9.2. **GET** `/api/Chat/ping`

- **Chức năng**: Health check endpoint
- **Authorization**: `[AllowAnonymous]`
- **Response 200 OK**:

```json
{
  "ok": true,
  "svc": "chat",
  "time": "2025-01-15T10:30:00Z"
}
```

---

## 🔑 ROLE PERMISSIONS MATRIX

| Role        | RoleId | Controllers            | Permissions                                         |
| ----------- | ------ | ---------------------- | --------------------------------------------------- |
| **Admin**   | R01    | All                    | Full access (tạo doctor, xóa patient, xóa schedule) |
| **Doctor**  | R02    | Patients, Schedules    | Xem/cập nhật bệnh nhân, quản lý lịch làm việc       |
| **Patient** | R03    | Booking, Profile, Auth | Đặt lịch, xem lịch sử cá nhân, cập nhật profile     |

---

## 📝 LƯU Ý KỸ THUẬT

### 1. **Base URLs**

- **Development**: `http://localhost:7243`
- **Production**: `https://doctorcare.id.vn`

### 2. **Authentication**

- **Method**: Cookie-based (HttpOnly + Secure)
- **Cookie Name**: `bmd_auth`
- **Expires**: 30 minutes (auto-refresh on activity)

### 3. **Error Response Format**

```json
{
  "field": "fieldName",
  "message": "Error message in Vietnamese"
}
```

### 4. **HTTP Status Codes**

- `200`: Success
- `201`: Created
- `204`: No Content (success, no response body)
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict (business rule violation)
- `500`: Internal Server Error
- `502`: Bad Gateway (external service error)

### 5. **Date/Time Formats**

- **Date**: `YYYY-MM-DD` (DateOnly)
- **Time**: `HH:mm` (TimeOnly)
- **DateTime**: ISO 8601 format

### 6. **CORS Policy**

```
Allowed Origins:
  - https://doctorcare.id.vn
  - http://26.240.106.147:3000
  - http://localhost:3000

AllowCredentials: true
AllowAnyHeader: true
AllowAnyMethod: true
```

### 7. **Swagger Documentation**

- **URL**: `/swagger`
- **Version**: Swashbuckle.AspNetCore 6.6.2

### 8. **Background Jobs (Hangfire)**

- **Dashboard**: `/hangfire`
- **Recurring Job**: `generate-monthly-schedule` (Cron.Monthly)

---

## 📊 TỔNG KẾT

| Controller | Số Endpoints | Authorization | Chức năng chính               |
| ---------- | ------------ | ------------- | ----------------------------- |
| Auth       | 8            | Mixed         | Login, OTP, Password Reset    |
| Register   | 1            | Anonymous     | User Registration             |
| Profile    | 2            | Authorize     | View/Update Profile           |
| Booking    | 3            | Mixed         | Book Appointment, Check Slots |
| Doctors    | 3            | Mixed         | Search, Delete Doctor         |
| Patients   | 4            | Admin/Doctor  | Manage Patient Records        |
| Schedule   | 7            | Mixed         | Manage Doctor Schedules       |
| Owner      | 1            | Admin         | Create Doctor Account         |
| Chat       | 2            | Anonymous     | AI Chatbot                    |

**Tổng cộng**: **31 API Endpoints**

---

**Last Updated**: 2025-01-15  
**API Version**: 1.0.0  
**Maintained by**: BookMyDoctor Development Team
