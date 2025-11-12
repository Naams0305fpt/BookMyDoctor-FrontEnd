/**
 * Booking & Appointment Related Types
 * 
 * This file contains all type definitions related to:
 * - Patient booking/appointment creation
 * - Booking history
 * - Appointment status tracking
 */

// ==================== BOOKING REQUEST ====================

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

// ==================== BOOKING HISTORY ====================

export interface MyHistoryResponse {
  AppointId: number; // ID của appointment - dùng để cancel
  NamePatient: string;
  NameDoctor: string;
  PhoneDoctor: string;
  Department: string;
  AppointHour: string; // "HH:mm:ss"
  AppointDate: string; // "YYYY-MM-DD"
  Status: string; // "Scheduled", "Completed", "Cancelled"
  Symptoms: string;
  Prescription: string;
}

// ==================== APPOINTMENT STATUS ====================

export type AppointmentStatus = "Scheduled" | "Completed" | "Cancelled";
