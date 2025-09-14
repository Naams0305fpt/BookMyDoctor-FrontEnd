import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import "./Hero.css";

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  const scrollToBooking = () => {
    const bookingSection = document.getElementById("booking-section");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const heroImages = [
    {
      leftImage: '/images/doctor-examining-child-1.png', // Doctor examining child
      rightImage: '/images/doctor-consultation-1.png', // Doctor talking to patient
      alt: 'Medical care slide 1'
    },
    {
      leftImage: '/images/doctor-examining-child-2.png', // Another medical scene
      rightImage: '/images/doctor-consultation-2.png', // Another consultation
      alt: 'Medical care slide 2'
    },
    {
      leftImage: '/images/doctor-examining-child-3.png', // Third medical scene
      rightImage: '/images/doctor-consultation-3.png', // Third consultation
      alt: 'Medical care slide 3'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          {/* Background Images */}
          <div className="hero-images">
            {heroImages.map((slide, index) => (
              <div
                key={index}
                className={`hero-slide ${
                  index === currentSlide ? "active" : ""
                }`}
              >
                <div className="hero-image left-image">
                  <img src="/images/doctor1.png" />
                </div>
                <div className="hero-image right-image">
                  <img src="/images/doctor2.png" />
                </div>
              </div>
            ))}
          </div>

          {/* Hero Text Overlay */}
          <div className="hero-text">
            <h1>
              <span className="care-script">Care</span>
              <span className="like-mother">LIKE A MOTHER</span>
            </h1>

            <button
              className="btn btn-primary cta-button"
              onClick={scrollToBooking}
            >
              Booking now ...
            </button>
          </div>

          {/* Hotline Badge */}
          <div className="hotline-badge">
            <FontAwesomeIcon icon={faPhone} className="hotline-icon" />
            <span>Hotline: 1900 9000</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
