import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faSearch, 
  faUser, 
  faClock,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header: React.FC = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSearchFocus = () => {
    setIsSearchExpanded(true);
  };

  const handleSearchBlur = () => {
    if (!searchValue) {
      setIsSearchExpanded(false);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Left - Hamburger */}
          <button className="hamburger-btn" aria-label="Menu">
            <FontAwesomeIcon icon={faBars} />
          </button>

          {/* Center-left - Logo */}
          <div className="logo-section">
            <div className="logo-circle">
              <FontAwesomeIcon icon={faPlus} className="logo-icon" />
            </div>
            <span className="logo-text">BOOK MY DOCTOR</span>
          </div>

          {/* Center - Navigation */}
          <nav className="nav-links">
            <a href="#home" className="nav-link">Home</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#information" className="nav-link">Information</a>
            <a href="#get-pro" className="nav-link">Get Pro</a>
          </nav>

          {/* Right - Search and Icons */}
          <div className="right-section">
            <div className={`search-container ${isSearchExpanded ? 'expanded' : ''}`}>
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search doctors, specialties..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
              />
            </div>
            
            <button className="icon-btn" aria-label="Profile">
              <FontAwesomeIcon icon={faUser} />
            </button>
            
            <button className="icon-btn" aria-label="History">
              <FontAwesomeIcon icon={faClock} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;