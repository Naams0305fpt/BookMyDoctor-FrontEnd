/**
 * Schedule API Service
 * 
 * Handles all schedule-related operations including:
 * - CRUD operations for doctor schedules
 * - Getting available/busy time slots
 * - Schedule filtering and search
 */

import { apiClient } from '../http-client';
import type {
  Schedule,
  AddScheduleRequest,
  UpdateScheduleRequest,
  AddScheduleResponse,
  ScheduleDetailResponse,
} from '../../types';

/**
 * Get schedules for a specific doctor (with optional filters)
 * Used by doctors to manage their own schedules
 * 
 * @param doctorName - Optional: Filter by doctor name
 * @param date - Optional: Filter by date (YYYY-MM-DD format)
 * @returns Array of schedules matching the filters
 */
export const getAllSchedules = async (
  doctorName?: string,
  date?: string
): Promise<Schedule[]> => {
  const params: any = {};
  if (doctorName) params.doctorName = doctorName;
  if (date) params.date = date;

  const response = await apiClient.get('/Schedule/List_Schedules_1_Doctor', {
    params: params,
  });
  return response.data as Schedule[];
};

/**
 * Get all schedules for all doctors
 * Admin view only - for schedule management dashboard
 * 
 * @returns Array of all schedules in the system
 */
export const getAllSchedulesForAdmin = async (): Promise<Schedule[]> => {
  const response = await apiClient.get('/Schedule/List_All_Schedules_Doctors');
  return response.data as Schedule[];
};

/**
 * Get detailed information for a specific schedule
 * 
 * @param scheduleId - ID of the schedule to retrieve
 * @returns Detailed schedule information
 */
export const getScheduleById = async (scheduleId: number): Promise<ScheduleDetailResponse> => {
  const response = await apiClient.get('/Schedule/Get_Schedule_ById', {
    params: { scheduleId }
  });
  return response.data as ScheduleDetailResponse;
};

/**
 * Create a new schedule
 * Doctor/Admin only (Role: R02)
 * 
 * @param data - Schedule creation data (doctor ID, date, time slots, etc.)
 * @returns Created schedule response with ID
 */
export const addSchedule = async (data: AddScheduleRequest): Promise<AddScheduleResponse> => {
  const response = await apiClient.post('/Schedule/Add_Schedule_Doctor', data);
  return response.data as AddScheduleResponse;
};

/**
 * Update an existing schedule
 * Doctor/Admin only (Role: R02)
 * 
 * @param data - Schedule update data (schedule ID, new time slots, etc.)
 * @returns void (204 No Content on success)
 */
export const updateSchedule = async (data: UpdateScheduleRequest): Promise<void> => {
  // Response: 204 No Content
  await apiClient.put('/Schedule/Update_Schedule_Doctor', data);
};

/**
 * Delete a schedule
 * Admin/Doctor only (Roles: R01, R02)
 * 
 * @param scheduleId - ID of the schedule to delete
 * @returns Success message
 */
export const deleteSchedule = async (scheduleId: number): Promise<{ message: string }> => {
  const response = await apiClient.delete('/Schedule/Delete_Schedule_Doctor', {
    params: { scheduleId }
  });
  return response.data;
};

// Default export: scheduleApi object with all methods
const scheduleApi = {
  getAllSchedules,
  getAllSchedulesForAdmin,
  getScheduleById,
  addSchedule,
  updateSchedule,
  deleteSchedule,
};

export default scheduleApi;
