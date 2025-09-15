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
      leftImage: "/images/doctor-examining-child-1.png", // Doctor examining child
      rightImage: "/images/doctor-consultation-1.png", // Doctor talking to patient
      alt: "Medical care slide 1",
    },
    {
      leftImage: "/images/doctor-examining-child-2.png", // Another medical scene
      rightImage: "/images/doctor-consultation-2.png", // Another consultation
      alt: "Medical care slide 2",
    },
    {
      leftImage: "/images/doctor-examining-child-3.png", // Third medical scene
      rightImage: "/images/doctor-consultation-3.png", // Third consultation
      alt: "Medical care slide 3",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 7500);

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-contents">
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
                  <img
                    src={slide.leftImage}
                    alt={`${slide.alt} - left`}
                    onError={(e) => {
                      // Fallback for demo - create a colored placeholder
                      const target = e.target as HTMLImageElement;
                      target.style.background =
                        "linear-gradient(135deg, #C8F3E1, #A8E1EA)";
                      target.style.display = "flex";
                      target.style.alignItems = "center";
                      target.style.justifyContent = "center";
                      target.style.color = "#113B57";
                      target.style.fontSize = "18px";
                      target.style.fontWeight = "600";
                      target.alt = "Doctor examining child";
                      target.title = "Doctor examining child";
                    }}
                  />
                </div>
                <div className="hero-image right-image">
                  <img
                    src={slide.rightImage}
                    alt={`${slide.alt} - right`}
                    onError={(e) => {
                      // Fallback for demo - create a colored placeholder
                      const target = e.target as HTMLImageElement;
                      target.style.background =
                        "linear-gradient(135deg, #90B8F7, #A8E1EA)";
                      target.style.display = "flex";
                      target.style.alignItems = "center";
                      target.style.justifyContent = "center";
                      target.style.color = "#113B57";
                      target.style.fontSize = "18px";
                      target.style.fontWeight = "600";
                      target.alt = "Doctor consultation";
                      target.title = "Doctor consultation";
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Hero Text Overlay */}
          <div className="hero-texts">
            <h1>
              <span className="care-scripts">Care</span>
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

          {/* Carousel Dots */}
          <div className="carousel-dots">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => handleDotClick(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
