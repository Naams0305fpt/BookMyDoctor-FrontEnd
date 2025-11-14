import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "@emotion/styled";
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  Loader,
  Mail,
  Shield,
  X,
  KeyRound,
} from "lucide-react";
import { useNotification } from "../../contexts/NotificationContext";
import authApi from "../../services/api/auth.api";
import { theme } from "../../styles/theme";

interface ResetPasswordProps {
  onClose: () => void;
  onBack: () => void;
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
  max-width: 480px;
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

const BackButton = styled.button`
  position: absolute;
  top: ${theme.spacing[6]};
  left: ${theme.spacing[6]};
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
    right: -20%;
    width: 300px;
    height: 300px;
    background: radial-gradient(
      circle,
      ${theme.colors.accent.navy}20 0%,
      transparent 70%
    );
    border-radius: 50%;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 250px;
    height: 250px;
    background: radial-gradient(
      circle,
      ${theme.colors.primary.teal}15 0%,
      transparent 70%
    );
    border-radius: 50%;
  }
`;

const IconContainer = styled.div`
  position: relative;
  z-index: 1;
  margin: 0 auto ${theme.spacing[6]};
  width: 80px;
  height: 80px;
  background: ${theme.colors.background.gradient.cta};
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${theme.colors.shadow.lg};

  svg {
    color: white;
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
  gap: ${theme.spacing[5]};
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

const OtpRow = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
`;

const SendCodeButton = styled(motion.button)`
  padding: ${theme.spacing[3]} ${theme.spacing[5]};
  background: ${theme.colors.background.gradient.cta};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  white-space: nowrap;
  box-shadow: ${theme.colors.shadow.md};
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover:not(:disabled) {
    box-shadow: ${theme.colors.shadow.lg};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

const ModernResetPassword: React.FC<ResetPasswordProps> = ({
  onClose,
  onBack,
}) => {
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [step, setStep] = useState<"email" | "password">("email");
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { showNotification } = useNotification();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setSendingCode(true);
    setError("");
    try {
      await authApi.sendVerificationCode({
        Destination: email,
        Purpose: "ResetPassword",
        Channel: "email",
      });
      setCodeSent(true);
      setCountdown(60);
      showNotification("success", "Code Sent", `OTP sent to ${email}`, 4000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to send OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !otpCode || otpCode.length !== 6) {
      setError("Please enter a valid email and 6-digit OTP code.");
      return;
    }

    setVerifyingCode(true);
    try {
      const result = await authApi.verifyOtp({
        Destination: email,
        Purpose: "ResetPassword",
        OtpCode: otpCode,
        Channel: "email",
      });

      if (result && result.message === "Xác thực OTP thành công.") {
        setStep("password");
        setError("");
        showNotification(
          "success",
          "Verified",
          "OTP verified. Please set your new password.",
          3000
        );
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Invalid OTP code.";
      setError(errorMessage);
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await authApi.changePasswordWithOtp({
        NewPassword: newPassword,
        ConfirmNewPassword: confirmPassword,
      });

      showNotification(
        "success",
        "Password Reset",
        "Your password has been successfully reset.",
        3000
      );
      onBack();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to reset password.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
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
        <BackButton onClick={onBack}>
          <ArrowLeft size={20} />
        </BackButton>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>

        <ModalHeader>
          <IconContainer>
            {step === "email" ? <Shield size={40} /> : <KeyRound size={40} />}
          </IconContainer>
          <Title>{step === "email" ? "Reset Password" : "New Password"}</Title>
          <Subtitle>
            {step === "email"
              ? "Enter your email to receive OTP code"
              : "Create a new password for your account"}
          </Subtitle>
        </ModalHeader>

        <ModalBody>
          {step === "email" ? (
            <Form onSubmit={handleVerifyCode}>
              <FormGroup>
                <Label htmlFor="email">Email Address</Label>
                <InputWrapper>
                  <InputIcon>
                    <Mail size={20} />
                  </InputIcon>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </InputWrapper>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="otp">Verification Code</Label>
                <OtpRow>
                  <InputWrapper style={{ flex: 1 }}>
                    <InputIcon>
                      <Shield size={20} />
                    </InputIcon>
                    <Input
                      type="text"
                      id="otp"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="6-digit code"
                      maxLength={6}
                      required
                      disabled={!codeSent}
                    />
                  </InputWrapper>
                  <SendCodeButton
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingCode || countdown > 0}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {sendingCode ? (
                      <Loader className="animate-spin" size={16} />
                    ) : countdown > 0 ? (
                      `${countdown}s`
                    ) : codeSent ? (
                      "Resend"
                    ) : (
                      "Send Code"
                    )}
                  </SendCodeButton>
                </OtpRow>
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
                disabled={verifyingCode || !codeSent}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {verifyingCode ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Verifying...
                  </>
                ) : (
                  <>Continue</>
                )}
              </SubmitButton>
            </Form>
          ) : (
            <Form onSubmit={handleResetPassword}>
              <FormGroup>
                <Label htmlFor="newPassword">New Password</Label>
                <InputWrapper>
                  <InputIcon>
                    <Lock size={20} />
                  </InputIcon>
                  <Input
                    type={showNew ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
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
                    type={showConfirm ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    required
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
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
                    Resetting...
                  </>
                ) : (
                  <>Reset Password</>
                )}
              </SubmitButton>
            </Form>
          )}
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ModernResetPassword;
