import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faChevronLeft, 
  faChevronRight 
} from '@fortawesome/free-solid-svg-icons';
import './DoctorsCarousel.css';

interface Doctor {
  id: number;
  name: string;
  department: string;
  avatar: string;
}

const DoctorsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const doctors: Doctor[] = [
    {
      id: 1,
      name: 'Dt: Nguyen Van A',
      department: 'ENT Department',
      avatar: '/api/placeholder/220/220'
    },
    {
      id: 2,
      name: 'Dt: Nguyen Van B',
      department: 'Nutrition Department',
      avatar: '/api/placeholder/220/220'
    },
    {
      id: 3,
      name: 'Dt: Nguyen Van C',
      department: 'Neurology Department',
      avatar: '/api/placeholder/220/220'
    },
    {
      id: 4,
      name: 'Dt: Nguyen Van D',
      department: 'Cardiology Department',
      avatar: '/api/placeholder/220/220'
    },
    {
      id: 5,
      name: 'Dt: Nguyen Van E',
      department: 'Pediatrics Department',
      avatar: '/api/placeholder/220/220'
    }
  ];

  const itemsPerView = {
    desktop: 3,
    tablet: 2,
    mobile: 1
  };

  const nextSlide = () => {
    const maxIndex = doctors.length - itemsPerView.desktop;
    setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
  };

  const prevSlide = () => {
    const maxIndex = doctors.length - itemsPerView.desktop;
    setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1);
  };

  const handleMoreClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const closeModal = () => {
    setSelectedDoctor(null);
  };

  const getVisibleDoctors = () => {
    const visible = [];
    for (let i = 0; i < itemsPerView.desktop; i++) {
      const index = (currentIndex + i) % doctors.length;
      visible.push(doctors[index]);
    }
    return visible;
  };

  return (
    <section className="doctors-carousel">
      <div className="container">
        {/* Section Title */}
        <div className="section-header">
          <div className="section-title">
            <FontAwesomeIcon icon={faPlus} className="title-icon" />
            <h2>Outstanding doctor</h2>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="carousel-container">
          {/* Previous Arrow */}
          <button 
            className="arrow-btn prev-btn"
            onClick={prevSlide}
            aria-label="Previous doctors"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          {/* Doctor Cards */}
          <div className="doctors-grid">
            {getVisibleDoctors().map((doctor, index) => (
              <div key={`${doctor.id}-${currentIndex}`} className="doctor-card">
                <div className="avatar-container">
                  <img 
                    src={doctor.avatar} 
                    alt={doctor.name}
                    className="doctor-avatar"
                    onError={(e) => {
                      // Fallback for demo - create a colored avatar
                      const target = e.target as HTMLImageElement;
                      target.style.background = `linear-gradient(135deg, ${
                        index % 3 === 0 ? '#C8F3E1, #A8E1EA' : 
                        index % 3 === 1 ? '#A8E1EA, #90B8F7' : 
                        '#90B8F7, #C8F3E1'
                      })`;
                      target.style.display = 'flex';
                      target.style.alignItems = 'center';
                      target.style.justifyContent = 'center';
                      target.style.color = '#113B57';
                      target.style.fontSize = '48px';
                      target.style.fontWeight = '600';
                      target.alt = '👨‍⚕️';
                    }}
                  />
                </div>
                
                <div className="doctor-info">
                  <h3 className="doctor-name">{doctor.name}</h3>
                  <p className="doctor-department">{doctor.department}</p>
                  
                  <button 
                    className="btn btn-secondary more-btn"
                    onClick={() => handleMoreClick(doctor)}
                  >
                    More
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Next Arrow */}
          <button 
            className="arrow-btn next-btn"
            onClick={nextSlide}
            aria-label="Next doctors"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>

      {/* Doctor Details Modal */}
      {selectedDoctor && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedDoctor.name}</h3>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="modal-avatar">
                <img 
                  src={selectedDoctor.avatar} 
                  alt={selectedDoctor.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.background = 'linear-gradient(135deg, #C8F3E1, #90B8F7)';
                    target.style.display = 'flex';
                    target.style.alignItems = 'center';
                    target.style.justifyContent = 'center';
                    target.style.color = '#113B57';
                    target.style.fontSize = '64px';
                    target.alt = '👨‍⚕️';
                  }}
                />
              </div>
              
              <div className="modal-info">
                <h4>Department</h4>
                <p>{selectedDoctor.department}</p>
                
                <h4>Specialties</h4>
                <ul>
                  <li>General consultation</li>
                  <li>Preventive care</li>
                  <li>Treatment planning</li>
                </ul>
                
                <h4>Available Hours</h4>
                <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                <p>Saturday: 9:00 AM - 4:00 PM</p>
                
                <h4>Experience</h4>
                <p>10+ years of medical practice with excellent patient care record.</p>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={closeModal}>
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DoctorsCarousel;