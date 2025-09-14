import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faLock, 
  faEye, 
  faEyeSlash,
  faSignInAlt,
  faSpinner,
  faUserMd,
  faUserShield,
  faUserInjured
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import './Login.css';

interface LoginProps {
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const { showNotification } = useNotification();

  const demoAccounts = [
    {
      email: 'admin@bookmydoctor.com',
      type: 'Admin',
      icon: faUserShield,
      description: 'Full system access'
    },
    {
      email: 'doctor@bookmydoctor.com',
      type: 'Doctor',
      icon: faUserMd,
      description: 'Access to Get Pro features'
    },
    {
      email: 'patient@bookmydoctor.com',
      type: 'Patient',
      icon: faUserInjured,
      description: 'Book appointments'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await login(email, password);
    if (success) {
      showNotification(
        'success',
        'Welcome Back!',
        'You have successfully signed in to your account.',
        3000
      );
      onClose();
    } else {
      setError('Invalid email or password');
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your BookMyDoctor account</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faUser} className="input-icon" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                Signing in...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSignInAlt} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="demo-section">
          <div className="divider">
            <span>Try Demo Accounts</span>
          </div>
          
          <div className="demo-accounts">
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                className="demo-account-btn"
                onClick={() => handleDemoLogin(account.email)}
                type="button"
              >
                <div className="demo-icon">
                  <FontAwesomeIcon icon={account.icon} />
                </div>
                <div className="demo-info">
                  <span className="demo-type">{account.type}</span>
                  <span className="demo-description">{account.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="login-footer">
          <p>Don't have an account? <a href="#signup">Sign up here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;