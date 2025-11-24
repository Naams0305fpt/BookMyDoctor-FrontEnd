import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "@emotion/styled";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Mail,
  UserPlus,
  Loader,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import { useLoginModal } from "../../contexts/LoginModalContext";
import { theme } from "../../styles/theme";

interface SignUpProps {
  onClose: () => void;
}

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: ${theme.zIndex.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[4]};
`;

const ModalContainer = styled(motion.div)`
  background: white;
  border-radius: ${theme.borderRadius["3xl"]};
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: ${theme.colors.shadow.xl};
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${theme.spacing[6]};
  right: ${theme.spacing[6]};
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.full};
  border: none;
  background: ${theme.colors.gray[100]};
  color: ${theme.colors.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};
  z-index: 1;

  &:hover {
    background: ${theme.colors.gray[200]};
    transform: rotate(90deg);
  }
`;

const ModalHeader = styled.div`
  text-align: center;
  padding: ${theme.spacing[12]} ${theme.spacing[8]} ${theme.spacing[8]};
  background: ${theme.colors.background.gradient.primary};
  border-radius: ${theme.borderRadius["3xl"]} ${theme.borderRadius["3xl"]} 0 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -20%;
    width: 300px;
    height: 300px;
    background: radial-gradient(
      circle,
      ${theme.colors.primary.teal}25 0%,
      transparent 70%
    );
    border-radius: 50%;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -30%;
    right: -10%;
    width: 250px;
    height: 250px;
    background: radial-gradient(
      circle,
      ${theme.colors.secondary.blue}20 0%,
      transparent 70%
    );
    border-radius: 50%;
  }
`;

const LogoContainer = styled.div`
  position: relative;
  z-index: 1;
  margin-bottom: ${theme.spacing[6]};
`;

const Logo = styled.img`
  height: 80px;
  margin: 0 auto;
  display: block;
  filter: drop-shadow(${theme.colors.shadow.lg});
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;

const Title = styled.h2`
  font-size: ${theme.typography.fontSize["4xl"]};
  font-weight: ${theme.typography.fontWeight.extrabold};
  background: linear-gradient(
    135deg,
    ${theme.colors.accent.navy} 0%,
    ${theme.colors.primary.teal} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${theme.spacing[3]};
  position: relative;
  z-index: 1;
`;

const Subtitle = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  position: relative;
  z-index: 1;
`;

const ModalBody = styled.div`
  padding: ${theme.spacing[8]};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[4]};

  @media (max-width: ${theme.breakpoints.sm}) {
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
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: ${theme.spacing[4]};
  color: ${theme.colors.text.secondary};
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]} ${theme.spacing[3]}
    ${theme.spacing[12]};
  border: 2px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.base};
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.teal};
    box-shadow: 0 0 0 3px ${theme.colors.primary.teal}15;
  }

  &::placeholder {
    color: ${theme.colors.text.tertiary};
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: ${theme.spacing[4]};
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.text.secondary};
  display: flex;
  align-items: center;
  padding: ${theme.spacing[2]};
  transition: color ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover {
    color: ${theme.colors.primary.teal};
  }
`;

const ErrorMessage = styled(motion.div)`
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  background: ${theme.colors.error}10;
  border: 1px solid ${theme.colors.error};
  border-radius: ${theme.borderRadius.lg};
  color: ${theme.colors.error};
  font-size: ${theme.typography.fontSize.sm};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  background: ${theme.colors.background.gradient.cta};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[2]};
  box-shadow: ${theme.colors.shadow.md};
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover:not(:disabled) {
    box-shadow: ${theme.colors.shadow.lg};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ModalFooter = styled.div`
  padding: ${theme.spacing[6]} ${theme.spacing[8]} ${theme.spacing[8]};
  text-align: center;
`;

const FooterText = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};

  button {
    background: none;
    border: none;
    color: ${theme.colors.primary.teal};
    font-weight: ${theme.typography.fontWeight.semibold};
    cursor: pointer;
    padding: 0;
    margin-left: ${theme.spacing[1]};
    transition: color ${theme.transitions.duration.fast}
      ${theme.transitions.easing.default};

    &:hover {
      color: ${theme.colors.primary.dark};
      text-decoration: underline;
    }
  }
`;

const ModernSignUp: React.FC<SignUpProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    Username: "",
    Email: "",
    Phone: "",
    Password: "",
    ConfirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const { register, isLoading } = useAuth();
  const { showNotification } = useNotification();
  const { openLogin } = useLoginModal();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (Object.values(formData).some((value) => !value)) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.Password !== formData.ConfirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.Password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!/^\d{10}$/.test(formData.Phone)) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    try {
      const result = await register({
        Username: formData.Username,
        Password: formData.Password,
        ConfirmPassword: formData.ConfirmPassword,
        Email: formData.Email,
        Phone: formData.Phone,
      });

      if (result.success) {
        showNotification(
          "success",
          "Welcome!",
          "Your account has been successfully created.",
          3000
        );
        onClose();
        openLogin();
      } else {
        setError(result.message || "Failed to create account");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to create account. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ModalContainer
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>

        <ModalHeader>
          <LogoContainer>
            <Logo src="/images/logo.png" alt="BookMyDoctor" />
          </LogoContainer>
          <Title>Create Account</Title>
          <Subtitle>Join BookMyDoctor today</Subtitle>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="username">Username</Label>
              <InputWrapper>
                <InputIcon>
                  <User size={20} />
                </InputIcon>
                <Input
                  type="text"
                  id="username"
                  name="Username"
                  value={formData.Username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                />
              </InputWrapper>
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <InputWrapper>
                  <InputIcon>
                    <Mail size={20} />
                  </InputIcon>
                  <Input
                    type="email"
                    id="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                  />
                </InputWrapper>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="phone">Phone Number</Label>
                <InputWrapper>
                  <InputIcon>
                    <Phone size={20} />
                  </InputIcon>
                  <Input
                    type="tel"
                    id="phone"
                    name="Phone"
                    value={formData.Phone}
                    onChange={handleChange}
                    placeholder="0123456789"
                    required
                  />
                </InputWrapper>
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <InputWrapper>
                <InputIcon>
                  <Lock size={20} />
                </InputIcon>
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="Password"
                  value={formData.Password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  required
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </PasswordToggle>
              </InputWrapper>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <InputWrapper>
                <InputIcon>
                  <Lock size={20} />
                </InputIcon>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="ConfirmPassword"
                  value={formData.ConfirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  required
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </PasswordToggle>
              </InputWrapper>
            </FormGroup>

            <AnimatePresence>
              {error && (
                <ErrorMessage
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {error}
                </ErrorMessage>
              )}
            </AnimatePresence>

            <SubmitButton
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Create Account
                </>
              )}
            </SubmitButton>
          </Form>
        </ModalBody>

        <ModalFooter>
          <FooterText>
            Already have an account?
            <button
              type="button"
              onClick={() => {
                onClose();
                openLogin();
              }}
            >
              Sign in here
            </button>
          </FooterText>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ModernSignUp;
