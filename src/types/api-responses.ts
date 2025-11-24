/**
 * API Response Types
 * Define proper return types for all API calls instead of using 'any'
 */

// ==================== COMMON TYPES ====================

export interface ApiError {
  message: string;
  field?: string;
  code?: string;
  status?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

// ==================== AUTH RESPONSES ====================

export interface LoginResponse {
  token: string;
  userId: number;
  username: string;
  role: string;
}

export interface RegisterResponse {
  message: string;
  userId?: number;
}

export interface VerificationCodeResponse {
  message: string;
  success: boolean;
}

export interface OtpVerificationResponse {
  token: string;
  message: string;
}

export interface PasswordChangeResponse {
  message: string;
  success: boolean;
}

// ==================== DOCTOR RESPONSES ====================

export interface CreateDoctorResponse {
  message: string;
  doctorId: number;
}

export interface DeleteDoctorResponse {
  message: string;
  success: boolean;
}

export interface DoctorAppointmentsParams {
  doctorId?: number;
  date?: string;
  status?: string;
}

// ==================== PATIENT RESPONSES ====================

export interface GetPatientsParams {
  date?: string;
  status?: string;
  search?: string;
}

export interface ProfileMeResponse {
  UserId: number;
  Username: string;
  RoleId: string;
  Name: string;
  Email: string;
  Phone: string;
  DateOfBirth?: string;
  Gender?: string;
  Address?: string;
  PatientId?: number;
  DoctorId?: number;
  Identification?: string;
  Department?: string;
  ExperienceYears?: number;
}

export interface UpdateProfileResponse {
  message: string;
  success: boolean;
}

// ==================== SCHEDULE RESPONSES ====================

export interface GetSchedulesParams {
  doctorId?: number;
  date?: string;
  status?: string;
}

export interface AddScheduleResponse {
  message: string;
  scheduleId: number;
}

export interface UpdateScheduleResponse {
  message: string;
  success: boolean;
}

export interface DeleteScheduleResponse {
  message: string;
  success: boolean;
}

// ==================== BOOKING RESPONSES ====================

export interface SubmitBookingResponse {
  message: string;
  appointmentId: number;
}

export interface CancelBookingResponse {
  message: string;
  success: boolean;
}

export interface DoctorScheduleResponse {
  schedules: Array<{
    ScheduleId: number;
    WorkDate: string;
    StartTime: string;
    EndTime: string;
    IsActive: boolean;
  }>;
}
