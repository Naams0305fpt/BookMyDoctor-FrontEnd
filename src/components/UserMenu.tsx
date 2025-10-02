import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignOutAlt,
  faChevronDown,
  faCrown,
  faUserShield,
  faUserMd,
  faUserInjured,
  faCog,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth, UserType } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import "./UserMenu.css";

const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { showNotification } = useNotification();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getUserIcon = (userType: UserType) => {
    switch (userType) {
      case "admin":
        return faUserShield;
      case "doctor":
        return faUserMd;
      case "patient":
        return faUserInjured;
      default:
        return faUser;
    }
  };

  const getUserBadgeColor = (userType: UserType) => {
    switch (userType) {
      case "admin":
        return "admin";
      case "doctor":
        return "doctor";
      case "patient":
        return "patient";
      default:
        return "patient";
    }
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    showNotification(
      "success",
      "Signed Out",
      "You have been successfully signed out.",
      3000
    );
  };

  if (!user) return null;

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="user-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="user-info-container">
          <div className="user-avatar">
            <FontAwesomeIcon icon={getUserIcon(user.userType)} />
          </div>
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className={`user-type ${getUserBadgeColor(user.userType)}`}>
              {user.userType === "doctor" && user.isVerified && (
                <FontAwesomeIcon icon={faCrown} className="verified-icon" />
              )}
              {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
            </span>
          </div>
        </div>
        <div className="dropdown-icon">
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`dropdown-arrow ${isOpen ? "open" : ""}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="user-dropdown">
          <div className="dropdown-header">
            <div className="user-avatar-large">
              <FontAwesomeIcon icon={getUserIcon(user.userType)} />
            </div>
            <div className="user-details">
              <h4>{user.name}</h4>
              <p>{user.email}</p>
              {user.userType === "doctor" && user.specialization && (
                <p className="specialization">{user.specialization}</p>
              )}
              <span
                className={`user-badge ${getUserBadgeColor(user.userType)}`}
              >
                {user.userType === "doctor" && user.isVerified && (
                  <FontAwesomeIcon icon={faCrown} className="verified-icon" />
                )}
                {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
              </span>
            </div>
          </div>

          <div className="dropdown-divider"></div>

          <div className="dropdown-menu">
            <button className="menu-item">
              <FontAwesomeIcon icon={faUser} />
              <span>Profile</span>
            </button>
            <button className="menu-item">
              <FontAwesomeIcon icon={faCalendarAlt} />
              <span>Booking History</span>
            </button>
            <button className="menu-item">
              <FontAwesomeIcon icon={faCog} />
              <span>Settings</span>
            </button>
            <button className="menu-item logout" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
