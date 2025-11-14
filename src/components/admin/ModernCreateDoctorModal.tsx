import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "@emotion/styled";
import {
  User,
  Lock,
  Mail,
  Phone,
  X,
  UserCog,
  Calendar,
  CreditCard,
  Briefcase,
  Building2,
  Users,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import doctorApi from "../../services/api/doctor.api";
import { formatDateForAPI } from "../../services/http-client";
import type { CreateDoctorRequest } from "../../types";
import { theme } from "../../styles/theme";

interface ModernCreateDoctorModalProps {
  onClose: () => void;
  onSubmit: () => void;
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: ${theme.spacing[4]};
`;

const Modal = styled(motion.div)`
  background: white;
  border-radius: ${theme.borderRadius.xl};
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: ${theme.colors.shadow.xl};
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: ${theme.spacing[6]};
  right: ${theme.spacing[6]};
  width: 40px;
  height: 40px;
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.gray[100]};
  color: ${theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};
  z-index: 1;

  &:hover {
    background: ${theme.colors.gray[200]};
    color: ${theme.colors.text.primary};
    transform: rotate(90deg);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Header = styled.div`
  padding: ${theme.spacing[8]} ${theme.spacing[8]} ${theme.spacing[6]};
  border-bottom: 2px solid ${theme.colors.gray[200]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[4]};
`;

const HeaderIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${theme.borderRadius.xl};
  background: linear-gradient(
    135deg,
    ${theme.colors.primary.teal} 0%,
    ${theme.colors.primary.dark} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  svg {
    width: 28px;
    height: 28px;
  }
`;

const HeaderContent = styled.div`
  flex: 1;

  h2 {
    font-size: ${theme.typography.fontSize["2xl"]};
    font-weight: ${theme.typography.fontWeight.bold};
    color: ${theme.colors.text.primary};
    margin: 0 0 ${theme.spacing[1]} 0;
  }

  p {
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.secondary};
    margin: 0;
  }
`;

const Form = styled.form`
  padding: ${theme.spacing[8]};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[6]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const Label = styled.label`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
`;

const Required = styled.span`
  color: #ef4444;
  font-size: ${theme.typography.fontSize.lg};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: ${theme.spacing[4]};
  color: ${theme.colors.text.tertiary};
  display: flex;
  align-items: center;
  pointer-events: none;
  z-index: 1;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]} ${theme.spacing[3]}
    calc(${theme.spacing[4]} + 32px);
  border: 2px solid
    ${({ $hasError }) => ($hasError ? "#EF4444" : theme.colors.gray[300])};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.base};
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:focus {
    outline: none;
    border-color: ${({ $hasError }) =>
      $hasError ? "#EF4444" : theme.colors.primary.teal};
    box-shadow: 0 0 0 3px
      ${({ $hasError }) =>
        $hasError ? "#EF444415" : theme.colors.primary.teal}15;
  }

  &:disabled {
    background: ${theme.colors.gray[100]};
    cursor: not-allowed;
  }
`;

const Select = styled.select<{ $hasError?: boolean }>`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]} ${theme.spacing[3]}
    calc(${theme.spacing[4]} + 32px);
  border: 2px solid
    ${({ $hasError }) => ($hasError ? "#EF4444" : theme.colors.gray[300])};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.base};
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:focus {
    outline: none;
    border-color: ${({ $hasError }) =>
      $hasError ? "#EF4444" : theme.colors.primary.teal};
    box-shadow: 0 0 0 3px
      ${({ $hasError }) =>
        $hasError ? "#EF444415" : theme.colors.primary.teal}15;
  }
`;

const DatePickerWrapper = styled.div<{ $hasError?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;

  .react-datepicker-wrapper {
    width: 100%;
  }

  input {
    width: 100%;
    padding: ${theme.spacing[3]} ${theme.spacing[4]} ${theme.spacing[3]}
      calc(${theme.spacing[4]} + 32px);
    border: 2px solid
      ${({ $hasError }) => ($hasError ? "#EF4444" : theme.colors.gray[300])};
    border-radius: ${theme.borderRadius.lg};
    font-size: ${theme.typography.fontSize.base};
    cursor: pointer;
    transition: all ${theme.transitions.duration.fast}
      ${theme.transitions.easing.default};

    &:focus {
      outline: none;
      border-color: ${({ $hasError }) =>
        $hasError ? "#EF4444" : theme.colors.primary.teal};
      box-shadow: 0 0 0 3px
        ${({ $hasError }) =>
          $hasError ? "#EF444415" : theme.colors.primary.teal}15;
    }
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: ${theme.spacing[4]};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${theme.colors.text.tertiary};
  cursor: pointer;
  padding: ${theme.spacing[1]};
  display: flex;
  align-items: center;
  transition: color ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover {
    color: ${theme.colors.text.primary};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ErrorMessage = styled.span`
  font-size: ${theme.typography.fontSize.xs};
  color: #ef4444;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};

  svg {
    width: 14px;
    height: 14px;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: ${theme.spacing[4]};
  justify-content: flex-end;
  padding-top: ${theme.spacing[6]};
  border-top: 2px solid ${theme.colors.gray[200]};
  margin-top: ${theme.spacing[6]};
`;

const CancelButton = styled(motion.button)`
  padding: ${theme.spacing[3]} ${theme.spacing[6]};
  border: 2px solid ${theme.colors.gray[300]};
  background: white;
  color: ${theme.colors.text.secondary};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover:not(:disabled) {
    border-color: ${theme.colors.gray[400]};
    color: ${theme.colors.text.primary};
    background: ${theme.colors.gray[50]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[3]} ${theme.spacing[6]};
  background: ${theme.colors.primary.teal};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover:not(:disabled) {
    background: ${theme.colors.primary.dark};
    transform: translateY(-2px);
    box-shadow: ${theme.colors.shadow.md};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const StatusMessage = styled(motion.div)<{ $type: "success" | "error" }>`
  margin-top: ${theme.spacing[6]};
  padding: ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.medium};

  ${({ $type }) =>
    $type === "success"
      ? `
    background: #10B98115;
    color: #10B981;
    border: 2px solid #10B981;
  `
      : `
    background: #EF444415;
    color: #EF4444;
    border: 2px solid #EF4444;
  `}

  svg {
    width: 24px;
    height: 24px;
  }
`;

const ModernCreateDoctorModal: React.FC<ModernCreateDoctorModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [notification, setNotification] = useState<string>("");

  const [formData, setFormData] = useState<CreateDoctorRequest>({
    Username: "",
    Email: "",
    Password: "Doctor@123",
    Phone: "",
    Name: "",
    Identification: "",
    Gender: "",
    DateOfBirth: "",
    Department: "",
    ExperienceYears: 0,
  });

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const finalValue = name === "ExperienceYears" ? value : value;

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    setStartDate(date);
    setFormData((prev) => ({ ...prev, DateOfBirth: formatDateForAPI(date) }));
    if (errors.DateOfBirth) {
      setErrors((prev) => ({ ...prev, DateOfBirth: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    if (!formData.Username.trim()) newErrors.Username = "Username is required";
    if (!formData.Email.trim()) newErrors.Email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email))
      newErrors.Email = "Invalid email format";
    if (!formData.Password.trim()) newErrors.Password = "Password is required";
    if (!formData.Name.trim()) newErrors.Name = "Full Name is required";
    if (!formData.Identification.trim())
      newErrors.Identification = "Identification is required";
    if (!formData.Phone.trim()) newErrors.Phone = "Phone number is required";
    if (!formData.Gender) newErrors.Gender = "Gender is required";
    if (!formData.DateOfBirth)
      newErrors.DateOfBirth = "Date of Birth is required";
    if (!formData.Department.trim())
      newErrors.Department = "Department is required";

    const expYearsString = String(formData.ExperienceYears).trim();
    if (expYearsString === "") {
      newErrors.ExperienceYears = "Experience is required";
    } else {
      const expYearsNum = Number(expYearsString);
      if (isNaN(expYearsNum) || expYearsNum < 0) {
        newErrors.ExperienceYears = "Experience must be a non-negative number";
      }
    }

    setErrors(newErrors);
    isValid = Object.keys(newErrors).length === 0;
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus("error");
      setNotification("Please check all required fields.");
      setTimeout(() => {
        setSubmitStatus("idle");
        setNotification("");
      }, 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setNotification("");

    try {
      const dataToSend: CreateDoctorRequest = {
        ...formData,
        ExperienceYears: Number(formData.ExperienceYears),
      };

      const response = await doctorApi.createDoctor(dataToSend);

      setSubmitStatus("success");
      setNotification(
        response?.Message ||
          `Doctor account for ${formData.Name} has been created successfully!`
      );

      setTimeout(() => {
        onSubmit();
        onClose();
      }, 2000);
    } catch (err) {
      interface ValidationError {
        response?: {
          data?: {
            errors?: Record<string, string[]>;
            message?: string;
          };
        };
        message?: string;
      }

      const error = err as ValidationError;
      let detailedMessage = "Failed to create doctor account.";

      if (error.response && error.response.data && error.response.data.errors) {
        const validationErrors = error.response.data.errors;
        const messages: string[] = [];

        for (const field in validationErrors) {
          if (validationErrors.hasOwnProperty(field)) {
            messages.push(`${field}: ${validationErrors[field].join(", ")}`);
          }
        }

        detailedMessage = messages.join(" | ");
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        detailedMessage = error.response.data.message;
      } else if (error.message) {
        detailedMessage = error.message;
      }

      setSubmitStatus("error");
      setNotification(detailedMessage);

      setTimeout(() => {
        setSubmitStatus("idle");
        setNotification("");
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <Modal
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <CloseButton
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X />
          </CloseButton>

          <Header>
            <HeaderIcon>
              <UserCog />
            </HeaderIcon>
            <HeaderContent>
              <h2>Create Doctor Account</h2>
              <p>Fill in the details to create a new doctor account</p>
            </HeaderContent>
          </Header>

          <Form onSubmit={handleSubmit}>
            <FormGrid>
              {/* Column 1 */}
              <FormGroup>
                <Label htmlFor="Name">
                  Full Name <Required>*</Required>
                </Label>
                <InputWrapper>
                  <InputIcon>
                    <User />
                  </InputIcon>
                  <Input
                    type="text"
                    id="Name"
                    name="Name"
                    value={formData.Name}
                    onChange={handleInputChange}
                    placeholder="Nguyen Van A"
                    $hasError={!!errors.Name}
                  />
                </InputWrapper>
                {errors.Name && (
                  <ErrorMessage>
                    <XCircle />
                    {errors.Name}
                  </ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="Email">
                  Email <Required>*</Required>
                </Label>
                <InputWrapper>
                  <InputIcon>
                    <Mail />
                  </InputIcon>
                  <Input
                    type="email"
                    id="Email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleInputChange}
                    placeholder="doctor@example.com"
                    $hasError={!!errors.Email}
                  />
                </InputWrapper>
                {errors.Email && (
                  <ErrorMessage>
                    <XCircle />
                    {errors.Email}
                  </ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="Username">
                  Username <Required>*</Required>
                </Label>
                <InputWrapper>
                  <InputIcon>
                    <User />
                  </InputIcon>
                  <Input
                    type="text"
                    id="Username"
                    name="Username"
                    value={formData.Username}
                    onChange={handleInputChange}
                    placeholder="Username"
                    $hasError={!!errors.Username}
                  />
                </InputWrapper>
                {errors.Username && (
                  <ErrorMessage>
                    <XCircle />
                    {errors.Username}
                  </ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="Password">
                  Password <Required>*</Required>
                </Label>
                <InputWrapper>
                  <InputIcon>
                    <Lock />
                  </InputIcon>
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="Password"
                    name="Password"
                    value={formData.Password}
                    onChange={handleInputChange}
                    $hasError={!!errors.Password}
                    style={{ paddingRight: "calc(2.5rem + 32px)" }}
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </PasswordToggle>
                </InputWrapper>
                {errors.Password && (
                  <ErrorMessage>
                    <XCircle />
                    {errors.Password}
                  </ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="Phone">
                  Phone <Required>*</Required>
                </Label>
                <InputWrapper>
                  <InputIcon>
                    <Phone />
                  </InputIcon>
                  <Input
                    type="tel"
                    id="Phone"
                    name="Phone"
                    value={formData.Phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    $hasError={!!errors.Phone}
                  />
                </InputWrapper>
                {errors.Phone && (
                  <ErrorMessage>
                    <XCircle />
                    {errors.Phone}
                  </ErrorMessage>
                )}
              </FormGroup>

              {/* Column 2 */}
              <FormGroup>
                <Label htmlFor="Identification">
                  Identification (ID) <Required>*</Required>
                </Label>
                <InputWrapper>
                  <InputIcon>
                    <CreditCard />
                  </InputIcon>
                  <Input
                    type="text"
                    id="Identification"
                    name="Identification"
                    value={formData.Identification}
                    onChange={handleInputChange}
                    placeholder="Enter ID Card Number"
                    $hasError={!!errors.Identification}
                  />
                </InputWrapper>
                {errors.Identification && (
                  <ErrorMessage>
                    <XCircle />
                    {errors.Identification}
                  </ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="DateOfBirth">
                  Date of Birth <Required>*</Required>
                </Label>
                <DatePickerWrapper $hasError={!!errors.DateOfBirth}>
                  <InputIcon>
                    <Calendar />
                  </InputIcon>
                  <DatePicker
                    selected={startDate}
                    onChange={handleDateChange}
                    id="DateOfBirth"
                    name="DateOfBirth"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select date"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={70}
                    isClearable={false}
                  />
                </DatePickerWrapper>
                {errors.DateOfBirth && (
                  <ErrorMessage>
                    <XCircle />
                    {errors.DateOfBirth}
                  </ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="Gender">
                  Gender <Required>*</Required>
                </Label>
                <InputWrapper>
                  <InputIcon>
                    <Users />
                  </InputIcon>
                  <Select
                    id="Gender"
                    name="Gender"
                    value={formData.Gender}
                    onChange={handleInputChange}
                    $hasError={!!errors.Gender}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Select>
                </InputWrapper>
                {errors.Gender && (
                  <ErrorMessage>
                    <XCircle />
                    {errors.Gender}
                  </ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="Department">
                  Department <Required>*</Required>
                </Label>
                <InputWrapper>
                  <InputIcon>
                    <Building2 />
                  </InputIcon>
                  <Input
                    type="text"
                    id="Department"
                    name="Department"
                    value={formData.Department}
                    onChange={handleInputChange}
                    placeholder="e.g., Cardiology"
                    $hasError={!!errors.Department}
                  />
                </InputWrapper>
                {errors.Department && (
                  <ErrorMessage>
                    <XCircle />
                    {errors.Department}
                  </ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="ExperienceYears">
                  Experience (Years) <Required>*</Required>
                </Label>
                <InputWrapper>
                  <InputIcon>
                    <Briefcase />
                  </InputIcon>
                  <Input
                    type="number"
                    id="ExperienceYears"
                    name="ExperienceYears"
                    value={formData.ExperienceYears}
                    onChange={handleInputChange}
                    placeholder="0"
                    $hasError={!!errors.ExperienceYears}
                    min="0"
                  />
                </InputWrapper>
                {errors.ExperienceYears && (
                  <ErrorMessage>
                    <XCircle />
                    {errors.ExperienceYears}
                  </ErrorMessage>
                )}
              </FormGroup>
            </FormGrid>

            {submitStatus !== "idle" && notification && (
              <StatusMessage
                $type={submitStatus}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {submitStatus === "success" ? <CheckCircle /> : <XCircle />}
                {notification}
              </StatusMessage>
            )}

            <Actions>
              <CancelButton
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </CancelButton>
              <SubmitButton
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                <UserCog />
                {isSubmitting ? "Creating..." : "Create Account"}
              </SubmitButton>
            </Actions>
          </Form>
        </Modal>
      </Overlay>
    </AnimatePresence>
  );
};

export default ModernCreateDoctorModal;
