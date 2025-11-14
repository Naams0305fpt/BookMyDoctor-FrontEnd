import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "@emotion/styled";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Award,
  MapPin,
  X,
  Loader,
  Mail,
  Phone,
} from "lucide-react";
import doctorApi from "../../services/api/doctor.api";
import type { Doctor } from "../../types";
import { theme } from "../../styles/theme";
import ModernDoctorCard from "./ModernDoctorCard";

interface DoctorCardData {
  id?: string;
  name: string;
  specialty?: string;
  experience?: string;
  rating?: number;
  image?: string;
  location?: string;
  availability?: string;
}

const CarouselSection = styled.section`
  padding: ${theme.spacing[16]} 0;
  background: white;
  position: relative;
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[12]} 0;
  }
`;

const Container = styled.div`
  max-width: ${theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 ${theme.spacing[6]};

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0 ${theme.spacing[4]};
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing[8]};

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.spacing[4]};
  }
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

const TitleIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${theme.colors.background.gradient.cta};
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const SectionTitle = styled(motion.h2)`
  font-size: ${theme.typography.fontSize["3xl"]};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.accent.navy};
  margin: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize["2xl"]};
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};

  @media (max-width: ${theme.breakpoints.md}) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const NavButton = styled(motion.button)`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.full};
  border: 2px solid ${theme.colors.primary.teal};
  background: white;
  color: ${theme.colors.primary.teal};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover:not(:disabled) {
    background: ${theme.colors.primary.teal};
    color: white;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const CarouselContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

const CarouselTrack = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing[6]};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[16]} 0;
  gap: ${theme.spacing[4]};
  color: ${theme.colors.text.secondary};
`;

const ErrorContainer = styled.div`
  padding: ${theme.spacing[8]};
  text-align: center;
  background: ${theme.colors.error}15;
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.error};
  color: ${theme.colors.error};
`;

const EmptyState = styled.div`
  padding: ${theme.spacing[16]};
  text-align: center;
  color: ${theme.colors.text.secondary};
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: ${theme.zIndex.modalBackdrop};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[4]};
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: ${theme.borderRadius["2xl"]};
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  padding: ${theme.spacing[6]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.full};
  border: none;
  background: ${theme.colors.gray[100]};
  color: ${theme.colors.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover {
    background: ${theme.colors.gray[200]};
    transform: rotate(90deg);
  }
`;

const ModalBody = styled.div`
  padding: ${theme.spacing[6]};
`;

const DoctorAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  margin: 0 auto ${theme.spacing[4]};
  border: 4px solid ${theme.colors.primary.teal};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DoctorName = styled.h3`
  text-align: center;
  font-size: ${theme.typography.fontSize["2xl"]};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.accent.navy};
  margin-bottom: ${theme.spacing[2]};
`;

const DoctorDepartment = styled.p`
  text-align: center;
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.primary.teal};
  margin-bottom: ${theme.spacing[6]};
`;

const InfoGrid = styled.div`
  display: grid;
  gap: ${theme.spacing[4]};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: start;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[3]};
  background: ${theme.colors.gray[50]};
  border-radius: ${theme.borderRadius.lg};

  svg {
    color: ${theme.colors.primary.teal};
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const InfoLabel = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[1]};
`;

const InfoValue = styled.div`
  color: ${theme.colors.text.secondary};
`;

const ModalFooter = styled.div`
  padding: ${theme.spacing[6]};
  border-top: 1px solid ${theme.colors.gray[200]};
  display: flex;
  gap: ${theme.spacing[3]};
  position: sticky;
  bottom: 0;
  background: white;
`;

const BookButton = styled(motion.button)`
  flex: 1;
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  background: ${theme.colors.background.gradient.cta};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  box-shadow: ${theme.colors.shadow.md};
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover {
    box-shadow: ${theme.colors.shadow.lg};
  }
`;

const CancelButton = styled(motion.button)`
  flex: 1;
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  background: white;
  color: ${theme.colors.text.primary};
  border: 2px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover {
    background: ${theme.colors.gray[50]};
    border-color: ${theme.colors.gray[400]};
  }
`;

const ModernDoctorsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [fetchedDoctors, setFetchedDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerView = 3;

  useEffect(() => {
    const loadDoctors = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const doctorsData = await doctorApi.getAllDoctors();
        setFetchedDoctors(doctorsData || []);
      } catch (err) {
        setError("Could not load doctors. Please try again later.");
        setFetchedDoctors([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDoctors();
  }, []);

  const nextSlide = () => {
    if (fetchedDoctors.length <= itemsPerView) return;
    setCurrentIndex((prev) => (prev + 1) % fetchedDoctors.length);
  };

  const prevSlide = () => {
    if (fetchedDoctors.length <= itemsPerView) return;
    setCurrentIndex(
      (prev) => (prev - 1 + fetchedDoctors.length) % fetchedDoctors.length
    );
  };

  const handleMoreClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const closeModal = () => {
    setSelectedDoctor(null);
  };

  const handleBookAppointment = (doctorId: number) => {
    // Close modal
    closeModal();

    // Scroll to booking form
    setTimeout(() => {
      const bookingForm = document.querySelector("[data-booking-form]");
      if (bookingForm) {
        bookingForm.scrollIntoView({ behavior: "smooth", block: "start" });

        // Trigger custom event to select doctor in booking form
        const selectDoctorEvent = new CustomEvent("selectDoctor", {
          detail: { doctorId },
        });
        window.dispatchEvent(selectDoctorEvent);
      }
    }, 100);
  };

  const getVisibleDoctors = (): Doctor[] => {
    if (fetchedDoctors.length === 0) return [];
    if (fetchedDoctors.length <= itemsPerView) return fetchedDoctors;

    const visible: Doctor[] = [];
    for (let i = 0; i < itemsPerView; i++) {
      const index = (currentIndex + i) % fetchedDoctors.length;
      visible.push(fetchedDoctors[index]);
    }
    return visible;
  };

  const mapDoctorToCardData = (doctor: Doctor): DoctorCardData => {
    return {
      id: doctor.DoctorId?.toString(),
      name: doctor.Name,
      specialty: doctor.Department,
      experience: `${doctor.Experience_year} years`,
      rating: 4.5,
      image: doctor.Image || undefined,
      location: doctor.Address,
      availability: "Available",
    };
  };

  return (
    <CarouselSection>
      <Container>
        <SectionHeader>
          <TitleGroup>
            <TitleIcon>
              <Star />
            </TitleIcon>
            <SectionTitle
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Outstanding Doctors
            </SectionTitle>
          </TitleGroup>

          {!isLoading && fetchedDoctors.length > itemsPerView && (
            <NavigationButtons>
              <NavButton
                onClick={prevSlide}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
                aria-label="Previous doctors"
              >
                <ChevronLeft />
              </NavButton>
              <NavButton
                onClick={nextSlide}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
                aria-label="Next doctors"
              >
                <ChevronRight />
              </NavButton>
            </NavigationButtons>
          )}
        </SectionHeader>

        <CarouselContainer>
          {isLoading && (
            <LoadingContainer>
              <Loader
                className="animate-spin"
                size={48}
                color={theme.colors.primary.teal}
              />
              <p>Loading doctors...</p>
            </LoadingContainer>
          )}

          {error && <ErrorContainer>{error}</ErrorContainer>}

          {!isLoading && !error && fetchedDoctors.length === 0 && (
            <EmptyState>
              <p>No doctors available at the moment.</p>
            </EmptyState>
          )}

          {!isLoading && !error && fetchedDoctors.length > 0 && (
            <CarouselTrack>
              {getVisibleDoctors().map((doctor, index) => (
                <ModernDoctorCard
                  key={`${doctor.DoctorId}-${currentIndex}-${index}`}
                  doctor={mapDoctorToCardData(doctor)}
                  onClick={() => handleMoreClick(doctor)}
                />
              ))}
            </CarouselTrack>
          )}
        </CarouselContainer>
      </Container>

      {/* Doctor Detail Modal */}
      <AnimatePresence>
        {selectedDoctor && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <h3 style={{ margin: 0 }}>Doctor Details</h3>
                <CloseButton onClick={closeModal}>
                  <X size={20} />
                </CloseButton>
              </ModalHeader>

              <ModalBody>
                <DoctorAvatar>
                  <img
                    src={selectedDoctor.Image || "/images/default-avatar.png"}
                    alt={selectedDoctor.Name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120"%3E%3Crect fill="%23C8F3E1" width="120" height="120"/%3E%3Ctext x="50%25" y="50%25" font-size="40" text-anchor="middle" dy=".3em" fill="%23113B57"%3E👨‍⚕️%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </DoctorAvatar>

                <DoctorName>Dr. {selectedDoctor.Name}</DoctorName>
                <DoctorDepartment>{selectedDoctor.Department}</DoctorDepartment>

                <InfoGrid>
                  {selectedDoctor.Experience_year > 0 && (
                    <InfoItem>
                      <Award size={20} />
                      <div>
                        <InfoLabel>Experience</InfoLabel>
                        <InfoValue>
                          {selectedDoctor.Experience_year} years of practice
                        </InfoValue>
                      </div>
                    </InfoItem>
                  )}

                  <InfoItem>
                    <Star size={20} />
                    <div>
                      <InfoLabel>Rating</InfoLabel>
                      <InfoValue>4.5 / 5.0</InfoValue>
                    </div>
                  </InfoItem>

                  {selectedDoctor.Address && (
                    <InfoItem>
                      <MapPin size={20} />
                      <div>
                        <InfoLabel>Address</InfoLabel>
                        <InfoValue>{selectedDoctor.Address}</InfoValue>
                      </div>
                    </InfoItem>
                  )}

                  {selectedDoctor.Email && (
                    <InfoItem>
                      <Mail size={20} />
                      <div>
                        <InfoLabel>Email</InfoLabel>
                        <InfoValue>{selectedDoctor.Email}</InfoValue>
                      </div>
                    </InfoItem>
                  )}

                  {selectedDoctor.Phone && (
                    <InfoItem>
                      <Phone size={20} />
                      <div>
                        <InfoLabel>Phone</InfoLabel>
                        <InfoValue>{selectedDoctor.Phone}</InfoValue>
                      </div>
                    </InfoItem>
                  )}
                </InfoGrid>
              </ModalBody>

              <ModalFooter>
                <CancelButton
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={closeModal}
                >
                  Close
                </CancelButton>
                <BookButton
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBookAppointment(selectedDoctor.DoctorId)}
                >
                  Book Appointment
                </BookButton>
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </CarouselSection>
  );
};

export default ModernDoctorsCarousel;
