/**
 * Booking API Service
 * 
 * Handles all booking-related operations including:
 * - Creating new bookings/appointments
 * - Retrieving booking history
 * - Canceling appointments (with 24h policy)
 * - Getting doctor schedule/busy slots
 */

import { apiClient, formatDateForAPI } from '../http-client';
import type {
  BookingRequest,
  MyHistoryResponse,
  ScheduleResponseItem,
} from '../../types';

/**
 * Get patient's booking history
 * @returns Array of patient's appointments with details
 */
export const getMyHistory = async (): Promise<MyHistoryResponse[]> => {
  const response = await apiClient.get('/Patients/MyHistoryAppoint');
  return response.data;
};

/**
 * Submit a new booking/appointment
 * @param data - Booking request with patient info, doctor, date, time
 * @returns Created booking confirmation
 */
export const submitBooking = async (data: BookingRequest) => {
  const response = await apiClient.post('/booking/public', data);
  return response.data;
};

/**
 * Cancel an existing appointment
 * Note: 24-hour cancellation policy is enforced on backend
 * 
 * @param appointId - ID of the appointment to cancel
 * @returns Success message
 */
export const cancelBooking = async (appointId: number): Promise<{ message: string }> => {
  const response = await apiClient.put('/Patients/CancelAppointment', null, {
    params: { appointId }
  });
  return response.data;
};

/**
 * Get doctor's busy time slots for a specific date
 * Used in booking form to show available hours
 * 
 * @param doctorId - ID of the doctor
 * @param date - Date to check (will be formatted to YYYY-MM-DD)
 * @returns Array of schedule items with busy slots
 */
export const getDoctorSchedule = async (
  doctorId: number,
  date: Date
): Promise<ScheduleResponseItem[]> => {
  const formattedDate = formatDateForAPI(date);
  
  const response = await apiClient.get<ScheduleResponseItem[]>('/booking/info_slot_busy', {
    params: {
      doctorId: doctorId,
      date: formattedDate
    }
  });
  return response.data;
};

// Default export: bookingApi object with all methods
const bookingApi = {
  getMyHistory,
  submitBooking,
  cancelBooking,
  getDoctorSchedule,
};

export default bookingApi;
