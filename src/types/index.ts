/**
 * Types Index - Barrel Export
 * 
 * This file re-exports all types from individual type files
 * to provide a single import point for all types.
 * 
 * Usage:
 *   import { LoginRequest, Doctor, Schedule } from '@/types';
 */

// ==================== API RESPONSE TYPES ====================
export * from './api-responses';

// ==================== AUTH TYPES ====================
export type {
  RegisterRequest,
  LoginRequest,
  SendVerificationCodeRequest,
  RequestOtpRequest,
  VerifyOtpRequest,
  ChangePasswordRequest,
  ChangePasswordOtpRequest,
  SetNewPasswordRequest,
  ResetPasswordOtpRequest,
} from './auth.types';

// ==================== BOOKING TYPES ====================
export type {
  BookingRequest,
  MyHistoryResponse,
  AppointmentStatus,
} from './booking.types';

// ==================== DOCTOR TYPES ====================
export type {
  Doctor,
  CreateDoctorRequest,
  DoctorAppointment,
  UpdateAppointmentRequest,
} from './doctor.types';

// ==================== PATIENT TYPES ====================
export type {
  Patient,
} from './patient.types';

// ==================== SCHEDULE TYPES ====================
export type {
  Schedule,
  AddScheduleRequest,
  UpdateScheduleRequest,
  AddScheduleResponse,
  ScheduleDetailResponse,
  ScheduleResponseItem,
} from './schedule.types';
