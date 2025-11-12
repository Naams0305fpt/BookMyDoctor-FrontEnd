/**
 * Doctor Related Types
 * 
 * This file contains all type definitions related to:
 * - Doctor information & profile
 * - Doctor creation/registration
 * - Doctor's appointments view
 */

// ==================== DOCTOR PROFILE ====================

export interface Doctor {
  DoctorId: number;
  UserId: number;
  Name: string;
  Gender: string;
  DateOfBirth: string; // "YYYY-MM-DD"
  Identification: string;
  Phone: string;
  Email: string;
  Address: string;
  Department: string;
  Experience_year: number;
  Image: string | null;
  IsActive: boolean;
}

// ==================== DOCTOR CREATION ====================

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

// ==================== DOCTOR'S APPOINTMENTS ====================

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

export interface UpdateAppointmentRequest {
  Status: string;
  Symptoms: string;
  Prescription: string;
}
