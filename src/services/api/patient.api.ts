/**
 * Patient API Service
 * 
 * Handles all patient-related operations including:
 * - Patient list and search
 * - Patient profile management
 * - Profile updates
 */

import { apiClient } from '../http-client';
import type {
  Patient,
  GetPatientsParams,
  ProfileMeResponse,
  UpdateProfileResponse,
} from '../../types';

/**
 * Get all patients with optional filters
 * Used in admin panel for patient management
 * 
 * @param name - Optional: Filter by patient name
 * @param appointDate - Optional: Filter by appointment date
 * @param status - Optional: Filter by appointment status
 * @param doctorId - Optional: Filter by doctor ID
 * @returns Array of patients matching the filters
 */
export const getAllPatients = async (
  name: string,
  appointDate: string,
  status: string,
  doctorId?: number
): Promise<Patient[]> => {
  // Build params object, only include if value exists
  const params: any = {};
  if (name) params.name = name;
  if (appointDate) params.appointDate = appointDate;
  if (status) params.status = status;
  if (doctorId) params.doctorId = doctorId;

  const response = await apiClient.get('/Patients/AllPatientsAndSearch', {
    params: params,
  });
  
  return response.data as Patient[];
};

/**
 * Get current user's profile information
 * Works for all user types (Patient, Doctor, Admin)
 * 
 * @returns User profile data
 */
export const getProfileMe = async (): Promise<ProfileMeResponse> => {
  const response = await apiClient.get('/Profile/profile-me');
  return response.data;
};

/**
 * Update current user's profile
 * Accepts different fields based on user role:
 * - Patient: name, phone, email, gender, dateOfBirth, address
 * - Doctor: all patient fields + department, experienceYears
 * 
 * @param data - Profile update data (partial update supported)
 * @returns Updated profile response
 */
export const updateProfileMe = async (data: {
  name?: string;
  phone?: string;
  email?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  department?: string;
  experienceYears?: number;
}): Promise<UpdateProfileResponse> => {
  const response = await apiClient.put('/Profile/Update_Profile_Me', data);
  return response.data;
};

// Default export: patientApi object with all methods
const patientApi = {
  getAllPatients,
  getProfileMe,
  updateProfileMe,
};

export default patientApi;
