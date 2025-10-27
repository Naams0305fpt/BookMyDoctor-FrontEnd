import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUserMd, faHeart, faShieldAlt, faAward } from '@fortawesome/free-solid-svg-icons';
import './About.css';

const About: React.FC = () => {
  const features = [
    {
      icon: faUserMd,
      title: 'Expert Doctors',
      description: 'Our network includes highly qualified doctors across various specialties, ensuring you receive the best medical care.'
    },
    {
      icon: faHeart,
      title: 'Care Like Family',
      description: 'We treat every patient with the love and attention of family members, providing compassionate healthcare services.'
    },
    {
      icon: faShieldAlt,
      title: 'Secure & Private',
      description: 'Your medical information is protected with the highest security standards and complete privacy protocols.'
    },
    {
      icon: faAward,
      title: 'Quality Service',
      description: 'We are committed to delivering exceptional healthcare services with a focus on patient satisfaction and outcomes.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Qualified Doctors' },
    { number: '10,000+', label: 'Happy Patients' },
    { number: '15+', label: 'Medical Specialties' },
    { number: '24/7', label: 'Support Available' }
  ];

  return (
    <section className="about-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-title">
            <FontAwesomeIcon icon={faPlus} className="title-icon" />
            <h2>About Book My Doctor</h2>
          </div>
        </div>

        {/* Hero Content */}
        <div className="about-hero">
          <div className="hero-content">
            <div className="hero-text">
              <h3>
                <span className="care-script">Care</span>
                <span className="like-mother">LIKE A MOTHER</span>
              </h3>
              <p className="hero-description">
                At Book My Doctor, we believe healthcare should be accessible, comfortable, and delivered with the same care and attention you would receive from a loving mother. Our platform connects you with experienced medical professionals who share our commitment to compassionate care.
              </p>
            </div>
            <div className="hero-image">
              <img 
                src="/images/doctor-consultation-1.png" 
                alt="Doctor consultation"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.background = 'linear-gradient(135deg, #C8F3E1, #A8E1EA)';
                  target.style.display = 'flex';
                  target.style.alignItems = 'center';
                  target.style.justifyContent = 'center';
                  target.style.color = '#113B57';
                  target.style.fontSize = '18px';
                  target.style.fontWeight = '600';
                  target.alt = 'Healthcare Professional';
                }}
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h3 className="features-title">Why Choose Book My Doctor?</h3>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <FontAwesomeIcon icon={feature.icon} />
                </div>
                <h4 className="feature-title">{feature.title}</h4>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="mission-section">
          <div className="mission-content">
            <h3>Our Mission</h3>
            <p>
              To revolutionize healthcare accessibility by providing a seamless platform that connects patients with qualified medical professionals. We strive to make quality healthcare as accessible as a click, ensuring every individual receives the care they deserve with the warmth and attention of a mother's care.
            </p>
            <div className="mission-values">
              <div className="value-item">
                <strong>Compassion:</strong> We approach every interaction with empathy and understanding.
              </div>
              <div className="value-item">
                <strong>Excellence:</strong> We maintain the highest standards in medical care and service delivery.
              </div>
              <div className="value-item">
                <strong>Accessibility:</strong> We make healthcare available to everyone, everywhere.
              </div>
              <div className="value-item">
                <strong>Trust:</strong> We build lasting relationships based on reliability and transparency.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;