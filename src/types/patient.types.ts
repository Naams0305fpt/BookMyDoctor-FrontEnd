/**
 * Patient Related Types
 * 
 * This file contains all type definitions related to:
 * - Patient information & profile
 * - Patient records
 */

// ==================== PATIENT PROFILE ====================

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
