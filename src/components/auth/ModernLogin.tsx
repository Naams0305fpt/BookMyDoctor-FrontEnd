import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "@emotion/styled";
import { User, Lock, Eye, EyeOff, LogIn, Loader, X } from "lucide-react";
import ModernResetPassword from "./ModernResetPassword";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import { useSignUpModal } from "../../contexts/SignUpModalContext";
import { theme } from "../../styles/theme";

interface LoginProps {
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
      ${theme.colors.primary.teal}20 0%,
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
      ${theme.colors.secondary.blue}15 0%,
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
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
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
  gap: ${theme.spacing[5]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.label`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
`;

const ForgotLink = styled.button`
  background: none;
  border: none;
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.primary.teal};
  cursor: pointer;
  padding: 0;
  font-weight: ${theme.typography.fontWeight.medium};
  transition: color ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover {
    color: ${theme.colors.primary.dark};
    text-decoration: underline;
  }
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
  margin-bottom: ${theme.spacing[3]};

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

const GuestLink = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
  cursor: pointer;
  padding: 0;
  transition: color ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover {
    color: ${theme.colors.primary.teal};
    text-decoration: underline;
  }
`;

const ModernLogin: React.FC<LoginProps> = ({ onClose }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const { showNotification } = useNotification();
  const { openSignUp } = useSignUpModal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await login(identifier, password);
      showNotification(
        "success",
        "Welcome Back!",
        "You have successfully signed in to your account.",
        3000
      );
      onClose();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence mode="wait">
        {!showResetPassword ? (
          <ModalContainer
            key="login"
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
              <Title>Welcome Back</Title>
              <Subtitle>Sign in to your BookMyDoctor account</Subtitle>
            </ModalHeader>

            <ModalBody>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label htmlFor="identifier">Username, Phone or Email</Label>
                  <InputWrapper>
                    <InputIcon>
                      <User size={20} />
                    </InputIcon>
                    <Input
                      type="text"
                      id="identifier"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Enter your phone or email"
                      required
                    />
                  </InputWrapper>
                </FormGroup>

                <FormGroup>
                  <LabelRow>
                    <Label htmlFor="password">Password</Label>
                    <ForgotLink
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowResetPassword(true);
                      }}
                    >
                      Forgot Password?
                    </ForgotLink>
                  </LabelRow>
                  <InputWrapper>
                    <InputIcon>
                      <Lock size={20} />
                    </InputIcon>
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
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
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn size={20} />
                      Sign In
                    </>
                  )}
                </SubmitButton>
              </Form>
            </ModalBody>

            <ModalFooter>
              <FooterText>
                Don't have an account?
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openSignUp();
                  }}
                >
                  Sign up here
                </button>
              </FooterText>
              <GuestLink onClick={onClose}>Continue as guest</GuestLink>
            </ModalFooter>
          </ModalContainer>
        ) : (
          <ModernResetPassword
            key="reset"
            onClose={onClose}
            onBack={() => setShowResetPassword(false)}
          />
        )}
      </AnimatePresence>
    </ModalOverlay>
  );
};

export default ModernLogin;
