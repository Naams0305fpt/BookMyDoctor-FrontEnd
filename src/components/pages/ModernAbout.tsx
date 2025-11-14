import React from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import {
  Users,
  Heart,
  Shield,
  Award,
  Stethoscope,
  Target,
} from "lucide-react";

const theme = {
  colors: {
    primary: {
      teal: "#13B6C6",
      tealLight: "#C8F3E1",
      tealDark: "#0E8A96",
    },
    gray: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827",
    },
  },
  spacing: {
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    6: "1.5rem",
    8: "2rem",
    12: "3rem",
    16: "4rem",
    20: "5rem",
  },
  borderRadius: {
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
  },
};

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  padding-top: calc(80px + ${theme.spacing[8]});
  padding-bottom: ${theme.spacing[16]};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing[6]};
`;

const PageHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: ${theme.spacing[12]};
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing[4]};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[3]};

  svg {
    color: ${theme.colors.primary.teal};
  }
`;

const PageSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${theme.colors.gray[600]};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const HeroSection = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[12]};
  align-items: center;
  margin-bottom: ${theme.spacing[16]};
  padding: ${theme.spacing[8]};
  background: linear-gradient(135deg, #c8f3e1 0%, #a8e1ea 100%);
  border-radius: ${theme.borderRadius.xl};
`;

const HeroContent = styled.div``;

const HeroTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: ${theme.spacing[4]};
  line-height: 1.2;
`;

const CareScript = styled.span`
  display: block;
  font-family: "Segoe Script", cursive;
  font-size: 2rem;
  color: ${theme.colors.primary.teal};
  font-weight: 400;
`;

const LikeMother = styled.span`
  display: block;
  font-weight: 800;
  color: ${theme.colors.gray[900]};
  letter-spacing: -0.02em;
`;

const HeroDescription = styled.p`
  font-size: 1.125rem;
  color: ${theme.colors.gray[700]};
  line-height: 1.8;
  margin-bottom: ${theme.spacing[6]};
`;

const HeroImage = styled.div`
  position: relative;
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: ${theme.shadows.xl};
  background: linear-gradient(135deg, #c8f3e1, #a8e1ea);
  aspect-ratio: 4/3;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const StatsSection = styled(motion.div)`
  margin-bottom: ${theme.spacing[16]};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing[6]};
`;

const StatCard = styled(motion.div)`
  text-align: center;
  padding: ${theme.spacing[8]} ${theme.spacing[4]};
  background: white;
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.md};
  border: 1px solid ${theme.colors.gray[200]};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.xl};
    border-color: ${theme.colors.primary.teal};
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${theme.colors.primary.teal};
  margin-bottom: ${theme.spacing[2]};
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: ${theme.colors.gray[600]};
  font-weight: 500;
`;

const FeaturesSection = styled(motion.div)`
  margin-bottom: ${theme.spacing[16]};
`;

const SectionTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.gray[900]};
  text-align: center;
  margin-bottom: ${theme.spacing[8]};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing[6]};
`;

const FeatureCard = styled(motion.div)`
  padding: ${theme.spacing[8]};
  background: white;
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.md};
  border: 1px solid ${theme.colors.gray[200]};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.xl};
    border-color: ${theme.colors.primary.teal};
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.primary.tealLight};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing[4]};

  svg {
    width: 28px;
    height: 28px;
    color: ${theme.colors.primary.teal};
  }
`;

const FeatureTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing[3]};
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: ${theme.colors.gray[600]};
  line-height: 1.6;
`;

const MissionSection = styled(motion.div)`
  padding: ${theme.spacing[12]};
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  border-radius: ${theme.borderRadius.xl};
  margin-bottom: ${theme.spacing[8]};
`;

const MissionTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing[6]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};

  svg {
    color: ${theme.colors.primary.teal};
  }
`;

const MissionText = styled.p`
  font-size: 1.125rem;
  color: ${theme.colors.gray[700]};
  line-height: 1.8;
  margin-bottom: ${theme.spacing[8]};
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing[6]};
`;

const ValueCard = styled.div`
  padding: ${theme.spacing[6]};
  background: white;
  border-radius: ${theme.borderRadius.lg};
  border-left: 4px solid ${theme.colors.primary.teal};
  box-shadow: ${theme.shadows.sm};
`;

const ValueTitle = styled.strong`
  font-size: 1.125rem;
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing[2]};
  display: block;
`;

const ValueText = styled.span`
  font-size: 1rem;
  color: ${theme.colors.gray[600]};
  line-height: 1.6;
`;

const ModernAbout: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: "Expert Doctors",
      description:
        "Our network includes highly qualified doctors across various specialties, ensuring you receive the best medical care.",
    },
    {
      icon: Heart,
      title: "Care Like Family",
      description:
        "We treat every patient with the love and attention of family members, providing compassionate healthcare services.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your medical information is protected with the highest security standards and complete privacy protocols.",
    },
    {
      icon: Award,
      title: "Quality Service",
      description:
        "We are committed to delivering exceptional healthcare services with a focus on patient satisfaction and outcomes.",
    },
  ];

  const stats = [
    { number: "500+", label: "Qualified Doctors" },
    { number: "10,000+", label: "Happy Patients" },
    { number: "15+", label: "Medical Specialties" },
    { number: "24/7", label: "Support Available" },
  ];

  const values = [
    {
      title: "Compassion",
      description: "We approach every interaction with empathy and understanding.",
    },
    {
      title: "Excellence",
      description:
        "We maintain the highest standards in medical care and service delivery.",
    },
    {
      title: "Accessibility",
      description: "We make healthcare available to everyone, everywhere.",
    },
    {
      title: "Trust",
      description:
        "We build lasting relationships based on reliability and transparency.",
    },
  ];

  return (
    <PageContainer>
      <Container>
        <PageHeader
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageTitle>
            <Stethoscope size={40} />
            About Book My Doctor
          </PageTitle>
          <PageSubtitle>
            Revolutionizing healthcare accessibility with compassionate care and
            expert medical professionals
          </PageSubtitle>
        </PageHeader>

        <HeroSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <HeroContent>
            <HeroTitle>
              <CareScript>Care</CareScript>
              <LikeMother>LIKE A MOTHER</LikeMother>
            </HeroTitle>
            <HeroDescription>
              At Book My Doctor, we believe healthcare should be accessible,
              comfortable, and delivered with the same care and attention you
              would receive from a loving mother. Our platform connects you with
              experienced medical professionals who share our commitment to
              compassionate care.
            </HeroDescription>
          </HeroContent>
          <HeroImage>
            <img
              src="/images/doctor-consultation-1.png"
              alt="Doctor consultation"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </HeroImage>
        </HeroSection>

        <StatsSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StatsGrid>
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <StatNumber>{stat.number}</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </StatsGrid>
        </StatsSection>

        <FeaturesSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <SectionTitle>Why Choose Book My Doctor?</SectionTitle>
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <FeatureIcon>
                  <feature.icon />
                </FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesSection>

        <MissionSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <MissionTitle>
            <Target size={32} />
            Our Mission
          </MissionTitle>
          <MissionText>
            To revolutionize healthcare accessibility by providing a seamless
            platform that connects patients with qualified medical professionals.
            We strive to make quality healthcare as accessible as a click,
            ensuring every individual receives the care they deserve with the
            warmth and attention of a mother's care.
          </MissionText>
          <ValuesGrid>
            {values.map((value, index) => (
              <ValueCard key={index}>
                <ValueTitle>{value.title}:</ValueTitle>
                <ValueText>{value.description}</ValueText>
              </ValueCard>
            ))}
          </ValuesGrid>
        </MissionSection>
      </Container>
    </PageContainer>
  );
};

export default ModernAbout;
