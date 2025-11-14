import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  Stethoscope,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { formatDateForAPI } from '../../services/http-client';
import doctorApi from '../../services/api/doctor.api';
import bookingApi from '../../services/api/booking.api';
import type { Doctor, BookingRequest, ScheduleResponseItem } from '../../types';
import { theme } from '../../styles/theme';
import { Card, Button, Input, InputWrapper, InputLabel, InputError } from '../../styles/components';

// Styled Components
const BookingSection = styled.section`
  padding: ${theme.spacing[16]} 0;
  background: ${theme.colors.background.secondary};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[12]} 0;
  }
`;

const Container = styled.div`
  max-width: ${theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 ${theme.spacing[6]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0 ${theme.spacing[4]};
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing[12]};
`;

const SectionTitle = styled(motion.h2)`
  font-size: ${theme.typography.fontSize['4xl']};
  font-weight: ${theme.typography.fontWeight.extrabold};
  color: ${theme.colors.accent.navy};
  margin-bottom: ${theme.spacing[4]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize['3xl']};
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: ${theme.typography.fontSize.xl};
  color: ${theme.colors.text.secondary};
  max-width: 600px;
  margin: 0 auto;
`;

const FormCard = styled(Card)`
  max-width: 900px;
  margin: 0 auto;
  padding: ${theme.spacing[8]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[6]};
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing[6]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[4]};
  }
`;

const FullWidthField = styled.div`
  grid-column: 1 / -1;
`;

const InputWithIcon = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: ${theme.spacing[4]};
    top: 50%;
    transform: translateY(-50%);
    color: ${theme.colors.primary.teal};
    width: 20px;
    height: 20px;
    pointer-events: none;
  }
  
  input, select, textarea {
    padding-left: ${theme.spacing[12]};
  }
`;

const Select = styled.select<{ error?: boolean }>`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border: 2px solid ${({ error }) => error ? theme.colors.error : theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.lg};
  font-family: ${theme.typography.fontFamily.sans};
  font-size: ${theme.typography.fontSize.base};
  background: ${theme.colors.background.primary};
  color: ${theme.colors.text.primary};
  transition: all ${theme.transitions.duration.fast} ${theme.transitions.easing.default};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ error }) => error ? theme.colors.error : theme.colors.primary.teal};
    box-shadow: 0 0 0 3px ${({ error }) => 
      error ? `${theme.colors.error}20` : `${theme.colors.primary.teal}20`};
  }

  &:disabled {
    background: ${theme.colors.gray[100]};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const TextArea = styled.textarea<{ error?: boolean }>`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border: 2px solid ${({ error }) => error ? theme.colors.error : theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.lg};
  font-family: ${theme.typography.fontFamily.sans};
  font-size: ${theme.typography.fontSize.base};
  background: ${theme.colors.background.primary};
  color: ${theme.colors.text.primary};
  transition: all ${theme.transitions.duration.fast} ${theme.transitions.easing.default};
  resize: vertical;
  min-height: 120px;

  &:focus {
    outline: none;
    border-color: ${({ error }) => error ? theme.colors.error : theme.colors.primary.teal};
    box-shadow: 0 0 0 3px ${({ error }) => 
      error ? `${theme.colors.error}20` : `${theme.colors.primary.teal}20`};
  }
`;

const TimeSlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: ${theme.spacing[2]};
  margin-top: ${theme.spacing[2]};
`;

const TimeSlot = styled(motion.button)<{ selected: boolean; disabled: boolean }>`
  padding: ${theme.spacing[3]};
  border: 2px solid ${({ selected, disabled }) => 
    disabled ? theme.colors.gray[300] : 
    selected ? theme.colors.primary.teal : 
    theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.lg};
  background: ${({ selected, disabled }) => 
    disabled ? theme.colors.gray[100] : 
    selected ? theme.colors.primary.teal : 
    'white'};
  color: ${({ selected, disabled }) => 
    disabled ? theme.colors.gray[400] : 
    selected ? 'white' : 
    theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: all ${theme.transitions.duration.fast} ${theme.transitions.easing.default};

  &:hover:not(:disabled) {
    border-color: ${theme.colors.primary.teal};
    background: ${({ selected }) => selected ? theme.colors.primary.dark : theme.colors.primary.lightest};
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: ${theme.spacing[6]};
  padding: ${theme.spacing[4]};
  font-size: ${theme.typography.fontSize.lg};
`;

const Notification = styled(motion.div)<{ type: 'success' | 'error' | 'info' }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.lg};
  margin-top: ${theme.spacing[4]};
  background: ${({ type }) => 
    type === 'success' ? `${theme.colors.success}15` : 
    type === 'error' ? `${theme.colors.error}15` : 
    `${theme.colors.info}15`};
  border: 1px solid ${({ type }) => 
    type === 'success' ? theme.colors.success : 
    type === 'error' ? theme.colors.error : 
    theme.colors.info};
  color: ${({ type }) => 
    type === 'success' ? theme.colors.success : 
    type === 'error' ? theme.colors.error : 
    theme.colors.info};
  
  svg {
    flex-shrink: 0;
  }
`;

const LoadingOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.card};
  z-index: 10;
`;

const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }
  
  .react-datepicker__input-container input {
    width: 100%;
    padding: ${theme.spacing[3]} ${theme.spacing[4]};
    padding-left: ${theme.spacing[12]};
    border: 2px solid ${theme.colors.gray[300]};
    border-radius: ${theme.borderRadius.lg};
    font-family: ${theme.typography.fontFamily.sans};
    font-size: ${theme.typography.fontSize.base};
    background: ${theme.colors.background.primary};
    color: ${theme.colors.text.primary};
    transition: all ${theme.transitions.duration.fast} ${theme.transitions.easing.default};
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: ${theme.colors.primary.teal};
      box-shadow: 0 0 0 3px ${theme.colors.primary.teal}20;
    }
  }
`;

// Interfaces
interface FormData {
  doctorId: string;
  fullName: string;
  phone: string;
  email: string;
  date: Date | null;
  time: string;
  dateOfBirth: Date | null;
  gender: string;
  symptom: string;
}

interface FormErrors {
  [key: string]: string;
}

const initialFormData: FormData = {
  doctorId: '',
  fullName: '',
  phone: '',
  email: '',
  date: new Date(),
  time: '',
  dateOfBirth: null,
  gender: '',
  symptom: '',
};

const ModernBookingForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const { user } = useAuth();

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [notification, setNotification] = useState<string>('');
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [fetchedBusySlots, setFetchedBusySlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
  ];

  const genders = ['Male', 'Female', 'Other'];

  // Load doctors
  useEffect(() => {
    const loadDoctors = async () => {
      setIsLoadingDoctors(true);
      try {
        const doctorsData = await doctorApi.getAllDoctors();
        setAllDoctors(doctorsData);
      } catch (error) {
        setErrors((prev) => ({ ...prev, doctor: 'Failed to load doctors list.' }));
      } finally {
        setIsLoadingDoctors(false);
      }
    };
    loadDoctors();
  }, []);

  // Load busy slots
  useEffect(() => {
    if (formData.doctorId && formData.date) {
      const fetchSchedule = async () => {
        setIsLoadingSlots(true);
        setFetchedBusySlots([]);

        try {
          const busySchedule: ScheduleResponseItem[] = await bookingApi.getDoctorSchedule(
            parseInt(formData.doctorId),
            formData.date!
          );
          
          const busyStrings = busySchedule
            .filter((item) => item.Status === 'Scheduled')
            .map((item) => item.AppointHour.substring(0, 5));

          setFetchedBusySlots(busyStrings);

          if (formData.time && busyStrings.includes(formData.time)) {
            handleInputChange('time', '');
            setNotification('Your previously selected time is no longer available.');
            setTimeout(() => setNotification(''), 3000);
          }
        } catch (error) {
          // Failed to load slots
        } finally {
          setIsLoadingSlots(false);
        }
      };
      fetchSchedule();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.doctorId, formData.date]);

  // Auto-fill user data
  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        fullName: prevData.fullName || user.name || '',
        phone: prevData.phone || user.phone || '',
        email: prevData.email || user.email || '',
        gender: prevData.gender || user.gender || '',
        dateOfBirth: prevData.dateOfBirth || (user.dateOfBirth ? new Date(user.dateOfBirth) : null),
      }));
    }
  }, [user]);

  const handleInputChange = (field: keyof FormData, value: string | Date | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!/^\d{9,11}$/.test(formData.phone.replace(/\s/g, '')))
      newErrors.phone = 'Phone number must be 9-11 digits';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.email.trim() && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email))
      newErrors.email = 'Invalid email address';
    if (!formData.date) newErrors.date = 'Date is required';
    if (formData.date && formData.date < new Date(new Date().setHours(0, 0, 0, 0)))
      newErrors.date = 'Date cannot be in the past';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.doctorId) newErrors.doctor = 'Please choose a doctor';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!formData.date || !formData.dateOfBirth) {
      setSubmitStatus('error');
      setNotification('Date and Date of Birth must be selected.');
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    const selectedDoctor = allDoctors.find(
      (doctor) => doctor.DoctorId === parseInt(formData.doctorId)
    );

    if (!selectedDoctor) {
      setErrors((prev) => ({ ...prev, doctor: 'Selected doctor not found.' }));
      return;
    }

    const payload: BookingRequest = {
      DoctorId: parseInt(formData.doctorId),
      FullName: formData.fullName,
      Phone: formData.phone,
      Email: formData.email,
      Date: formatDateForAPI(formData.date),
      AppointHour: formData.time,
      Gender: formData.gender,
      DateOfBirth: formatDateForAPI(formData.dateOfBirth),
      Symptom: formData.symptom,
    };

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setNotification('');

    try {
      await bookingApi.submitBooking(payload);
      setSubmitStatus('success');
      setFormData(initialFormData);
      setTimeout(() => setSubmitStatus('idle'), 4000);
    } catch (error) {
      setSubmitStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setNotification(errorMessage);
      setTimeout(() => {
        setSubmitStatus('idle');
        setNotification('');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BookingSection id="booking-section">
      <Container>
        <SectionHeader>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Book Your Appointment
          </SectionTitle>
          <SectionSubtitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Schedule a visit with our experienced healthcare professionals
          </SectionSubtitle>
        </SectionHeader>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <FormCard style={{ position: 'relative' }}>
          <AnimatePresence>
            {isSubmitting && (
              <LoadingOverlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader className="animate-spin" size={48} color={theme.colors.primary.teal} />
              </LoadingOverlay>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            <FormGrid>
              {/* Doctor Selection */}
              <FullWidthField>
                <InputWrapper>
                  <InputLabel>Select Doctor *</InputLabel>
                  <InputWithIcon>
                    <Stethoscope />
                    <Select
                      value={formData.doctorId}
                      onChange={(e) => handleInputChange('doctorId', e.target.value)}
                      error={!!errors.doctor}
                      disabled={isLoadingDoctors}
                    >
                      <option value="">
                        {isLoadingDoctors ? 'Loading doctors...' : 'Choose a doctor'}
                      </option>
                      {allDoctors.map((doctor) => (
                        <option key={doctor.DoctorId} value={doctor.DoctorId}>
                          Dr. {doctor.Name} - {doctor.Department}
                        </option>
                      ))}
                    </Select>
                  </InputWithIcon>
                  {errors.doctor && <InputError>{errors.doctor}</InputError>}
                </InputWrapper>
              </FullWidthField>

              {/* Full Name */}
              <InputWrapper>
                <InputLabel>Full Name *</InputLabel>
                <InputWithIcon>
                  <User />
                  <Input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    error={!!errors.fullName}
                    placeholder="Enter your full name"
                  />
                </InputWithIcon>
                {errors.fullName && <InputError>{errors.fullName}</InputError>}
              </InputWrapper>

              {/* Phone */}
              <InputWrapper>
                <InputLabel>Phone Number *</InputLabel>
                <InputWithIcon>
                  <Phone />
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    error={!!errors.phone}
                    placeholder="0123456789"
                  />
                </InputWithIcon>
                {errors.phone && <InputError>{errors.phone}</InputError>}
              </InputWrapper>

              {/* Email */}
              <InputWrapper>
                <InputLabel>Email Address *</InputLabel>
                <InputWithIcon>
                  <Mail />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={!!errors.email}
                    placeholder="your@email.com"
                  />
                </InputWithIcon>
                {errors.email && <InputError>{errors.email}</InputError>}
              </InputWrapper>

              {/* Date of Birth */}
              <InputWrapper>
                <InputLabel>Date of Birth *</InputLabel>
                <DatePickerWrapper>
                  <InputWithIcon>
                    <Calendar />
                    <DatePicker
                      selected={formData.dateOfBirth}
                      onChange={(date) => handleInputChange('dateOfBirth', date)}
                      dateFormat="dd/MM/yyyy"
                      maxDate={new Date()}
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={100}
                      placeholderText="Select date of birth"
                    />
                  </InputWithIcon>
                </DatePickerWrapper>
                {errors.dateOfBirth && <InputError>{errors.dateOfBirth}</InputError>}
              </InputWrapper>

              {/* Gender */}
              <InputWrapper>
                <InputLabel>Gender *</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  error={!!errors.gender}
                >
                  <option value="">Select gender</option>
                  {genders.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </Select>
                {errors.gender && <InputError>{errors.gender}</InputError>}
              </InputWrapper>

              {/* Appointment Date */}
              <InputWrapper>
                <InputLabel>Appointment Date *</InputLabel>
                <DatePickerWrapper>
                  <InputWithIcon>
                    <Calendar />
                    <DatePicker
                      selected={formData.date}
                      onChange={(date) => handleInputChange('date', date)}
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()}
                      placeholderText="Select appointment date"
                    />
                  </InputWithIcon>
                </DatePickerWrapper>
                {errors.date && <InputError>{errors.date}</InputError>}
              </InputWrapper>

              {/* Time Slots */}
              <FullWidthField>
                <InputWrapper>
                  <InputLabel>Select Time *</InputLabel>
                  {isLoadingSlots ? (
                    <div style={{ textAlign: 'center', padding: theme.spacing[4] }}>
                      <Loader className="animate-spin" size={24} style={{ margin: '0 auto' }} />
                    </div>
                  ) : (
                    <TimeSlotGrid>
                      {timeSlots.map((slot) => {
                        const isBusy = fetchedBusySlots.includes(slot);
                        const isSelected = formData.time === slot;

                        return (
                          <TimeSlot
                            key={slot}
                            type="button"
                            selected={isSelected}
                            disabled={isBusy}
                            onClick={() => !isBusy && handleInputChange('time', slot)}
                            whileHover={!isBusy ? { scale: 1.05 } : {}}
                            whileTap={!isBusy ? { scale: 0.95 } : {}}
                          >
                            <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                            {slot}
                          </TimeSlot>
                        );
                      })}
                    </TimeSlotGrid>
                  )}
                  {errors.time && <InputError>{errors.time}</InputError>}
                </InputWrapper>
              </FullWidthField>

              {/* Symptoms */}
              <FullWidthField>
                <InputWrapper>
                  <InputLabel>Symptoms (Optional)</InputLabel>
                  <InputWithIcon>
                    <FileText style={{ top: theme.spacing[4], transform: 'none' }} />
                    <TextArea
                      value={formData.symptom}
                      onChange={(e) => handleInputChange('symptom', e.target.value)}
                      placeholder="Describe your symptoms..."
                      error={!!errors.symptom}
                    />
                  </InputWithIcon>
                </InputWrapper>
              </FullWidthField>
            </FormGrid>

            <SubmitButton
              type="submit"
              variant="gradient"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Book Appointment'}
            </SubmitButton>
          </form>

          {/* Notifications */}
          <AnimatePresence>
            {submitStatus === 'success' && (
              <Notification
                type="success"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <CheckCircle size={24} />
                <div>
                  <strong>Booking successful!</strong>
                  <br />
                  Your appointment has been confirmed.
                </div>
              </Notification>
            )}

            {(submitStatus === 'error' || notification) && (
              <Notification
                type="error"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AlertCircle size={24} />
                <div>{notification || 'Something went wrong. Please try again.'}</div>
              </Notification>
            )}
          </AnimatePresence>
        </FormCard>
        </motion.div>
      </Container>
    </BookingSection>
  );
};

export default ModernBookingForm;
