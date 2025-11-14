import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "@emotion/styled";
import { Phone, ChevronRight } from "lucide-react";
import { theme } from "../../styles/theme";

const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: ${theme.colors.background.gradient.hero};
  padding-top: ${theme.layout.headerHeight};
`;

const HeroContainer = styled.div`
  max-width: ${theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 ${theme.spacing[6]};
  width: 100%;
  position: relative;
  z-index: 2;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0 ${theme.spacing[4]};
  }
`;

const HeroContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[12]};
  align-items: center;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[8]};
    text-align: center;
  }
`;

const TextContent = styled.div`
  z-index: 2;
`;

const SubHeading = styled(motion.p)`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.primary.teal};
  margin-bottom: ${theme.spacing[4]};
  text-transform: uppercase;
  letter-spacing: ${theme.typography.letterSpacing.wider};
`;

const MainHeading = styled(motion.h1)`
  font-size: ${theme.typography.fontSize["6xl"]};
  font-weight: ${theme.typography.fontWeight.extrabold};
  color: ${theme.colors.accent.navy};
  line-height: ${theme.typography.lineHeight.tight};
  margin-bottom: ${theme.spacing[6]};

  @media (max-width: ${theme.breakpoints.lg}) {
    font-size: ${theme.typography.fontSize["5xl"]};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize["4xl"]};
  }
`;

const ScriptText = styled.span`
  display: block;
  font-family: ${theme.typography.fontFamily.script};
  font-size: ${theme.typography.fontSize["7xl"]};
  background: ${theme.colors.background.gradient.cta};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${theme.spacing[2]};

  @media (max-width: ${theme.breakpoints.lg}) {
    font-size: ${theme.typography.fontSize["6xl"]};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize["5xl"]};
  }
`;

const Description = styled(motion.p)`
  font-size: ${theme.typography.fontSize.xl};
  color: ${theme.colors.text.secondary};
  line-height: ${theme.typography.lineHeight.relaxed};
  margin-bottom: ${theme.spacing[8]};
  max-width: 600px;

  @media (max-width: ${theme.breakpoints.lg}) {
    margin-left: auto;
    margin-right: auto;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize.lg};
  }
`;

const CTAGroup = styled(motion.div)`
  display: flex;
  gap: ${theme.spacing[4]};
  align-items: center;

  @media (max-width: ${theme.breakpoints.lg}) {
    justify-content: center;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    width: 100%;
  }
`;

const PrimaryButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[4]} ${theme.spacing[8]};
  background: ${theme.colors.background.gradient.cta};
  color: white;
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  border: none;
  border-radius: ${theme.borderRadius.pill};
  cursor: pointer;
  box-shadow: ${theme.colors.shadow.md};
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transform: translateX(-100%);
    transition: transform 0.6s;
  }

  &:hover::before {
    transform: translateX(100%);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    width: 100%;
    justify-content: center;
  }
`;

const SecondaryButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  background: transparent;
  color: ${theme.colors.accent.navy};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  border: 2px solid ${theme.colors.accent.navy};
  border-radius: ${theme.borderRadius.pill};
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover {
    background: ${theme.colors.accent.navy};
    color: white;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    width: 100%;
    justify-content: center;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 600px;

  @media (max-width: ${theme.breakpoints.lg}) {
    height: 500px;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    height: 400px;
  }
`;

const FloatingImage = styled(motion.div)<{ position: "left" | "right" }>`
  position: absolute;
  ${({ position }) => (position === "left" ? "left: 0;" : "right: 0;")}
  top: 50%;
  transform: translateY(-50%);
  width: 48%;
  height: 80%;
  border-radius: ${theme.borderRadius["3xl"]};
  overflow: hidden;
  box-shadow: ${theme.colors.shadow.xl};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const HotlineBadge = styled(motion.div)`
  position: fixed;
  bottom: ${theme.spacing[8]};
  right: ${theme.spacing[8]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  background: white;
  border-radius: ${theme.borderRadius.pill};
  box-shadow: ${theme.colors.shadow.lg};
  z-index: ${theme.zIndex.sticky};
  cursor: pointer;

  @media (max-width: ${theme.breakpoints.md}) {
    bottom: ${theme.spacing[4]};
    right: ${theme.spacing[4]};
    padding: ${theme.spacing[3]} ${theme.spacing[4]};
  }
`;

const HotlineIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${theme.colors.background.gradient.cta};
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  @media (max-width: ${theme.breakpoints.md}) {
    width: 40px;
    height: 40px;
  }
`;

const HotlineText = styled.div`
  display: flex;
  flex-direction: column;

  span:first-of-type {
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.secondary};
  }

  span:last-of-type {
    font-size: ${theme.typography.fontSize.xl};
    font-weight: ${theme.typography.fontWeight.bold};
    color: ${theme.colors.primary.teal};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    span:last-of-type {
      font-size: ${theme.typography.fontSize.lg};
    }
  }
`;

const CarouselDots = styled.div`
  position: absolute;
  bottom: ${theme.spacing[8]};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: ${theme.spacing[2]};
  z-index: 3;
`;

const Dot = styled(motion.button)<{ active: boolean }>`
  width: ${({ active }) => (active ? "32px" : "12px")};
  height: 12px;
  background: ${({ active }) =>
    active ? theme.colors.primary.teal : theme.colors.gray[300]};
  border: none;
  border-radius: ${theme.borderRadius.full};
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover {
    background: ${theme.colors.primary.teal};
  }
`;

const BackgroundShapes = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
`;

const Shape = styled(motion.div)<{
  size: number;
  top: string;
  left: string;
  delay: number;
}>`
  position: absolute;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  top: ${({ top }) => top};
  left: ${({ left }) => left};
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.primary.lightest};
  opacity: 0.4;
  animation: float 6s ease-in-out infinite;
  animation-delay: ${({ delay }) => delay}s;
`;

const ModernHero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  const slides = [
    {
      leftImage: "/images/doctor-examining-child-1.png",
      rightImage: "/images/doctor-consultation-1.png",
    },
    {
      leftImage: "/images/doctor-examining-child-2.png",
      rightImage: "/images/doctor-consultation-2.png",
    },
    {
      leftImage: "/images/doctor-examining-child-3.png",
      rightImage: "/images/doctor-consultation-3.png",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 7500);

    return () => clearInterval(interval);
  }, []);

  const scrollToBooking = () => {
    const bookingSection = document.getElementById("booking-section");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <HeroSection>
      <BackgroundShapes>
        <Shape size={400} top="10%" left="5%" delay={0} />
        <Shape size={300} top="60%" left="80%" delay={1} />
        <Shape size={200} top="30%" left="70%" delay={2} />
      </BackgroundShapes>

      <HeroContainer>
        <HeroContent>
          <TextContent>
            <SubHeading
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Healthcare Excellence
            </SubHeading>

            <MainHeading
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <ScriptText>Care</ScriptText>
              LIKE A MOTHER
            </MainHeading>

            <Description
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Experience compassionate healthcare with our dedicated team of
              professionals. Book your appointment today and receive care that
              feels like home.
            </Description>

            <CTAGroup
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <PrimaryButton
                onClick={scrollToBooking}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Book Appointment
                <ChevronRight size={20} />
              </PrimaryButton>

              <SecondaryButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Learn More
              </SecondaryButton>
            </CTAGroup>
          </TextContent>

          <ImageContainer>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ position: "relative", height: "100%" }}
              >
                <FloatingImage
                  position="left"
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  whileHover={{ y: -10 }}
                >
                  <img
                    src={slides[currentSlide].leftImage}
                    alt="Medical care"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.background =
                        "linear-gradient(135deg, #C8F3E1, #A8E1EA)";
                    }}
                  />
                </FloatingImage>

                <FloatingImage
                  position="right"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  whileHover={{ y: -10 }}
                >
                  <img
                    src={slides[currentSlide].rightImage}
                    alt="Doctor consultation"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.background =
                        "linear-gradient(135deg, #90B8F7, #A8E1EA)";
                    }}
                  />
                </FloatingImage>
              </motion.div>
            </AnimatePresence>
          </ImageContainer>
        </HeroContent>

        <CarouselDots>
          {Array.from({ length: totalSlides }).map((_, index) => (
            <Dot
              key={index}
              active={index === currentSlide}
              onClick={() => setCurrentSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </CarouselDots>
      </HeroContainer>

      <HotlineBadge
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        whileHover={{ scale: 1.05, y: -5 }}
      >
        <HotlineIcon>
          <Phone size={24} />
        </HotlineIcon>
        <HotlineText>
          <span>24/7 Hotline</span>
          <span>1900 9000</span>
        </HotlineText>
      </HotlineBadge>
    </HeroSection>
  );
};

export default ModernHero;
