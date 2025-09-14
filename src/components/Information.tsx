import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faInfoCircle, 
  faUserMd, 
  faClock, 
  faCalendarAlt,
  faStethoscope,
  faHeart,
  faBrain,
  faEye,
  faChild,
  faBone,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import './Information.css';

const Information: React.FC = () => {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  const departments = [
    {
      icon: faStethoscope,
      name: 'General Medicine',
      description: 'Comprehensive healthcare for adults, including preventive care, diagnosis, and treatment of common medical conditions.'
    },
    {
      icon: faHeart,
      name: 'Cardiology',
      description: 'Specialized care for heart and cardiovascular diseases, including diagnosis, treatment, and prevention.'
    },
    {
      icon: faBrain,
      name: 'Neurology',
      description: 'Expert care for nervous system disorders, brain health, and neurological conditions.'
    },
    {
      icon: faEye,
      name: 'Ophthalmology',
      description: 'Complete eye care services, from routine check-ups to complex eye surgeries.'
    },
    {
      icon: faChild,
      name: 'Pediatrics',
      description: 'Specialized medical care for infants, children, and adolescents up to 18 years.'
    },
    {
      icon: faBone,
      name: 'Orthopedics',
      description: 'Treatment of musculoskeletal system disorders, including bones, joints, and muscles.'
    }
  ];

  const operatingHours = [
    { day: 'Monday - Friday', hours: '8:00 AM - 8:00 PM', emergency: true },
    { day: 'Saturday', hours: '9:00 AM - 6:00 PM', emergency: true },
    { day: 'Sunday', hours: '10:00 AM - 4:00 PM', emergency: false },
    { day: 'Public Holidays', hours: '10:00 AM - 2:00 PM', emergency: false }
  ];

  const faqData = [
    {
      question: 'How do I book an appointment?',
      answer: 'You can easily book an appointment through our online booking form on the homepage. Simply fill in your details, select your preferred doctor and time slot, and submit the form. You will receive a confirmation within 24 hours.'
    },
    {
      question: 'Can I cancel or reschedule my appointment?',
      answer: 'Yes, you can cancel or reschedule your appointment up to 2 hours before the scheduled time. Please call our hotline at 1900 9000 or use our online portal to make changes.'
    },
    {
      question: 'What should I bring to my appointment?',
      answer: 'Please bring a valid ID, your insurance card (if applicable), a list of current medications, and any relevant medical records or test results from previous visits.'
    },
    {
      question: 'Do you accept insurance?',
      answer: 'We accept most major insurance plans. Please contact our office or check with your insurance provider to verify coverage before your appointment.'
    },
    {
      question: 'What if I need emergency care?',
      answer: 'For medical emergencies, please call emergency services immediately. Our clinic provides urgent care during operating hours. For after-hours emergencies, we have partnerships with local emergency facilities.'
    },
    {
      question: 'How long will my appointment take?',
      answer: 'Initial consultations typically take 30-45 minutes, while follow-up appointments usually last 15-30 minutes. Complex cases may require longer consultation times.'
    }
  ];

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <section className="information-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-title">
            <FontAwesomeIcon icon={faPlus} className="title-icon" />
            <h2>Information & Services</h2>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="quick-info">
          <div className="info-card">
            <FontAwesomeIcon icon={faUserMd} className="info-icon" />
            <h3>500+</h3>
            <p>Qualified Doctors</p>
          </div>
          <div className="info-card">
            <FontAwesomeIcon icon={faCalendarAlt} className="info-icon" />
            <h3>15+</h3>
            <p>Medical Specialties</p>
          </div>
          <div className="info-card">
            <FontAwesomeIcon icon={faClock} className="info-icon" />
            <h3>24/7</h3>
            <p>Emergency Support</p>
          </div>
        </div>

        {/* Medical Departments */}
        <div className="departments-section">
          <h3 className="section-subtitle">Our Medical Departments</h3>
          <div className="departments-grid">
            {departments.map((dept, index) => (
              <div key={index} className="department-card">
                <div className="department-icon">
                  <FontAwesomeIcon icon={dept.icon} />
                </div>
                <h4>{dept.name}</h4>
                <p>{dept.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Operating Hours */}
        <div className="hours-section">
          <div className="hours-content">
            <div className="hours-info">
              <h3 className="section-subtitle">Operating Hours</h3>
              <div className="hours-list">
                {operatingHours.map((schedule, index) => (
                  <div key={index} className="hours-item">
                    <div className="hours-day">{schedule.day}</div>
                    <div className="hours-time">{schedule.hours}</div>
                    {schedule.emergency && (
                      <div className="emergency-badge">Emergency Available</div>
                    )}
                  </div>
                ))}
              </div>
              <div className="emergency-info">
                <FontAwesomeIcon icon={faInfoCircle} className="info-icon-small" />
                <span>For urgent matters outside operating hours, please call our emergency hotline: <strong>1900 9000</strong></span>
              </div>
            </div>
            <div className="hours-image">
              <img 
                src="/images/doctor-consultation-2.png" 
                alt="Doctor consultation schedule"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.background = 'linear-gradient(135deg, #A8E1EA, #90B8F7)';
                  target.style.display = 'flex';
                  target.style.alignItems = 'center';
                  target.style.justifyContent = 'center';
                  target.style.color = '#113B57';
                  target.style.fontSize = '18px';
                  target.style.fontWeight = '600';
                  target.alt = 'Medical Schedule';
                }}
              />
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h3 className="section-subtitle">Frequently Asked Questions</h3>
          <div className="faq-container">
            {faqData.map((faq, index) => (
              <div key={index} className={`faq-item ${activeAccordion === index ? 'active' : ''}`}>
                <button 
                  className="faq-question"
                  onClick={() => toggleAccordion(index)}
                >
                  <span>{faq.question}</span>
                  <FontAwesomeIcon 
                    icon={activeAccordion === index ? faChevronUp : faChevronDown} 
                    className="faq-chevron"
                  />
                </button>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="contact-info-section">
          <div className="contact-card">
            <h3>Need More Information?</h3>
            <p>Our friendly staff is here to help you with any questions or concerns you may have.</p>
            <div className="contact-details">
              <div className="contact-item">
                <strong>Phone:</strong> 1900 9000
              </div>
              <div className="contact-item">
                <strong>Email:</strong> info@bookmydoctor.com
              </div>
              <div className="contact-item">
                <strong>Address:</strong> FPT University Quy Nhon AI Campus
              </div>
            </div>
            <button className="btn btn-primary contact-btn">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Information;