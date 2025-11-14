import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import AdminProfile from "../profiles/AdminProfile";
import DoctorProfile from "../profiles/DoctorProfile";
import ModernPatientProfile from "../profiles/ModernPatientProfile";

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="profile-container">
        <div className="not-authenticated">
          <h2>Authentication Required</h2>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const renderProfileByUserType = () => {
    switch (user.userType) {
      case "admin":
        return <AdminProfile />;
      case "doctor":
        return <DoctorProfile />;
      case "patient":
        return <ModernPatientProfile />;
      default:
        return <ModernPatientProfile />;
    }
  };

  return <div className="profile-page">{renderProfileByUserType()}</div>;
};

export default Profile;
