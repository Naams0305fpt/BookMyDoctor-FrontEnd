import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faYoutube,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import "./Footer.css";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    "Chính sách bảo mật",
    "Điều khoản sử dụng",
    "Câu hỏi thường gặp",
    "Cẩm nang",
    "Tư vấn miễn phí",
  ];

  return (
    <footer className="footer">
      {/* Wave shapes
      <div className="wave-top">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div> */}

      <div className="container">
        <div className="footer-content">
          {/* Left Column - Address & Contact */}
          <div className="footer-column">
            <div className="footer-section">
              <div className="section-header">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="section-icon"
                />
                <h4>Address</h4>
              </div>
              <p>FPT University Quy Nhon AI Campus</p>
            </div>

            <div className="footer-section">
              <div className="section-header">
                <FontAwesomeIcon icon={faPhone} className="section-icon" />
                <h4>Contact us</h4>
              </div>
              <div className="contact-info">
                <div className="contact-item">
                  <FontAwesomeIcon icon={faPhone} className="contact-icon" />
                  <span>Hotline: 1900 9000</span>
                </div>
                <div className="contact-item">
                  <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
                  <span>info@bookmydoctor.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column - Logo */}
          <div className="footer-column center-column">
            <div className="footer-logo">
              <img src="/images/logo-non.png" alt="" />
            </div>
          </div>

          {/* Right Column - Links */}
          <div className="footer-column">
            <nav className="footer-links">
              {footerLinks.map((link, index) => (
                <a
                  key={index}
                  href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                  className="footer-link"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="social-icons">
            <a
              href="https://tiktok.com"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <FontAwesomeIcon icon={faTiktok} />
            </a>
            <a
              href="https://facebook.com"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a
              href="https://youtube.com"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <FontAwesomeIcon icon={faYoutube} />
            </a>
          </div>

          <div className="copyright">
            <span>© Book My Doctor {currentYear}</span>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="wave-bottom">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,50 
             C300,90 900,10 1200,60 
             V120H0Z"
          ></path>
        </svg>
      </div>
    </footer>
  );
};

export default Footer;
