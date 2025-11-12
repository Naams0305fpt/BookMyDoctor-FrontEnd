/**
 * API Services Barrel Export
 * 
 * Centralized export for all API services.
 * Import from this file for cleaner imports:
 * 
 * @example
 * ```typescript
 * import { authApi, bookingApi, doctorApi } from '@/services/api';
 * ```
 */

// Import all API service modules
import authApi from './auth.api';
import bookingApi from './booking.api';
import doctorApi from './doctor.api';
import patientApi from './patient.api';
import scheduleApi from './schedule.api';

// Export individual API services
export { authApi, bookingApi, doctorApi, patientApi, scheduleApi };

// Export all methods from each service for direct imports
export * from './auth.api';
export * from './booking.api';
export * from './doctor.api';
export * from './patient.api';
export * from './schedule.api';

// Default export: Combined API services object
const apiServices = {
  auth: authApi,
  booking: bookingApi,
  doctor: doctorApi,
  patient: patientApi,
  schedule: scheduleApi,
};

export default apiServices;
