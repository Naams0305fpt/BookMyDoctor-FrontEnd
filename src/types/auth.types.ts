/**
 * Authentication & Authorization Related Types
 * 
 * This file contains all type definitions related to:
 * - User registration
 * - Login/Logout
 * - Password management (change, reset)
 * - OTP verification
 */

// ==================== REGISTRATION ====================

export interface RegisterRequest {
  Username: string;
  Password: string;
  ConfirmPassword: string;
  Email: string;
  Phone: string;
}

// ==================== LOGIN ====================

export interface LoginRequest {
  UsernameOrPhoneOrEmail: string;
  Password: string;
}

// ==================== EMAIL VERIFICATION ====================

export interface SendVerificationCodeRequest {
  email: string;
}

// ==================== OTP (One-Time Password) ====================

export interface RequestOtpRequest {
  Destination: string; // Email address
  Purpose: string; // e.g., "ResetPassword"
  Channel: string; // Should be "email"
}

export interface VerifyOtpRequest {
  Destination: string; // Email
  Purpose: string; // "ResetPassword"
  OtpCode: string;
  Channel: string; // "email"
}

// ==================== PASSWORD MANAGEMENT ====================

export interface ChangePasswordRequest {
  CurrentPassword: string;
  NewPassword: string;
  ConfirmNewPassword: string;
}

export interface ChangePasswordOtpRequest {
  NewPassword: string;
  ConfirmNewPassword: string;
}

export interface SetNewPasswordRequest {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordOtpRequest {
  Destination: string; // Email address
  Purpose: string; // e.g., "ResetPassword"
  OtpCode: string; // The 6-digit code
  NewPassword: string;
  ConfirmNewPassword: string;
}
