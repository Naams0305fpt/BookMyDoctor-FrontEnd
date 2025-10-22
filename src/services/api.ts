import config from '../config';

const API_BASE_URL = config.apiBaseUrl;

export interface RegisterRequest {
  username: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface SendVerificationCodeRequest {
  email: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
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

export interface ScheduleResponseItem {
  appointHour: string; // "HH:mm:ss"
  status: string;      // "Scheduled", "Cancelled", v.v...
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
  Image: string | null; // Giả định Image là string URL hoặc null
  IsActive: boolean;
}

export interface ScheduleResponseItem {
  AppointHour: string; // "HH:mm:ss"
  Status: string;      // "Scheduled", "Cancelled", v.v...
  // Các trường khác không cần định nghĩa vì ta không dùng
}

export const formatDateForAPI = (date: Date): string => {
  if (!date) return ""; 

  // Lấy năm, tháng, ngày dựa trên múi giờ địa phương
  const year = date.getFullYear();
  
  // getMonth() trả về từ 0-11, nên phải +1
  // .padStart(2, '0') để đảm bảo (tháng 9 -> "09")
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
  
  const day = date.getDate().toString().padStart(2, '0');

  // Ghép lại đúng định dạng YYYY-MM-DD
  return `${year}-${month}-${day}`;
};

export const api = {
  login: async (data: LoginRequest) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (data: RegisterRequest) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  sendVerificationCode: async (data: SendVerificationCodeRequest) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Auth/request-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send verification code');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Send verification code error:', error);
      throw error;
    }
  },

  verifyCode: async (data: VerifyCodeRequest) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Auth/reset-password-api`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid verification code');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Verify code error:', error);
      throw error;
    }
  },

  getDoctors: async (): Promise<Doctor[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/Doctors/All-Doctors`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }); 
      
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      return await response.json() as Doctor[];
    } catch (error) {
      console.error('Get doctors error:', error);
      throw error;
    }
  },

  getDoctorSchedule: async (
    doctorId: number, // <-- THAY ĐỔI: Nhận vào ID (số)
    date: Date
  ): Promise<ScheduleResponseItem[]> => {
    
    const formattedDate = formatDateForAPI(date);
    
    // THAY ĐỔI: Vẫn dùng 'doctorSearch' nhưng giá trị là ID
    const query = `?doctorId=${doctorId}&date=${formattedDate}`;
    
    try {
      const response = await fetch(`${API_BASE_URL}/booking/info_slot_busy${query}`);

      if (!response.ok) {
        throw new Error('Failed to fetch doctor schedule');
      }
      return await response.json() as ScheduleResponseItem[]; 
    } catch (error)
    {
      console.error('Get doctor schedule error:', error);
      throw error;
    }
  },

  submitBooking: async (data: BookingRequest) => {
    try {
      const response = await fetch(`${API_BASE_URL}/booking/public`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); 
        throw new Error(errorData.message || 'Booking failed. Please check your information.');
      }
      return await response.json(); 
    } catch (error) {
      console.error('Submit booking error:', error);
      throw error;
    }
  },
};