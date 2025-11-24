import React from "react";
import "./ErrorBoundary.css";

/**
 * Booking Error Fallback
 * Displayed when the booking form component crashes
 */
export const BookingErrorFallback: React.FC = () => {
  return (
    <div className="error-boundary">
      <div className="error-boundary-content">
        <div className="error-icon">🩺</div>
        <h2 className="error-title">Unable to Load Booking Form</h2>
        <p className="error-message">
          We're experiencing technical difficulties with the appointment booking
          system. Please try again in a few moments.
        </p>
        <div className="error-actions">
          <button
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            🔄 Try Again
          </button>
          <button
            className="btn-secondary"
            onClick={() => (window.location.href = "/")}
          >
            🏠 Go Home
          </button>
        </div>
        <p className="error-help">
          Need immediate assistance? Call us at <strong>1-800-DOCTOR</strong> or{" "}
          <a href="mailto:support@bookmydoctor.com">email support</a>
        </p>
      </div>
    </div>
  );
};

/**
 * Dashboard Error Fallback
 * Displayed when dashboard components crash
 */
export const DashboardErrorFallback: React.FC = () => {
  return (
    <div className="error-boundary">
      <div className="error-boundary-content">
        <div className="error-icon">📊</div>
        <h2 className="error-title">Dashboard Unavailable</h2>
        <p className="error-message">
          We couldn't load your dashboard at this time. This might be a
          temporary issue.
        </p>
        <div className="error-actions">
          <button
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            🔄 Reload Dashboard
          </button>
          <button
            className="btn-secondary"
            onClick={() => (window.location.href = "/")}
          >
            🏠 Go Home
          </button>
        </div>
        <p className="error-help">
          If the problem persists, please{" "}
          <a href="mailto:support@bookmydoctor.com">contact support</a>
        </p>
      </div>
    </div>
  );
};

/**
 * Profile Error Fallback
 * Displayed when profile components crash
 */
export const ProfileErrorFallback: React.FC = () => {
  return (
    <div className="error-boundary">
      <div className="error-boundary-content">
        <div className="error-icon">👤</div>
        <h2 className="error-title">Profile Loading Error</h2>
        <p className="error-message">
          We couldn't load your profile information. Your data is safe, but
          there was a technical issue.
        </p>
        <div className="error-actions">
          <button
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            🔄 Reload Profile
          </button>
          <button
            className="btn-secondary"
            onClick={() => (window.location.href = "/")}
          >
            🏠 Go Home
          </button>
        </div>
        <p className="error-help">
          Need help? <a href="mailto:support@bookmydoctor.com">Contact us</a>
        </p>
      </div>
    </div>
  );
};

/**
 * Generic Page Error Fallback
 * Used for general page-level errors
 */
export const PageErrorFallback: React.FC = () => {
  return (
    <div className="error-boundary">
      <div className="error-boundary-content">
        <div className="error-icon">⚠️</div>
        <h2 className="error-title">Page Error</h2>
        <p className="error-message">
          This page encountered an unexpected error. Please try refreshing or
          return to the home page.
        </p>
        <div className="error-actions">
          <button
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            🔄 Refresh Page
          </button>
          <button
            className="btn-secondary"
            onClick={() => (window.location.href = "/")}
          >
            🏠 Go Home
          </button>
        </div>
      </div>
    </div>
  );
};
