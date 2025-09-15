import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faCrown,
  faCheck,
  faCalendarCheck,
  faUserMd,
  faClock,
  faShieldAlt,
  faHeadset,
  faStar,
  faGift
} from '@fortawesome/free-solid-svg-icons';
import './GetPro.css';

const GetPro: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const features = [
    {
      icon: faCalendarCheck,
      title: 'Priority Booking',
      description: 'Skip the wait and get priority access to appointment slots with your preferred doctors.'
    },
    {
      icon: faUserMd,
      title: 'Dedicated Doctor',
      description: 'Get assigned to a dedicated primary care physician who knows your medical history.'
    },
    {
      icon: faClock,
      title: '24/7 Access',
      description: 'Round-the-clock access to medical consultations and emergency support.'
    },
    {
      icon: faShieldAlt,
      title: 'Premium Health Plans',
      description: 'Access to specialized treatment plans and comprehensive health monitoring.'
    },
    {
      icon: faHeadset,
      title: 'Concierge Support',
      description: 'Personal healthcare concierge to coordinate your appointments and medical needs.'
    },
    {
      icon: faGift,
      title: 'Exclusive Benefits',
      description: 'Access to exclusive health programs, workshops, and wellness resources.'
    }
  ];

  const plans = {
    monthly: {
      price: '$99',
      period: '/month',
      savings: null,
      features: [
        'All standard features included',
        'Priority booking (2-hour response)',
        'Dedicated doctor assignment',
        '24/7 emergency consultation',
        'Basic health monitoring',
        'Monthly health reports'
      ]
    },
    yearly: {
      price: '$990',
      period: '/year',
      savings: 'Save $198 annually',
      features: [
        'All monthly features included',
        'Priority booking (1-hour response)',
        'Dedicated doctor assignment',
        '24/7 emergency consultation',
        'Advanced health monitoring',
        'Weekly health reports',
        'Free annual health checkup',
        'Exclusive wellness programs',
        'Family member discounts',
        'Telehealth consultations'
      ]
    }
  };

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Pro Member since 2023',
      text: 'Book My Doctor Pro has transformed my healthcare experience. Having a dedicated doctor who knows my history makes all the difference.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Pro Member since 2022',
      text: 'The priority booking feature is incredible. I never have to wait for appointments anymore, and the 24/7 support gives me peace of mind.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Pro Member since 2023',
      text: 'Worth every penny! The comprehensive health monitoring and personalized care have helped me maintain better health than ever before.',
      rating: 5
    }
  ];

  const handleSubscribe = () => {
    // Handle subscription logic here
    alert(`Subscribing to ${selectedPlan} plan!`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FontAwesomeIcon
        key={index}
        icon={faStar}
        className={index < rating ? 'star-filled' : 'star-empty'}
      />
    ));
  };

  return (
    <section className="get-pro-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-title">
            <FontAwesomeIcon icon={faPlus} className="title-icon" />
            <h2>Get Pro Membership</h2>
          </div>
        </div>

        {/* Hero Section */}
        <div className="pro-hero">
          <div className="hero-content">
            <div className="hero-text">
              <div className="pro-badge">
                <FontAwesomeIcon icon={faCrown} className="crown-icon" />
                <span>PREMIUM</span>
              </div>
              <h3>
                <span className="care-script">Premium Care</span>
                <span className="like-mother">FOR YOUR FAMILY</span>
              </h3>
              <p className="hero-description">
                Elevate your healthcare experience with our Pro membership. Get priority access, dedicated doctors, and exclusive benefits designed to give you and your family the best possible care.
              </p>
              <div className="hero-stats">
                <div className="stat-item">
                  <strong>1000+</strong>
                  <span>Happy Pro Members</span>
                </div>
                <div className="stat-item">
                  <strong>98%</strong>
                  <span>Satisfaction Rate</span>
                </div>
                <div className="stat-item">
                  <strong>50%</strong>
                  <span>Faster Appointments</span>
                </div>
              </div>
            </div>
            <div className="hero-image">
              <img 
                src="/images/doctor-examining-child-2.png" 
                alt="Premium healthcare service"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.background = 'linear-gradient(135deg, #C8F3E1, #90B8F7)';
                  target.style.display = 'flex';
                  target.style.alignItems = 'center';
                  target.style.justifyContent = 'center';
                  target.style.color = '#113B57';
                  target.style.fontSize = '18px';
                  target.style.fontWeight = '600';
                  target.alt = 'Premium Care';
                }}
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h3 className="section-subtitle">Why Choose Pro?</h3>
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

        {/* Pricing Section */}
        <div className="pricing-section">
          <h3 className="section-subtitle">Choose Your Plan</h3>
          
          {/* Plan Toggle */}
          <div className="plan-toggle">
            <button 
              className={`toggle-btn ${selectedPlan === 'monthly' ? 'active' : ''}`}
              onClick={() => setSelectedPlan('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`toggle-btn ${selectedPlan === 'yearly' ? 'active' : ''}`}
              onClick={() => setSelectedPlan('yearly')}
            >
              Yearly
            </button>
          </div>

          {/* Pricing Card */}
          <div className="pricing-card">
            <div className="pricing-header">
              <div className="plan-badge">
                <FontAwesomeIcon icon={faCrown} />
                <span>PRO MEMBERSHIP</span>
              </div>
              <div className="price-display">
                <span className="price">{plans[selectedPlan].price}</span>
                <span className="period">{plans[selectedPlan].period}</span>
              </div>
              {plans[selectedPlan].savings && (
                <div className="savings-badge">{plans[selectedPlan].savings}</div>
              )}
            </div>

            <div className="features-list">
              {plans[selectedPlan].features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <FontAwesomeIcon icon={faCheck} className="check-icon" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button className="btn btn-primary subscribe-btn" onClick={handleSubscribe}>
              Start Pro Membership
            </button>

            <div className="guarantee">
              <p>30-day money-back guarantee • Cancel anytime</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="testimonials-section">
          <h3 className="section-subtitle">What Our Pro Members Say</h3>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-rating">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-card">
            <h3>Ready to Experience Premium Care?</h3>
            <p>Join thousands of satisfied members who trust Book My Doctor Pro for their healthcare needs.</p>
            <button className="btn btn-primary cta-btn" onClick={handleSubscribe}>
              Get Started Today
            </button>
            <div className="cta-note">
              <span>Questions? Call us at <strong>1900 9000</strong> for personalized assistance.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetPro;