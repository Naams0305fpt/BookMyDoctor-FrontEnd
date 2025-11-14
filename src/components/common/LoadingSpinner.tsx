import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Loading Spinner Component
 * Used as fallback for Suspense lazy loading
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'medium' 
}) => {
  return (
    <div className={`loading-spinner-container ${size}`}>
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
