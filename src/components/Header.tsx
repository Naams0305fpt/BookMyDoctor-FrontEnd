import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/AuthContext";
import { useLoginModal } from "../contexts/LoginModalContext";
import UserMenu from "./UserMenu";
import "./Header.css";

const Header: React.FC = () => {
  // const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { openLogin } = useLoginModal();

  // const handleSearchFocus = () => {
  //   setIsSearchExpanded(true);
  // };

  // const handleSearchBlur = () => {
  //   if (!searchValue) {
  //     setIsSearchExpanded(false);
  //   }
  // };

  const isActiveLink = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.includes(path)) return true;
    return false;
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Left - Hamburger */}
          <button className="hamburger-btn" aria-label="Menu">
            <FontAwesomeIcon icon={faBars} />
          </button>

          {/* Left - Navigation */}
          <nav className="nav-links">
            <Link
              to="/"
              className={`nav-link ${isActiveLink("/") ? "active" : ""}`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`nav-link ${isActiveLink("/about") ? "active" : ""}`}
            >
              About
            </Link>
            <Link
              to="/information"
              className={`nav-link ${
                isActiveLink("/information") ? "active" : ""
              }`}
            >
              Information
            </Link>
            {/* Only show Get Pro for doctors */}
            {/* {user?.userType === "doctor" && (
              <Link
                to="/get-pro"
                className={`nav-link ${
                  isActiveLink("/get-pro") ? "active" : ""
                }`}
              >
                Get Pro
              </Link>
            )} */}
            {/*Only show Schedules for doctors */}
            {/* {user?.userType === "doctor" && (
              <Link
                to="#Schedules"
                className={`nav-link ${
                  isActiveLink("#Schedules") ? "active" : ""
                }`}
              >
                Schedules
              </Link>
            )} */}
            {/* Only show Demo link when not logged in */}
            {
              <Link
                to="/demo"
                className={`nav-link demo-link ${
                  isActiveLink("/demo") ? "active" : ""
                }`}
              >
                Demo
              </Link>
            }
          </nav>
          {/* Center - Logo */}
          <div className="logo-section">
            <img src="/images/logo.png" alt="logo" />
          </div>

          {/* Right - Search and Icons */}
          <div
            className={`right-section ${isAuthenticated ? "logged-in" : ""}`}
          >
            <div className={`search-container`}>
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search doctors, specialties..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                // onFocus={handleSearchFocus}
                // onBlur={handleSearchBlur}
              />
            </div>

            {/* User Authentication Icon - Shows login modal when not logged in, user menu when logged in */}
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <button
                className="icon-btn"
                onClick={openLogin}
                aria-label="Sign In"
              >
                <FontAwesomeIcon icon={faUser} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
