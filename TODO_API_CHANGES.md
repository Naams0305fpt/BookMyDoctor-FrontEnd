# 📋 TODO: API Changes Tracking

## ⚠️ APPOINTMENT MANAGEMENT API - Chờ Backend Implement

### **Hiện trạng:**

- Đang sử dụng API tạm: `GET /api/Patients/AllPatientsAndSearch?doctorId={id}`
- API này ban đầu thiết kế cho Patient Management, không tối ưu cho Appointment Management
- Phải gọi thêm API `/Doctors/All-Doctors` để lấy `DoctorId` từ `UserId`

### **Yêu cầu API mới từ Backend:**

#### **Endpoint đề xuất:**

```
GET /api/Appointments/GetAppointments
```

#### **Authorization:**

- `[Authorize(Roles = "R01, R02")]` (Admin + Doctor)

#### **Query Parameters:**

- `name` (optional): Tên bệnh nhân
- `appointDate` (optional): Ngày hẹn (YYYY-MM-DD)
- `status` (optional): Scheduled | Completed | Cancelled
- `doctorId` (optional): ID bác sĩ
  - **Nếu user là Doctor**: Backend tự động lọc theo doctorId từ token (không cần gửi param)
  - **Nếu user là Admin**: Có thể filter theo doctorId hoặc xem tất cả

#### **Response mẫu:**

```json
[
  {
    "AppointmentId": 123,
    "PatientId": 25,
    "PatientName": "Nguyễn Văn A",
    "PatientPhone": "0912345678",
    "PatientEmail": "patient@gmail.com",
    "PatientGender": "Male",
    "PatientDateOfBirth": "1990-01-15",
    "DoctorId": 12,
    "DoctorName": "BS. Trần Thị B",
    "Department": "Nội khoa",
    "AppointDate": "2025-11-15",
    "AppointHour": "14:00",
    "Status": "Scheduled",
    "Symptoms": "Đau đầu, sốt nhẹ",
    "Prescription": "Paracetamol 500mg x 3 lần/ngày",
    "CreatedAt": "2025-11-10T10:30:00",
    "UpdatedAt": "2025-11-10T10:30:00"
  }
]
```

### **Frontend Changes Needed (Khi BE hoàn thành):**

#### **1. Cập nhật `src/services/api.ts`:**

```typescript
// Thêm interface mới
export interface AppointmentResponse {
  AppointmentId: number;
  PatientId: number;
  PatientName: string;
  PatientPhone: string;
  PatientEmail: string;
  PatientGender: string;
  PatientDateOfBirth: string;
  DoctorId: number;
  DoctorName: string;
  Department: string;
  AppointDate: string;
  AppointHour: string;
  Status: "Scheduled" | "Completed" | "Cancelled";
  Symptoms: string;
  Prescription: string;
  CreatedAt?: string;
  UpdatedAt?: string;
}

// Thêm method mới
export const api = {
  // ... existing methods

  getAppointments: async (
    name: string,
    appointDate: string,
    status: string,
    doctorId?: number // Optional vì backend có thể tự detect từ token
  ): Promise<AppointmentResponse[]> => {
    const params: any = {};
    if (name) params.name = name;
    if (appointDate) params.appointDate = appointDate;
    if (status) params.status = status;
    if (doctorId) params.doctorId = doctorId; // Chỉ cần với Admin

    const response = await apiClient.get("/Appointments/GetAppointments", {
      params: params,
    });
    return response.data as AppointmentResponse[];
  },
};
```

#### **2. Cập nhật `src/components/doctor/AppointmentTable.tsx`:**

Tìm dòng có comment:

```typescript
// TODO: THAY ĐỔI API MỚI
```

Thay thế:

```typescript
// CŨ:
const data = await api.getPatients(name, formattedDate, status, doctorIdParam);

// MỚI:
const data = await api.getAppointments(
  name,
  formattedDate,
  status
  // Không cần gửi doctorIdParam - backend tự detect từ token
);
```

Cập nhật mapping logic nếu cần:

```typescript
const appointmentData: Appointment = {
  id: appointment.AppointmentId, // Từ response mới
  fullName: appointment.PatientName,
  dateOfBirth: new Date(appointment.PatientDateOfBirth),
  gender: appointment.PatientGender,
  phone: appointment.PatientPhone,
  appointHour: appointment.AppointHour,
  appointDate: appointment.AppointDate,
  symptom: appointment.Symptoms,
  prescription: appointment.Prescription,
  status: mapApiStatusToComponentStatus(appointment.Status),
};
```

#### **3. Loại bỏ workaround trong `checkAuthStatus`:**

Sau khi BE implement API mới với auto-detection role, có thể đơn giản hóa logic:

```typescript
// Có thể bỏ phần gọi /Doctors/All-Doctors để lấy doctorId
// Vì API mới tự động lọc theo user đang login
```

### **Lợi ích của API mới:**

✅ **Performance**: Giảm số lượng API calls (không cần gọi `/Doctors/All-Doctors`)  
✅ **Security**: Backend tự động lọc theo role, không thể bypass từ frontend  
✅ **Data structure**: Response tối ưu cho Appointment Management  
✅ **Maintainability**: Tách biệt rõ ràng Patient Management vs Appointment Management

---

**Trạng thái:** 🟡 Waiting for Backend Implementation  
**Priority:** 🔴 HIGH  
**Estimated Effort:** 2-3 hours (Backend) + 1 hour (Frontend update)

**Người phụ trách:**

- Backend: [Tên Dev Backend]
- Frontend: [Đã chuẩn bị sẵn TODO trong code]

**Deadline:** [Chưa xác định]

---

**Last Updated:** November 11, 2025
