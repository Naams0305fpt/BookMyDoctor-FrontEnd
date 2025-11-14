/**
 * API Service - Main Entry Point (Backward Compatibility Layer)
 * 
 * This file maintains backward compatibility with existing code
 * by re-exporting all API methods from the new service modules.
 * 
 * NEW CODE SHOULD IMPORT FROM:
 * - services/api/auth.api
 * - services/api/booking.api
 * - services/api/doctor.api
 * - services/api/patient.api
 * - services/api/schedule.api
 * 
 * Or use the barrel export:
 * - services/api/ (index.ts)
 */

// ==================== IMPORTS ====================
import { User, UserType } from '../contexts/AuthContext';
import { apiClient } from './http-client';

// Import all API service modules
import authApi from './api/auth.api';
import bookingApi from './api/booking.api';
import doctorApi from './api/doctor.api';
import patientApi from './api/patient.api';
import scheduleApi from './api/schedule.api';

// Import types
import type {
  Doctor,
  DeleteDoctorResponse,
} from '../types';

// ==================== RE-EXPORTS ====================

// Re-export HTTP client utilities for backward compatibility
export { apiClient, formatDateForAPI } from './http-client';

// Re-export all types for backward compatibility
export type {
  // Auth types
  RegisterRequest,
  LoginRequest,
  SendVerificationCodeRequest,
  RequestOtpRequest,
  VerifyOtpRequest,
  ChangePasswordRequest,
  ChangePasswordOtpRequest,
  SetNewPasswordRequest,
  ResetPasswordOtpRequest,
  // Booking types
  BookingRequest,
  MyHistoryResponse,
  // Doctor types
  Doctor,
  CreateDoctorRequest,
  DoctorAppointment,
  UpdateAppointmentRequest,
  // Patient types
  Patient,
  // Schedule types
  Schedule,
  AddScheduleRequest,
  UpdateScheduleRequest,
  AddScheduleResponse,
  ScheduleDetailResponse,
  ScheduleResponseItem,
} from '../types';

// ==================== API OBJECT ====================

/**
 * Main API object for backward compatibility
 * All methods now delegate to their respective service modules
 */
export const api = {
  // ==================== AUTH APIS ====================
  // Re-export from authApi
  login: authApi.login,
  logout: authApi.logout,
  register: authApi.register,
  sendVerificationCode: authApi.sendVerificationCode,
  verifyOtp: authApi.verifyOtp,
  changePasswordWithOtp: authApi.changePasswordWithOtp,
  changePasswordAfterLogin: authApi.changePasswordAfterLogin,
  
  // checkAuthStatus remains here because it combines multiple API calls
  checkAuthStatus: async (): Promise<User> => {
    // Get role info
    const roleResponse = await apiClient.get('/Auth/check-role');
    const roleData = roleResponse.data;

    // Get profile info
    const profileResponse = await apiClient.get('/Profile/profile-me');
    const profileData = profileResponse.data;

    // If doctor, get doctorId from All-Doctors API
    let doctorId: number | undefined = undefined;
    if (roleData.roleName === "Doctor") {
      try {
        const doctorsResponse = await apiClient.get('/Doctors/All-Doctors');
        const doctors = doctorsResponse.data;
        const currentDoctor = doctors.find((doc: Doctor) => doc.UserId === profileData.UserId);
        if (currentDoctor) {
          doctorId = currentDoctor.DoctorId;
        } else {
          console.warn("⚠️ Doctor not found in All-Doctors list for UserId:", profileData.UserId);
        }
      } catch (err) {
        console.error("❌ Failed to fetch doctors list:", err);
      }
    }

    // Convert API data to User interface
    const user: User = {
      id: roleData.userId,
      name: profileData.Name || roleData.username,
      userType: roleData.roleName.toLowerCase() as UserType,
      phone: profileData.Phone,
      email: profileData.Email,
      avatar: "/images/default-avatar.png",
      doctorId: doctorId,
      patientId: profileData.PatientId,
      dateOfBirth: profileData.DateOfBirth,
      gender: profileData.Gender,
    };

    return user;
  },

  // ==================== BOOKING APIS ====================
  // Re-export from bookingApi
  getMyHistory: bookingApi.getMyHistory,
  submitBooking: bookingApi.submitBooking,
  cancelBooking: bookingApi.cancelBooking,
  getDoctorSchedule: bookingApi.getDoctorSchedule,

  // ==================== DOCTOR APIS ====================
  // Re-export from doctorApi
  getDoctors: doctorApi.getAllDoctors,
  createDoctor: doctorApi.createDoctor,
  getDoctorAppointments: doctorApi.getDoctorAppointments,
  updateAppointment: doctorApi.updateAppointment,
  
  // deleteDoctor remains here (not in doctorApi yet)
  deleteDoctor: async (id: number): Promise<DeleteDoctorResponse> => {
    const response = await apiClient.delete("/Doctors/DeleteDoctor", {
      params: { id: id },
    });
    return response.data;
  },

  // ==================== PATIENT APIS ====================
  // Re-export from patientApi
  getPatients: patientApi.getAllPatients,
  getProfileMe: patientApi.getProfileMe,
  updateProfileMe: patientApi.updateProfileMe,

  // ==================== SCHEDULE APIS ====================
  // Re-export from scheduleApi
  getAllSchedules: scheduleApi.getAllSchedules,
  getAllSchedulesForAdmin: scheduleApi.getAllSchedulesForAdmin,
  getScheduleById: scheduleApi.getScheduleById,
  addSchedule: scheduleApi.addSchedule,
  updateSchedule: scheduleApi.updateSchedule,
  deleteSchedule: scheduleApi.deleteSchedule,
};

