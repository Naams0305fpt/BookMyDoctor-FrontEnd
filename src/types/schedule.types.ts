/**
 * Schedule Related Types
 * 
 * This file contains all type definitions related to:
 * - Doctor schedules/work shifts
 * - Schedule management (create, update, view)
 * - Schedule slots and availability
 */

// ==================== SCHEDULE ====================

export interface Schedule {
  ScheduleId?: number;
  DoctorId: number;
  DoctorName?: string; // Optional - API List_All_Schedules_Doctors không trả về
  WorkDate: string; // "YYYY-MM-DD"
  StartTime: string; // "HH:mm:ss"
  EndTime: string; // "HH:mm:ss"
  Status: string; // "Scheduled", "Available", etc.
  IsActive?: boolean;
}

// ==================== SCHEDULE REQUESTS ====================

export interface AddScheduleRequest {
  DoctorId: number;
  WorkDate: string; // "YYYY-MM-DD"
  StartTime: string; // "HH:mm" (e.g. "08:00")
  EndTime: string; // "HH:mm" (e.g. "17:00")
  Status: string; // "Scheduled", "Available", etc.
}

export interface UpdateScheduleRequest {
  ScheduleId: number;
  DoctorId: number;
  WorkDate: string; // "YYYY-MM-DD"
  StartTime: string; // "HH:mm"
  EndTime: string; // "HH:mm"
  Status: string;
}

// ==================== SCHEDULE RESPONSES ====================

export interface AddScheduleResponse {
  ScheduleId: number;
  DoctorId: number;
  WorkDate: string;
  StartTime: string;
  EndTime: string;
  Status: string;
  IsActive: boolean;
}

export interface ScheduleDetailResponse {
  ScheduleId: number;
  DoctorId: number;
  WorkDate: string;
  StartTime: string;
  EndTime: string;
  Status: string;
  IsActive: boolean;
}

// ==================== SCHEDULE SLOTS ====================

export interface ScheduleResponseItem {
  AppointHour: string; // "HH:mm:ss"
  Status: string; // "Scheduled", "Cancelled", etc.
  Name?: string; // Patient name if slot is booked
  Phone?: string; // Patient phone if slot is booked
}
