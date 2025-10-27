import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faInfoCircle, 
  faCheckCircle, 
  faExclamationTriangle, 
  faTimes,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import './Notification.css';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface NotificationProps {
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return faCheckCircle;
      case 'warning':
        return faExclamationTriangle;
      case 'error':
        return faTimesCircle;
      default:
        return faInfoCircle;
    }
  };

  return (
    <div className={`notification notification-${type} ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="notification-icon">
        <FontAwesomeIcon icon={getIcon()} />
      </div>
      <div className="notification-content">
        <h4 className="notification-title">{title}</h4>
        <p className="notification-message">{message}</p>
      </div>
      <button className="notification-close" onClick={() => setIsVisible(false)}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

export default Notification;