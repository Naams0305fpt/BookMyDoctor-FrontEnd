import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faCheckCircle,
  faSpinner,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useNotification } from "../../contexts/NotificationContext";
import "./EmailVerification.css";

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
  mode?: "signup" | "reset";
  showEmailInput?: boolean;
  onEmailChange?: (email: string) => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  onVerified,
  mode = "signup",
  showEmailInput = false,
  onEmailChange,
}) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const { showNotification } = useNotification();

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendVerificationCode = async () => {
    // Validate email first
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setSendingCode(true);
    setError("");

    try {
      // Mock implementation - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Real API call (uncomment when backend is ready)
      // await api.sendVerificationCode({ email });

      setCodeSent(true);
      setCountdown(60); // 60 seconds countdown
      showNotification(
        "success",
        "Code Sent",
        `Verification code has been sent to ${email}`,
        4000
      );
    } catch (err: any) {
      setError(err.message || "Failed to send verification code");
      showNotification(
        "error",
        "Failed",
        "Could not send verification code. Please try again.",
        4000
      );
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setVerifyingCode(true);
    setError("");

    try {
      // Mock implementation - replace with actual API call
      //   await new Promise((resolve) => setTimeout(resolve, 1000));

      //   // Mock verification - accept "123456" as valid code
      if (verificationCode === "123456") {
        setIsVerified(true);
        showNotification(
          "success",
          "Email Verified",
          "Your email has been verified successfully!",
          3000
        );
        onVerified();
      } else {
        throw new Error("Invalid verification code");
      }

      // Real API call (uncomment when backend is ready)
      //   await api.verifyCode({ email, code: verificationCode });
      //   setIsVerified(true);
      //   showNotification(
      //     "success",
      //     "Email Verified",
      //     "Your email has been verified successfully!",
      //     3000
      //   );
      //   onVerified();
    } catch (err: any) {
      setError(err.message || "Invalid verification code");
      showNotification(
        "error",
        "Verification Failed",
        "Invalid verification code. Please try again.",
        4000
      );
    } finally {
      setVerifyingCode(false);
    }
  };

  return (
    <div className={`email-verification-container ${mode}`}>
      {showEmailInput && onEmailChange && (
        <div className="form-group">
          <label htmlFor="verification-email">Email Address</label>
          <div className="input-wrapper">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input
              type="email"
              id="verification-email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isVerified}
            />
            {isVerified && (
              <span className="verified-badge">
                <FontAwesomeIcon icon={faCheckCircle} />
              </span>
            )}
          </div>
        </div>
      )}

      {/* Verification Section - Always Visible */}
      {!isVerified && (
        <div className="verification-section">
          <div className="form-group">
            <label htmlFor="verificationCode">
              <FontAwesomeIcon icon={faShieldAlt} /> Verification Code
            </label>
            <div className="verification-input-group">
              <div className="input-wrapper">
                <input
                  type="text"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 6) {
                      setVerificationCode(value);
                    }
                  }}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="verification-code-input"
                />
              </div>
              <button
                type="button"
                className="send-code-btn"
                onClick={handleSendVerificationCode}
                disabled={sendingCode || countdown > 0 || !email}
              >
                {sendingCode ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : countdown > 0 ? (
                  `Resend (${countdown}s)`
                ) : codeSent ? (
                  "Resend Code"
                ) : (
                  "Send Code"
                )}
              </button>
            </div>
            <button
              type="button"
              className="verify-btn"
              onClick={handleVerifyCode}
              disabled={
                verifyingCode ||
                !verificationCode ||
                verificationCode.length !== 6
              }
            >
              {verifyingCode ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Verifying...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCheckCircle} />
                  Verify Code
                </>
              )}
            </button>
            {error && <div className="verification-error">{error}</div>}
          </div>
          <div className="verification-info">
            <FontAwesomeIcon icon={faEnvelope} />
            <span>
              {codeSent
                ? "Please check your email for the verification code"
                : "Click 'Send Code' to receive a verification code"}
            </span>
          </div>
        </div>
      )}

      {isVerified && (
        <div className="verified-message">
          <FontAwesomeIcon icon={faCheckCircle} />
          <span>Email verified successfully!</span>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
