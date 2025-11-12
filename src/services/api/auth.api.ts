/**
 * Authentication API Service
 * 
 * This file contains all authentication-related API calls:
 * - User registration
 * - Login/Logout
 * - OTP verification
 * - Password management (change, reset)
 * - Auth status checking
 */

import { apiClient } from '../http-client';
import type { User } from '../../contexts/AuthContext';
import type {
  LoginRequest,
  RegisterRequest,
  RequestOtpRequest,
  VerifyOtpRequest,
  ChangePasswordOtpRequest,
  ChangePasswordRequest,
} from '../../types';

// ==================== REGISTRATION ====================

/**
 * Register a new user account
 * @param data - Registration information
 * @returns Server response with registration details
 */
export const register = async (data: RegisterRequest) => {
  const response = await apiClient.post('/Register/user', data);
  return response.data;
};

// ==================== LOGIN / LOGOUT ====================

/**
 * Login user with credentials
 * @param data - Login credentials (username/email/phone and password)
 * @returns Server response with auth token/session
 */
export const login = async (data: LoginRequest) => {
  const response = await apiClient.post('/Auth/login', data);
  return response.data;
};

/**
 * Logout current user
 */
export const logout = async (): Promise<void> => {
  await apiClient.post('/Auth/logout');
};

// ==================== OTP VERIFICATION ====================

/**
 * Request OTP code for password reset
 * @param data - Destination email and purpose
 * @returns Server response
 */
export const sendVerificationCode = async (data: RequestOtpRequest) => {
  const response = await apiClient.post('/Auth/request-otp', data);
  return response.data;
};

/**
 * Verify OTP code
 * @param data - OTP verification data
 * @returns Success message
 */
export const verifyOtp = async (data: VerifyOtpRequest): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>('/Auth/verify-otp', data);
  return response.data;
};

// ==================== PASSWORD MANAGEMENT ====================

/**
 * Change password using OTP (forgot password flow)
 * @param data - New password information
 * @returns Success response
 */
export const changePasswordWithOtp = async (data: ChangePasswordOtpRequest): Promise<any> => {
  const response = await apiClient.post('/Auth/change-password-otp', data);

  if (response.status === 204 || !response.data) {
    return { success: true };
  }
  return response.data;
};

/**
 * Change password after login (requires current password)
 * @param data - Current and new password
 * @returns Success response
 */
export const changePasswordAfterLogin = async (data: ChangePasswordRequest): Promise<any> => {
  const response = await apiClient.post('/Auth/change-password', data);

  if (response.status === 204 || !response.data) {
    return { success: true };
  }
  return response.data;
};

// ==================== AUTH STATUS ====================

/**
 * Check current authentication status and get user info
 * @returns Current user information with role
 */
export const checkAuthStatus = async (): Promise<User> => {
  // Get role information
  const roleResponse = await apiClient.get('/Auth/check-role');
  const roleData = roleResponse.data;

  // Get profile information
  const profileResponse = await apiClient.get('/Profile/profile-me');
  const profileData = profileResponse.data;

  // For doctors, get doctorId from All-Doctors API
  let doctorId: number | undefined = undefined;
  if (roleData.roleName === 'Doctor') {
    try {
      const doctorsResponse = await apiClient.get('/Doctors/All-Doctors');
      const doctors = doctorsResponse.data;
      // Find doctor with matching UserId
      const currentDoctor = doctors.find(
        (d: any) => d.UserId === profileData.Id
      );
      if (currentDoctor) {
        doctorId = currentDoctor.DoctorId;
      }
    } catch (error) {
      console.error('Error fetching doctor info:', error);
    }
  }

  // Construct User object
  return {
    id: profileData.Id.toString(),
    name: profileData.Username,
    email: profileData.Email || '',
    userType: roleData.roleName.toLowerCase() as User['userType'],
    doctorId: doctorId,
  };
};

// ==================== EXPORTS ====================

export const authApi = {
  register,
  login,
  logout,
  sendVerificationCode,
  verifyOtp,
  changePasswordWithOtp,
  changePasswordAfterLogin,
  checkAuthStatus,
};

export default authApi;
