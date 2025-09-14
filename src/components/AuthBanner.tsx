import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faInfoCircle, 
  faUserShield, 
  faUserMd, 
  faUserInjured,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import './AuthBanner.css';

const AuthBanner: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    return (
      <div className="auth-banner authenticated">
        <div className="container">
          <div className="banner-content">
            <div className="banner-icon">
              <FontAwesomeIcon icon={
                user.userType === 'admin' ? faUserShield :
                user.userType === 'doctor' ? faUserMd : faUserInjured
              } />
            </div>
            <div className="banner-text">
              <span>Welcome back, <strong>{user.name}</strong>!</span>
              <span className="user-type-text">
                Logged in as {user.userType}
                {user.userType === 'doctor' && ' - Get Pro features available'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-banner demo">
      <div className="container">
        <div className="banner-content">
          <div className="banner-icon">
            <FontAwesomeIcon icon={faInfoCircle} />
          </div>
          <div className="banner-text">
            <span>New to BookMyDoctor? Try our login system!</span>
            <span className="demo-text">Experience different user roles and features</span>
          </div>
          <Link to="/demo" className="banner-cta">
            <span>View Demo</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthBanner;