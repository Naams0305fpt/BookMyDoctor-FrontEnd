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

export interface VerifyCodeRequest {
  email: string;
  code: string;
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
  DoctorName: string; // <-- Quan trọng!
  WorkDate: string; // "YYYY-MM-DD"
  StartTime: string; // "HH:mm:ss"
  EndTime: string; // "HH:mm:ss"
  Status: string; // Ví dụ: "Scheduled", "Available"...
  IsActive?: boolean; // API gốc có, thêm vào nếu cần
}
// --- KẾT THÚC THÊM MỚI ---

// --- SỬA LỖI TYPE: Thêm Name và Phone (dựa trên API 'info_slot_busy') ---
export interface ScheduleResponseItem {
  AppointHour: string; // "HH:mm:ss"
  Status: string; // "Scheduled", "Cancelled", v.v...
  Name?: string; // <-- API có trả về
  Phone?: string; // <-- API có trả về
}
// --- KẾT THÚC SỬA LỖI ---

// --- HELPER FUNCTION (Giữ nguyên) ---
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

  resetPasswordWithOtp: async (data: ResetPasswordOtpRequest): Promise<any> => {
    const response = await apiClient.post('/Auth/reset-password-otp', data);

    // Xử lý trường hợp 204 No Content hoặc data rỗng
    if (response.status === 204 || !response.data) {
      console.log("Password reset successful, empty response received.");
      return { success: true };
    }
    return response.data;
  },

  checkAuthStatus: async (): Promise<User> => {
    const response = await apiClient.get('/Auth/check-role');
    const data = response.data; // data thô từ API

    // Chuyển đổi dữ liệu API thành interface User của React (Logic này giữ nguyên)
    const user: User = {
      id: data.userId,
      name: data.username,
      userType: data.roleName.toLowerCase() as UserType, // "Patient" -> "patient"
      phone: data.phone,
      email: data.email,
      avatar: data.avatar || "/images/default-avatar.png",
    };
    return user;
  },

  getPatients: async (
    name: string,
    appointDate: string,
    status: string
  ): Promise<Patient[]> => {
    
    // Xây dựng params, chỉ gửi nếu có giá trị
    const params: any = {};
    if (name) params.name = name;
    if (appointDate) params.appointDate = appointDate;
    if (status) params.status = status;

    const response = await apiClient.get("/Patients/AllPatientsAndSearch", {
      params: params,
    });
    return response.data as Patient[];
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

  getAllSchedules: async (
    doctorSearch: string, // Giả định API hỗ trợ lọc theo tên
    date: string // Giả định API hỗ trợ lọc theo ngày "YYYY-MM-DD"
  ): Promise<Schedule[]> => {
    
    // Xây dựng params, chỉ gửi nếu có giá trị
    const params: any = {};
    if (doctorSearch) params.doctorSearch = doctorSearch; // Hoặc tên param API dùng (vd: doctorSearch)
    if (date) params.date = date;

    const response = await apiClient.get("/Schedule/List_Schedules_1_Doctor", {
      params: params,
    });
    return response.data as Schedule[];
  },

  getDoctorSchedule: async (
    doctorId: number,
    date: Date
  ): Promise<ScheduleResponseItem[]> => {
    
    const formattedDate = formatDateForAPI(date);
    
    // axios xử lý query params qua 'params' object, sạch sẽ hơn
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

