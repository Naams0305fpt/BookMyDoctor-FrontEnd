/**
 * Doctor API Service
 * 
 * Handles all doctor-related operations including:
 * - CRUD operations for doctors
 * - Doctor appointments management
 * - Doctor profile information
 */

import { apiClient } from '../http-client';
import type {
  Doctor,
  CreateDoctorRequest,
  DoctorAppointment,
  UpdateAppointmentRequest,
  CreateDoctorResponse,
  DoctorAppointmentsParams,
} from '../../types';

/**
 * Get all doctors
 * @returns Array of all doctors in the system
 */
export const getAllDoctors = async (): Promise<Doctor[]> => {
  const response = await apiClient.get<Doctor[]>('/Doctors/All-Doctors');
  return response.data;
};

/**
 * Create a new doctor account
 * Admin/Owner only
 * 
 * @param data - Doctor registration information
 * @returns Created doctor response
 */
export const createDoctor = async (data: CreateDoctorRequest): Promise<any> => {
  const response = await apiClient.post('/Owner/create-doctor', data);
  return response.data;
};

/**
 * Get appointments for a specific doctor
 * Can filter by doctor ID, patient name, or patient phone
 * 
 * @param doctorId - Optional: Filter by doctor ID
 * @param patientName - Optional: Filter by patient name
 * @param patientPhone - Optional: Filter by patient phone
 * @returns Array of doctor appointments with patient details
 */
export const getDoctorAppointments = async (
  doctorId?: number,
  patientName?: string,
  patientPhone?: string
): Promise<DoctorAppointment[]> => {
  const params: Record<string, string | number> = {};
  if (doctorId) params.doctorId = doctorId;
  if (patientName) params.patientName = patientName;
  if (patientPhone) params.patientPhone = patientPhone;

  const response = await apiClient.get('/Doctors/GetDoctorAppointments', {
    params: params,
  });

  return response.data as DoctorAppointment[];
};

/**
 * Update appointment status and medical information
 * Doctor can update symptoms, prescription, and status
 * 
 * @param patientId - ID of the patient
 * @param appointDate - Appointment date (YYYY-MM-DD)
 * @param appointHour - Appointment hour (HH:mm)
 * @param appointId - Appointment ID
 * @param data - Update data (Status, Symptoms, Prescription)
 * @returns Updated appointment
 */
export const updateAppointment = async (
  patientId: number,
  appointDate: string,
  appointHour: string,
  appointId: number,
  data: UpdateAppointmentRequest
): Promise<UpdateAppointmentRequest> => {
  // API requires all 4 params
  const params = {
    patientId: patientId,
    appointDate: appointDate,
    appointHour: appointHour,
    appointId: appointId,
  };
  
  // API requires these 3 fields in request body
  const body = {
    Status: data.Status,
    Symptoms: data.Symptoms,
    Prescription: data.Prescription,
  };

  const response = await apiClient.put('/Patients/UpdateAppointment', body, {
    params: params
  });

  return response.data;
};

// Default export: doctorApi object with all methods
const doctorApi = {
  getAllDoctors,
  createDoctor,
  getDoctorAppointments,
  updateAppointment,
};

export default doctorApi;
