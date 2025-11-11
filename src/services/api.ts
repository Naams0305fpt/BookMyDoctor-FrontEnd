import axios, { AxiosError } from 'axios';
import config from '../config';
import { User, UserType } from '../contexts/AuthContext';

const API_BASE_URL = config.apiBaseUrl;

// --- CÁC INTERFACE (Giữ nguyên) ---
export interface RegisterRequest {
  Username: string;
  Password: string;
  ConfirmPassword: string;
  Email: string;
  Phone: string;
}

export interface LoginRequest {
  UsernameOrPhoneOrEmail: string;
  Password: string;
}

export interface SendVerificationCodeRequest {
  email: string;
}

// export interface VerifyCodeRequest {
//   email: string;
//   code: string;
// }
export interface VerifyOtpRequest {
  Destination: string; // Email
  Purpose: string;     // "ResetPassword"
  OtpCode: string;
  Channel: string;     // "email"
}

export interface ChangePasswordOtpRequest {
  NewPassword: string;
  ConfirmNewPassword: string;
}

export interface ChangePasswordRequest {
  CurrentPassword: string;
  NewPassword: string;
  ConfirmNewPassword: string;
}

export interface SetNewPasswordRequest {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RequestOtpRequest {
  Destination: string; // Email address
  Purpose: string; // e.g., "ResetPassword"
  Channel: string; // Should be "email"
}

export interface ResetPasswordOtpRequest {
  Destination: string; // Email address
  Purpose: string; // e.g., "ResetPassword"
  OtpCode: string; // The 6-digit code
  NewPassword: string;
  ConfirmNewPassword: string;
}

export interface BookingRequest {
  FullName: string;
  Phone: string;
  Email: string;
  Date: string; // "YYYY-MM-DD"
  DoctorId: number;
  AppointHour: string; // "HH:mm"
  Gender: string;
  DateOfBirth: string; // "YYYY-MM-DD"
  Symptom: string;
}

export interface Patient {
  id?: number; // ID có thể không có trong mọi response, nhưng hữu ích
  FullName: string;
  Username: string;
  DateOfBirth: string; // "YYYY-MM-DD"
  Gender: string;
  PhoneNumber: string;
  Email?: string;
  Address: string;
  AppointDate: string; // "YYYY-MM-DD"
  Status: "Completed" | "Scheduled" | "Cancelled";
  Symptoms: string;
  Prescription: string;
  AppointHour?: string;
}

// --- THÊM MỚI: Interface cho API GetDoctorAppointments ---
export interface DoctorAppointment {
  AppointId: number;
  DoctorId: number;
  PatientId: number;
  FullName: string;
  Username: string;
  DateOfBirth: string; // "YYYY-MM-DD"
  Gender: string;
  PhoneNumber: string;
  Email: string;
  Address: string | null;
  Status: "Scheduled" | "Completed" | "Cancelled";
  Symptoms: string;
  Prescription: string | null;
  AppointDate: string; // "YYYY-MM-DD"
  AppointHour: string; // "HH:mm:ss"
}

export interface UpdatePatientRequest {
  Status: string;
  Symptoms: string;
  Prescription: string;
} 

// --- THÊM MỚI: Interface cho API History (dựa trên ảnh) ---
export interface MyHistoryResponse {
  NamePatient: string;
  NameDoctor: string;
  PhoneDoctor: string;
  Department: string;
  AppointHour: string; // "HH:mm:ss"
  AppointDate: string; // "YYYY-MM-DD"
  Status: string; // "Scheduled", "Completed", "Cancelled"
  Symptoms: string;
  Prescription: string;
  // QUAN TRỌNG: API cần trả về một ID duy nhất
  BookingId?: number; 
}
// --- KẾT THÚC THÊM MỚI ---
export interface Doctor {
  DoctorId: number;
  UserId: number;
  Name: string;
  Gender: string;
  DateOfBirth: string;
  Identification: string;
  Phone: string;
  Email: string;
  Address: string;
  Department: string;
  Experience_year: number;
  Image: string | null;
  IsActive: boolean;
}

export interface CreateDoctorRequest {
  Username: string;
  Password: string;
  Phone: string;
  Email: string;
  Name: string;
  Gender: string;
  DateOfBirth: string; // "YYYY-MM-DD"
  Identification: string;
  Department: string;
  ExperienceYears: number; 
}

// --- THAY ĐỔI: INTERFACE CHO SCHEDULE (TỪ API MỚI) ---
export interface Schedule {
  ScheduleId?: number; // API gốc có vẻ không trả về, nhưng có thể hữu ích
  DoctorId: number;
  DoctorName?: string; // Optional vì API List_All_Schedules_Doctors không trả về
  WorkDate: string; // "YYYY-MM-DD"
  StartTime: string; // "HH:mm:ss"
  EndTime: string; // "HH:mm:ss"
  Status: string; // Ví dụ: "Scheduled", "Available"...
  IsActive?: boolean; // API gốc có, thêm vào nếu cần
}
// --- KẾT THÚC THÊM MỚI ---

// --- SCHEDULE REQUEST/RESPONSE INTERFACES ---
// Dựa trên API Documentation:
// POST /api/Schedule/Add_Schedule_Doctor
export interface AddScheduleRequest {
  DoctorId: number;
  WorkDate: string; // "YYYY-MM-DD"
  StartTime: string; // "HH:mm" (e.g. "08:00")
  EndTime: string; // "HH:mm" (e.g. "17:00")
  Status: string; // "Scheduled", "Available", etc.
}

// PUT /api/Schedule/Update_Schedule_Doctor
export interface UpdateScheduleRequest {
  ScheduleId: number;
  DoctorId: number;
  WorkDate: string; // "YYYY-MM-DD"
  StartTime: string; // "HH:mm"
  EndTime: string; // "HH:mm"
  Status: string;
}

// Response 201 Created từ Add_Schedule_Doctor
export interface AddScheduleResponse {
  ScheduleId: number;
  DoctorId: number;
  WorkDate: string;
  StartTime: string;
  EndTime: string;
  Status: string;
  IsActive: boolean;
}

// GET /api/Schedule/Get_Schedule_ById Response
export interface ScheduleDetailResponse {
  ScheduleId: number;
  DoctorId: number;
  WorkDate: string;
  StartTime: string;
  EndTime: string;
  Status: string;
  IsActive: boolean;
}
// --- KẾT THÚC SCHEDULE INTERFACES ---

// --- SỬA LỖI TYPE: Thêm Name và Phone (dựa trên API 'info_slot_busy') ---
export interface ScheduleResponseItem {
  AppointHour: string; // "HH:mm:ss"
  Status: string; // "Scheduled", "Cancelled", v.v...
  Name?: string; // <-- API có trả về
  Phone?: string; // <-- API có trả về
}
// --- KẾT THÚC SỬA LỖI ---// --- HELPER FUNCTION (Giữ nguyên) ---
export const formatDateForAPI = (date: Date | null): string => {
  // Trả về chuỗi rỗng nếu date là null hoặc undefined
  if (!date) return ""; 

  // Phần còn lại giữ nguyên
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// --- AXIOS INSTANCE ---
// Tạo một instance axios đã được cấu hình sẵn
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Đây là cách axios thay thế cho 'credentials: include'
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- AXIOS ERROR INTERCEPTOR ---
// Tự động bắt và chuẩn hóa lỗi từ API
apiClient.interceptors.response.use(
  (response) => response, // Trả về response nếu thành công (status 2xx)
  (error: AxiosError) => {
    // Xử lý lỗi nếu thất bại (status không phải 2xx)
    let errorMessage = 'An unexpected error occurred';

    if (error.response) {
      // Server đã trả về lỗi
      const errorData = error.response.data as { message?: string; title?: string };

      if (typeof error.response.data === 'string' && error.response.data) {
        errorMessage = error.response.data;
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.title) { // Dành cho lỗi validation của .NET Core
        errorMessage = errorData.title;
      }
    } else if (error.request) {
      // Request đã được gửi nhưng không nhận được phản hồi (lỗi mạng)
      errorMessage = 'Network error or server is not responding';
    } else {
      // Lỗi xảy ra khi thiết lập request
      errorMessage = error.message;
    }

    console.error('API Error:', errorMessage, error);
    // Ném ra lỗi đã được chuẩn hóa, AuthContext sẽ bắt lỗi này
    return Promise.reject(new Error(errorMessage));
  }
);

// --- API OBJECT (Sử dụng apiClient) ---
export const api = {
  // axios tự động trả về response.data
  // axios tự động stringify 'data' cho body
  // 'withCredentials' đã được set trong apiClient
  // Interceptor đã xử lý lỗi
  
  login: async (data: LoginRequest) => {
    const response = await apiClient.post('/Auth/login', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/Auth/logout');
  },

  register: async (data: RegisterRequest) => {
    const response = await apiClient.post('/Register/user', data);
    return response.data;
  },

  sendVerificationCode: async (data: RequestOtpRequest) => {
    const response = await apiClient.post('/Auth/request-otp', data);
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<{ message: string }> => {
    // API này sẽ set cookie và trả về message
    const response = await apiClient.post<{ message: string }>("/Auth/verify-otp", data);
    return response.data;
  },

  // resetPasswordWithOtp: async (data: ResetPasswordOtpRequest): Promise<any> => {
  //   const response = await apiClient.post('/Auth/reset-password-otp', data);

  //   // Xử lý trường hợp 204 No Content hoặc data rỗng
  //   if (response.status === 204 || !response.data) {
  //     console.log("Password reset successful, empty response received.");
  //     return { success: true };
  //   }
  //   return response.data;
  // },

  changePasswordWithOtp: async (data: ChangePasswordOtpRequest): Promise<any> => {
    // API này đọc cookie, chỉ cần gửi mật khẩu mới
    const response = await apiClient.post("/Auth/change-password-otp", data);
    
    if (response.status === 204 || !response.data) {
      return { success: true };
    }
    return response.data;
  },

  changePasswordAfterLogin: async (data: ChangePasswordRequest): Promise<any> => {
    // API để đổi password khi đã login (cần old password)
    const response = await apiClient.post("/Auth/change-password", data);
    
    if (response.status === 204 || !response.data) {
      return { success: true };
    }
    return response.data;
  },

  checkAuthStatus: async (): Promise<User> => {
    // Lấy role info
    const roleResponse = await apiClient.get('/Auth/check-role');
    const roleData = roleResponse.data;

    // Lấy profile info để có thông tin cơ bản
    const profileResponse = await apiClient.get('/Profile/profile-me');
    const profileData = profileResponse.data;

    // Nếu là doctor, cần lấy doctorId từ API All-Doctors
    let doctorId: number | undefined = undefined;
    if (roleData.roleName === "Doctor") {
      try {
        const doctorsResponse = await apiClient.get('/Doctors/All-Doctors');
        const doctors = doctorsResponse.data;
        // Tìm doctor có UserId trùng với user hiện tại
        const currentDoctor = doctors.find((doc: any) => doc.UserId === profileData.UserId);
        if (currentDoctor) {
          doctorId = currentDoctor.DoctorId;
        } else {
          console.warn("⚠️ Doctor not found in All-Doctors list for UserId:", profileData.UserId);
        }
      } catch (err) {
        console.error("❌ Failed to fetch doctors list:", err);
      }
    }

    // Chuyển đổi dữ liệu API thành interface User của React
    const user: User = {
      id: roleData.userId,
      name: profileData.Name || roleData.username,
      userType: roleData.roleName.toLowerCase() as UserType, // "Admin"/"Doctor"/"Patient" -> lowercase
      phone: profileData.Phone,
      email: profileData.Email,
      avatar: "/images/default-avatar.png",
      doctorId: doctorId, // Lấy từ API All-Doctors
      patientId: profileData.PatientId, // Có với patient (PascalCase)
    };

    return user;
  },

  getPatients: async (
    name: string,
    appointDate: string,
    status: string,
    doctorId?: number // Thêm optional doctorId parameter
  ): Promise<Patient[]> => {
    
    // Xây dựng params, chỉ gửi nếu có giá trị
    const params: any = {};
    if (name) params.name = name;
    if (appointDate) params.appointDate = appointDate;
    if (status) params.status = status;
    if (doctorId) params.doctorId = doctorId; // Thêm doctorId nếu có

    const response = await apiClient.get("/Patients/AllPatientsAndSearch", {
      params: params,
    });
    
    return response.data as Patient[];
  },

  // --- THÊM MỚI: API chuyên dụng cho Doctor Appointments ---
  getDoctorAppointments: async (
    doctorId?: number,
    patientName?: string,
    patientPhone?: string
  ): Promise<DoctorAppointment[]> => {
    const params: any = {};
    if (doctorId) params.doctorId = doctorId;
    if (patientName) params.patientName = patientName;
    if (patientPhone) params.patientPhone = patientPhone;

    const response = await apiClient.get("/Doctors/GetDoctorAppointments", {
      params: params,
    });

    return response.data as DoctorAppointment[];
  },

  updatePatientAppointment: async (
    patientId: number,
    appointDate: string,
    appointHour: string,
    appointId: number,
    data: UpdatePatientRequest
  ): Promise<UpdatePatientRequest> => {
    
    // API yêu cầu đầy đủ 4 params
    const params = {
      patientId: patientId,
      appointDate: appointDate,
      appointHour: appointHour,
      appointId: appointId,
    };
    
    // API yêu cầu gửi 3 trường này trong Request Body
    const body = {
      Status: data.Status,
      Symptoms: data.Symptoms,
      Prescription: data.Prescription,
    };

    const response = await apiClient.put("/Patients/UpdatePatient", body, {
      params: params
    });

    return response.data;
  },

  // --- THÊM MỚI: LẤY LỊCH SỬ CỦA BỆNH NHÂN ---
  getMyHistory: async (): Promise<MyHistoryResponse[]> => {
    const response = await apiClient.get(`/Patients/MyHistoryAppoint`);
    return response.data;
  },

  // --- THÊM MỚI: LẤY THÔNG TIN PROFILE ---
  // --- THÊM MỚI: LẤY THÔNG TIN PROFILE ---
  getProfileMe: async (): Promise<any> => {
    const response = await apiClient.get('/Profile/profile-me');
    return response.data;
  },

  // --- THÊM MỚI: CẬP NHẬT PROFILE ---
  updateProfileMe: async (data: {
    name?: string;
    phone?: string;
    email?: string;
    gender?: string;
    dateOfBirth?: string;
    address?: string;
    department?: string;
    experienceYears?: number;
  }): Promise<any> => {
    const response = await apiClient.put('/Profile/Update_Profile_Me', data);
    return response.data;
  },

  // --- THÊM MỚI: HÀM TẠO BÁC SĨ ---
  createDoctor: async (data: CreateDoctorRequest): Promise<any> => { 
    const response = await apiClient.post("/Owner/create-doctor", data);
    return response.data;
  },
  // --- KẾT THÚC THÊM MỚI ---

  getDoctors: async (): Promise<Doctor[]> => {
    const response = await apiClient.get<Doctor[]>('/Doctors/All-Doctors');
    return response.data;
  },

  deleteDoctor: async (id: number): Promise<any> => {
    // API của bạn dùng query param 'id'
    const response = await apiClient.delete("/Doctors/DeleteDoctor", {
      params: { id: id },
    });
    return response.data; // Trả về data (thường là rỗng hoặc 200 OK)
  },

  // --- SCHEDULE APIs ---
  
  // Lấy lịch 1 bác sĩ (có filter theo tên và ngày)
  // GET /api/Schedule/List_Schedules_1_Doctor
  getAllSchedules: async (
    doctorName?: string, // Query param: doctorName
    date?: string // Query param: date "YYYY-MM-DD"
  ): Promise<Schedule[]> => {
    const params: any = {};
    if (doctorName) params.doctorName = doctorName;
    if (date) params.date = date;

    const response = await apiClient.get("/Schedule/List_Schedules_1_Doctor", {
      params: params,
    });
    return response.data as Schedule[];
  },

  // Lấy tất cả lịch của tất cả bác sĩ (Admin view)
  // GET /api/Schedule/List_All_Schedules_Doctors
  getAllSchedulesForAdmin: async (): Promise<Schedule[]> => {
    const response = await apiClient.get("/Schedule/List_All_Schedules_Doctors");
    return response.data as Schedule[];
  },

  // Lấy chi tiết 1 lịch theo ID
  // GET /api/Schedule/Get_Schedule_ById?scheduleId={id}
  getScheduleById: async (scheduleId: number): Promise<ScheduleDetailResponse> => {
    const response = await apiClient.get("/Schedule/Get_Schedule_ById", {
      params: { scheduleId }
    });
    return response.data as ScheduleDetailResponse;
  },

  // Tạo lịch mới (Doctor/Admin)
  // POST /api/Schedule/Add_Schedule_Doctor
  // Authorize: R02 (Doctor)
  addSchedule: async (data: AddScheduleRequest): Promise<AddScheduleResponse> => {
    const response = await apiClient.post("/Schedule/Add_Schedule_Doctor", data);
    return response.data as AddScheduleResponse;
  },

  // Cập nhật lịch (Doctor/Admin)
  // PUT /api/Schedule/Update_Schedule_Doctor
  // Authorize: R02 (Doctor)
  updateSchedule: async (data: UpdateScheduleRequest): Promise<void> => {
    // Response: 204 No Content
    await apiClient.put("/Schedule/Update_Schedule_Doctor", data);
  },

  // Xóa lịch (Doctor/Admin)
  // DELETE /api/Schedule/Delete_Schedule_Doctor?scheduleId={id}
  // Authorize: R01 (Admin), R02 (Doctor)
  deleteSchedule: async (scheduleId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete("/Schedule/Delete_Schedule_Doctor", {
      params: { scheduleId }
    });
    return response.data;
  },

  // Lấy giờ đã đặt của bác sĩ (BookingForm)
  // GET /api/Booking/info_slot_busy?doctorId={id}&date={YYYY-MM-DD}
  getDoctorSchedule: async (
    doctorId: number,
    date: Date
  ): Promise<ScheduleResponseItem[]> => {
    const formattedDate = formatDateForAPI(date);
    
    const response = await apiClient.get<ScheduleResponseItem[]>('/booking/info_slot_busy', {
      params: {
        doctorId: doctorId,
        date: formattedDate
      }
    });
    return response.data;
  },

  submitBooking: async (data: BookingRequest) => {
    const response = await apiClient.post('/booking/public', data);
    return response.data;
  },
  
};

