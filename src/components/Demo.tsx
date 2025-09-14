import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserShield, 
  faUserMd, 
  faUserInjured,
  faSignInAlt,
  faCheckCircle,
  faCrown
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import './Demo.css';

const Demo: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  const demoUsers = [
    {
      email: 'admin@bookmydoctor.com',
      name: 'Dr. Admin Smith',
      type: 'Admin',
      icon: faUserShield,
      color: 'admin',
      description: 'Full system access and management capabilities',
      features: ['User Management', 'System Configuration', 'Reports & Analytics', 'Doctor Verification']
    },
    {
      email: 'doctor@bookmydoctor.com',
      name: 'Dr. Sarah Johnson',
      type: 'Doctor',
      icon: faUserMd,
      color: 'doctor',
      description: 'Access to Get Pro features and patient management',
      features: ['Get Pro Access', 'Patient Management', 'Appointment Scheduling', 'Medical Records'],
      specialization: 'Cardiology',
      isVerified: true
    },
    {
      email: 'patient@bookmydoctor.com',
      name: 'John Doe',
      type: 'Patient',
      icon: faUserInjured,
      color: 'patient',
      description: 'Book appointments and manage health records',
      features: ['Book Appointments', 'View Medical History', 'Doctor Search', 'Health Tracking']
    }
  ];

  return (
    <div className="demo-section">
      <div className="container">
        <div className="demo-header">
          <h1>BookMyDoctor Login Demo</h1>
          <p>Experience different user roles and their unique features</p>
        </div>

        {isAuthenticated && user && (
          <div className="current-user-card">
            <div className="user-avatar-demo">
              <FontAwesomeIcon icon={
                user.userType === 'admin' ? faUserShield :
                user.userType === 'doctor' ? faUserMd : faUserInjured
              } />
            </div>
            <div className="user-info-demo">
              <h3>Currently logged in as:</h3>
              <h2>{user.name}</h2>
              <span className={`user-badge-demo ${user.userType}`}>
                {user.userType === 'doctor' && user.isVerified && (
                  <FontAwesomeIcon icon={faCrown} className="verified-icon" />
                )}
                {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
              </span>
              {user.userType === 'doctor' && user.specialization && (
                <p className="specialization-demo">{user.specialization}</p>
              )}
            </div>
            <div className="status-indicator">
              <FontAwesomeIcon icon={faCheckCircle} />
              <span>Active Session</span>
            </div>
          </div>
        )}

        <div className="demo-users-grid">
          {demoUsers.map((demoUser, index) => (
            <div key={index} className={`demo-user-card ${demoUser.color}`}>
              <div className="demo-user-header">
                <div className={`demo-user-avatar ${demoUser.color}`}>
                  <FontAwesomeIcon icon={demoUser.icon} />
                </div>
                <div className="demo-user-info">
                  <h3>{demoUser.name}</h3>
                  <div className="demo-user-type">
                    {demoUser.type === 'Doctor' && demoUser.isVerified && (
                      <FontAwesomeIcon icon={faCrown} className="verified-icon" />
                    )}
                    {demoUser.type}
                  </div>
                  {demoUser.specialization && (
                    <p className="demo-specialization">{demoUser.specialization}</p>
                  )}
                </div>
              </div>

              <p className="demo-description">{demoUser.description}</p>

              <div className="demo-features">
                <h4>Key Features:</h4>
                <ul>
                  {demoUser.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="demo-credentials">
                <p><strong>Email:</strong> {demoUser.email}</p>
                <p><strong>Password:</strong> demo123</p>
              </div>

              <button className="demo-login-btn">
                <FontAwesomeIcon icon={faSignInAlt} />
                <span>Try This Account</span>
              </button>
            </div>
          ))}
        </div>

        <div className="demo-instructions">
          <h2>How to Test</h2>
          <ol>
            <li>Click the "Sign In" button in the header</li>
            <li>Use any of the demo credentials above</li>
            <li>Explore the different features available to each user type</li>
            <li>Notice that "Get Pro" only appears for doctors</li>
            <li>Try accessing /get-pro directly with different user types</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Demo;