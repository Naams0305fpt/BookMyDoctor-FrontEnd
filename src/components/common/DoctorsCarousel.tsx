import React, { useState, useEffect } from "react"; // <-- Import useEffect
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faChevronLeft,
  faChevronRight,
  faSpinner, // <-- Add spinner for loading
} from "@fortawesome/free-solid-svg-icons";
import "./DoctorsCarousel.css";
// --- THAY ĐỔI: Import API and Doctor type ---
import { api, Doctor } from "../../services/api"; // <-- Adjust path if needed

// --- BỎ interface Doctor cũ ---
// interface Doctor { ... }

const DoctorsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // --- THAY ĐỔI: State for fetched doctors and loading ---
  const [fetchedDoctors, setFetchedDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- BỎ doctors array cũ ---
  // const doctors: Doctor[] = [ ... ];

  // --- THAY ĐỔI: useEffect to fetch doctors ---
  useEffect(() => {
    const loadDoctors = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const doctorsData = await api.getDoctors();
        setFetchedDoctors(doctorsData);
      } catch (err) {
        console.error("Failed to load doctors:", err);
        setError("Could not load doctors. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDoctors();
  }, []); // Empty dependency array means run once on mount

  // --- itemsPerView and calculations (Keep as is for now, adjust if needed) ---
  const itemsPerView = {
    desktop: 3,
    tablet: 2, // You might need logic to adjust this based on screen size
    mobile: 1, // You might need logic to adjust this based on screen size
  };

  // --- THAY ĐỔI: Use fetchedDoctors.length ---
  const nextSlide = () => {
    // Prevent sliding if not enough doctors
    if (fetchedDoctors.length <= itemsPerView.desktop) return;
    const maxIndex = fetchedDoctors.length - itemsPerView.desktop;
    // Loop back to start smoothly
    setCurrentIndex((prev) => (prev + 1) % fetchedDoctors.length);
    // Simpler loop: setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // --- THAY ĐỔI: Use fetchedDoctors.length ---
  const prevSlide = () => {
    // Prevent sliding if not enough doctors
    if (fetchedDoctors.length <= itemsPerView.desktop) return;
    const maxIndex = fetchedDoctors.length - itemsPerView.desktop;
    // Loop back to end smoothly
    setCurrentIndex(
      (prev) => (prev - 1 + fetchedDoctors.length) % fetchedDoctors.length
    );
    // Simpler loop: setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleMoreClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const closeModal = () => {
    setSelectedDoctor(null);
  };

  // --- THAY ĐỔI: Use fetchedDoctors ---
  const getVisibleDoctors = () => {
    // Handle case where doctors haven't loaded or fewer than itemsPerView
    if (fetchedDoctors.length === 0) return [];
    if (fetchedDoctors.length <= itemsPerView.desktop) return fetchedDoctors;

    const visible: Doctor[] = [];
    for (let i = 0; i < itemsPerView.desktop; i++) {
      const index = (currentIndex + i) % fetchedDoctors.length;
      visible.push(fetchedDoctors[index]);
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
          {/* Previous Arrow - Hide if not enough doctors */}
          {fetchedDoctors.length > itemsPerView.desktop && (
            <button
              className="arrow-btn prev-btn"
              onClick={prevSlide}
              aria-label="Previous doctors"
              disabled={isLoading} // Disable while loading
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
          )}

          {/* Doctor Cards Area */}
          <div className="doctors-grid">
            {/* --- THAY ĐỔI: Loading and Error Handling --- */}
            {isLoading && (
              <div className="loading-state">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p>Loading doctors...</p>
              </div>
            )}
            {error && <div className="error-state">{error}</div>}
            {!isLoading &&
              !error &&
              getVisibleDoctors().map((doctor, index) => (
                // --- THAY ĐỔI: Use DoctorId for key ---
                <div
                  key={`${doctor.DoctorId}-${currentIndex}`}
                  className="doctor-card"
                >
                  <div className="avatar-container">
                    <img
                      src={doctor.Image || "/images/default-avatar.png"} // --- THAY ĐỔI: Use doctor.Image ---
                      alt={doctor.Name}
                      className="doctor-avatar"
                      onError={(e) => {
                        // Fallback for demo - create a colored avatar

                        const target = e.target as HTMLImageElement;

                        target.style.background = `linear-gradient(135deg, ${
                          index % 3 === 0
                            ? "#C8F3E1, #A8E1EA"
                            : index % 3 === 1
                            ? "#A8E1EA, #90B8F7"
                            : "#90B8F7, #C8F3E1"
                        })`;

                        target.style.display = "flex";

                        target.style.alignItems = "center";

                        target.style.justifyContent = "center";

                        target.style.color = "#113B57";

                        target.style.fontSize = "48px";

                        target.style.fontWeight = "600";

                        target.alt = "👨‍⚕️";
                      }}
                    />
                  </div>

                  <div className="doctor-info">
                    {/* --- THAY ĐỔI: Use doctor.Name and doctor.Department --- */}
                    <h3 className="doctor-name">{doctor.Name}</h3>
                    <p className="doctor-department">{doctor.Department}</p>

                    <button
                      className="btn btn-secondary more-btn"
                      onClick={() => handleMoreClick(doctor)}
                    >
                      More
                    </button>
                  </div>
                </div>
              ))}
            {/* Add message if no doctors are found */}
            {!isLoading && !error && fetchedDoctors.length === 0 && (
              <p className="no-doctors-message">
                No doctors available at the moment.
              </p>
            )}
          </div>

          {/* Next Arrow - Hide if not enough doctors */}
          {fetchedDoctors.length > itemsPerView.desktop && (
            <button
              className="arrow-btn next-btn"
              onClick={nextSlide}
              aria-label="Next doctors"
              disabled={isLoading} // Disable while loading
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          )}
        </div>
      </div>

      {/* Doctor Details Modal */}
      {selectedDoctor && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              {/* --- THAY ĐỔI: Use selectedDoctor.Name --- */}
              <h3>{selectedDoctor.Name}</h3>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-avatar">
                {/* --- THAY ĐỔI: Use selectedDoctor.Image --- */}
                <img
                  src={selectedDoctor.Image || "/images/default-avatar.png"}
                  alt={selectedDoctor.Name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;

                    target.style.background =
                      "linear-gradient(135deg, #C8F3E1, #90B8F7)";

                    target.style.display = "flex";

                    target.style.alignItems = "center";

                    target.style.justifyContent = "center";

                    target.style.color = "#113B57";

                    target.style.fontSize = "64px";

                    target.alt = "👨‍⚕️";
                  }}
                />
              </div>

              {/* --- THAY ĐỔI: Use actual doctor data --- */}
              <div className="modal-info">
                <h4>Department</h4>
                <p>{selectedDoctor.Department || "N/A"}</p>

                <h4>Experience</h4>
                <p>
                  {selectedDoctor.Experience_year !== undefined // Check if defined
                    ? `${selectedDoctor.Experience_year} year(s)`
                    : "N/A"}
                </p>

                {/* Optional: Add contact info if desired */}
                <h4>Contact</h4>
                <p>Email: {selectedDoctor.Email || "N/A"}</p>
                <p>Phone: {selectedDoctor.Phone || "N/A"}</p>

                {/* Optional: Add other details */}
                {/*
                 <h4>Address</h4>
                 <p>{selectedDoctor.Address || "N/A"}</p>
                 <h4>Gender</h4>
                 <p>{selectedDoctor.Gender || "N/A"}</p>
                 */}

                {/* Remove or replace hardcoded specialties/hours */}
                {/* <h4>Specialties</h4> ... */}
                {/* <h4>Available Hours</h4> ... */}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary" onClick={closeModal}>
                {/* Maybe link to the booking form later? */}
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DoctorsCarousel;
