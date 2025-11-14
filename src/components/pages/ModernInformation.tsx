import React, { useState } from "react";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import {
  Info,
  Users,
  Calendar,
  Clock,
  Stethoscope,
  Heart,
  Brain,
  Eye,
  Baby,
  Bone,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
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
    success: {
      light: "#D1FAE5",
      main: "#10B981",
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

const QuickInfoSection = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[16]};
`;

const InfoCard = styled(motion.div)`
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

  svg {
    width: 40px;
    height: 40px;
    color: ${theme.colors.primary.teal};
    margin-bottom: ${theme.spacing[4]};
  }

  h3 {
    font-size: 2rem;
    font-weight: 800;
    color: ${theme.colors.primary.teal};
    margin-bottom: ${theme.spacing[2]};
  }

  p {
    font-size: 1rem;
    color: ${theme.colors.gray[600]};
    font-weight: 500;
  }
`;

const SectionTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.gray[900]};
  text-align: center;
  margin-bottom: ${theme.spacing[8]};
`;

const DepartmentsSection = styled(motion.div)`
  margin-bottom: ${theme.spacing[16]};
`;

const DepartmentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing[6]};
`;

const DepartmentCard = styled(motion.div)`
  padding: ${theme.spacing[6]};
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

const DepartmentIcon = styled.div`
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

const DepartmentName = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing[3]};
`;

const DepartmentDescription = styled.p`
  font-size: 0.9rem;
  color: ${theme.colors.gray[600]};
  line-height: 1.6;
`;

const HoursSection = styled(motion.div)`
  margin-bottom: ${theme.spacing[16]};
`;

const HoursContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[12]};
  align-items: center;
`;

const HoursInfo = styled.div``;

const HoursList = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${theme.shadows.md};
  margin-bottom: ${theme.spacing[6]};
`;

const HoursItem = styled.div`
  padding: ${theme.spacing[6]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${theme.spacing[3]};

  &:last-child {
    border-bottom: none;
  }
`;

const HoursDay = styled.div`
  font-weight: 600;
  color: ${theme.colors.gray[900]};
  font-size: 1rem;
  min-width: 140px;
`;

const HoursTime = styled.div`
  color: ${theme.colors.gray[600]};
  font-size: 0.95rem;
`;

const EmergencyBadge = styled.span`
  background: ${theme.colors.success.light};
  color: ${theme.colors.success.main};
  padding: ${theme.spacing[1]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  font-size: 0.75rem;
  font-weight: 600;
`;

const EmergencyInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[4]};
  background: ${theme.colors.gray[50]};
  border-radius: ${theme.borderRadius.lg};
  border-left: 4px solid ${theme.colors.primary.teal};

  svg {
    color: ${theme.colors.primary.teal};
    flex-shrink: 0;
    margin-top: 2px;
  }

  span {
    font-size: 0.95rem;
    color: ${theme.colors.gray[700]};
    line-height: 1.6;

    strong {
      color: ${theme.colors.gray[900]};
      font-weight: 600;
    }
  }
`;

const HoursImage = styled.div`
  position: relative;
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: ${theme.shadows.xl};
  background: linear-gradient(135deg, #a8e1ea, #90b8f7);
  aspect-ratio: 4/3;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FAQSection = styled(motion.div)`
  margin-bottom: ${theme.spacing[16]};
`;

const FAQContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const FAQItem = styled.div<{ $isActive: boolean }>`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing[4]};
  box-shadow: ${theme.shadows.md};
  border: 1px solid ${theme.colors.gray[200]};
  overflow: hidden;
  transition: all 0.3s ease;

  ${({ $isActive }) =>
    $isActive &&
    `
    border-color: ${theme.colors.primary.teal};
    box-shadow: ${theme.shadows.lg};
  `}
`;

const FAQQuestion = styled.button`
  width: 100%;
  padding: ${theme.spacing[6]};
  background: none;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${theme.spacing[4]};
  cursor: pointer;
  text-align: left;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${theme.colors.gray[900]};
  transition: color 0.3s ease;

  &:hover {
    color: ${theme.colors.primary.teal};
  }

  svg {
    flex-shrink: 0;
    color: ${theme.colors.primary.teal};
    transition: transform 0.3s ease;
  }
`;

const FAQAnswer = styled(motion.div)`
  padding: 0 ${theme.spacing[6]} ${theme.spacing[6]};
  color: ${theme.colors.gray[700]};
  line-height: 1.8;
  font-size: 1rem;
`;

const ContactSection = styled(motion.div)``;

const ContactCard = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: ${theme.spacing[12]};
  background: linear-gradient(135deg, #c8f3e1 0%, #a8e1ea 100%);
  border-radius: ${theme.borderRadius.xl};
  text-align: center;
  box-shadow: ${theme.shadows.xl};

  h3 {
    font-size: 2rem;
    font-weight: 700;
    color: ${theme.colors.gray[900]};
    margin-bottom: ${theme.spacing[4]};
  }

  > p {
    font-size: 1.125rem;
    color: ${theme.colors.gray[700]};
    line-height: 1.6;
    margin-bottom: ${theme.spacing[8]};
  }
`;

const ContactDetails = styled.div`
  display: grid;
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[8]};
  text-align: left;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[4]};
  background: white;
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};

  svg {
    color: ${theme.colors.primary.teal};
    flex-shrink: 0;
  }

  strong {
    color: ${theme.colors.gray[900]};
    font-weight: 600;
    min-width: 80px;
  }

  span {
    color: ${theme.colors.gray[700]};
  }
`;

const ContactButton = styled(motion.button)`
  padding: ${theme.spacing[4]} ${theme.spacing[8]};
  background: ${theme.colors.primary.teal};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.lg};
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${theme.shadows.md};
  transition: all 0.3s ease;

  &:hover {
    background: ${theme.colors.primary.tealDark};
    box-shadow: ${theme.shadows.lg};
  }
`;

const ModernInformation: React.FC = () => {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  const departments = [
    {
      icon: Stethoscope,
      name: "General Medicine",
      description:
        "Comprehensive healthcare for adults, including preventive care, diagnosis, and treatment of common medical conditions.",
    },
    {
      icon: Heart,
      name: "Cardiology",
      description:
        "Specialized care for heart and cardiovascular diseases, including diagnosis, treatment, and prevention.",
    },
    {
      icon: Brain,
      name: "Neurology",
      description:
        "Expert care for nervous system disorders, brain health, and neurological conditions.",
    },
    {
      icon: Eye,
      name: "Ophthalmology",
      description:
        "Complete eye care services, from routine check-ups to complex eye surgeries.",
    },
    {
      icon: Baby,
      name: "Pediatrics",
      description:
        "Specialized medical care for infants, children, and adolescents up to 18 years.",
    },
    {
      icon: Bone,
      name: "Orthopedics",
      description:
        "Treatment of musculoskeletal system disorders, including bones, joints, and muscles.",
    },
  ];

  const operatingHours = [
    {
      day: "Monday - Friday",
      hours: "8:00 AM - 8:00 PM",
      emergency: true,
    },
    { day: "Saturday", hours: "9:00 AM - 6:00 PM", emergency: true },
    { day: "Sunday", hours: "10:00 AM - 4:00 PM", emergency: false },
    { day: "Public Holidays", hours: "10:00 AM - 2:00 PM", emergency: false },
  ];

  const faqData = [
    {
      question: "How do I book an appointment?",
      answer:
        "You can easily book an appointment through our online booking form on the homepage. Simply fill in your details, select your preferred doctor and time slot, and submit the form. You will receive a confirmation within 24 hours.",
    },
    {
      question: "Can I cancel or reschedule my appointment?",
      answer:
        "Yes, you can cancel or reschedule your appointment up to 2 hours before the scheduled time. Please call our hotline at 1900 9000 or use our online portal to make changes.",
    },
    {
      question: "What should I bring to my appointment?",
      answer:
        "Please bring a valid ID, your insurance card (if applicable), a list of current medications, and any relevant medical records or test results from previous visits.",
    },
    {
      question: "Do you accept insurance?",
      answer:
        "We accept most major insurance plans. Please contact our office or check with your insurance provider to verify coverage before your appointment.",
    },
    {
      question: "What if I need emergency care?",
      answer:
        "For medical emergencies, please call emergency services immediately. Our clinic provides urgent care during operating hours. For after-hours emergencies, we have partnerships with local emergency facilities.",
    },
    {
      question: "How long will my appointment take?",
      answer:
        "Initial consultations typically take 30-45 minutes, while follow-up appointments usually last 15-30 minutes. Complex cases may require longer consultation times.",
    },
  ];

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <PageContainer>
      <Container>
        <PageHeader
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageTitle>
            <Info size={40} />
            Information & Services
          </PageTitle>
          <PageSubtitle>
            Everything you need to know about our medical services and facilities
          </PageSubtitle>
        </PageHeader>

        <QuickInfoSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <InfoCard
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Users />
            <h3>500+</h3>
            <p>Qualified Doctors</p>
          </InfoCard>
          <InfoCard
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Calendar />
            <h3>15+</h3>
            <p>Medical Specialties</p>
          </InfoCard>
          <InfoCard
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Clock />
            <h3>24/7</h3>
            <p>Emergency Support</p>
          </InfoCard>
        </QuickInfoSection>

        <DepartmentsSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <SectionTitle>Our Medical Departments</SectionTitle>
          <DepartmentsGrid>
            {departments.map((dept, index) => (
              <DepartmentCard
                key={index}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              >
                <DepartmentIcon>
                  <dept.icon />
                </DepartmentIcon>
                <DepartmentName>{dept.name}</DepartmentName>
                <DepartmentDescription>{dept.description}</DepartmentDescription>
              </DepartmentCard>
            ))}
          </DepartmentsGrid>
        </DepartmentsSection>

        <HoursSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <SectionTitle>Operating Hours</SectionTitle>
          <HoursContent>
            <HoursInfo>
              <HoursList>
                {operatingHours.map((schedule, index) => (
                  <HoursItem key={index}>
                    <HoursDay>{schedule.day}</HoursDay>
                    <HoursTime>{schedule.hours}</HoursTime>
                    {schedule.emergency && (
                      <EmergencyBadge>Emergency Available</EmergencyBadge>
                    )}
                  </HoursItem>
                ))}
              </HoursList>
              <EmergencyInfo>
                <AlertCircle size={20} />
                <span>
                  For urgent matters outside operating hours, please call our
                  emergency hotline: <strong>1900 9000</strong>
                </span>
              </EmergencyInfo>
            </HoursInfo>
            <HoursImage>
              <img
                src="/images/doctor-consultation-2.png"
                alt="Doctor consultation schedule"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </HoursImage>
          </HoursContent>
        </HoursSection>

        <FAQSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <SectionTitle>Frequently Asked Questions</SectionTitle>
          <FAQContainer>
            {faqData.map((faq, index) => (
              <FAQItem key={index} $isActive={activeAccordion === index}>
                <FAQQuestion onClick={() => toggleAccordion(index)}>
                  <span>{faq.question}</span>
                  <motion.div
                    animate={{ rotate: activeAccordion === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={24} />
                  </motion.div>
                </FAQQuestion>
                <AnimatePresence>
                  {activeAccordion === index && (
                    <FAQAnswer
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {faq.answer}
                    </FAQAnswer>
                  )}
                </AnimatePresence>
              </FAQItem>
            ))}
          </FAQContainer>
        </FAQSection>

        <ContactSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <ContactCard>
            <h3>Need More Information?</h3>
            <p>
              Our friendly staff is here to help you with any questions or
              concerns you may have.
            </p>
            <ContactDetails>
              <ContactItem>
                <Phone size={20} />
                <strong>Phone:</strong>
                <span>1900 9000</span>
              </ContactItem>
              <ContactItem>
                <Mail size={20} />
                <strong>Email:</strong>
                <span>info@bookmydoctor.com</span>
              </ContactItem>
              <ContactItem>
                <MapPin size={20} />
                <strong>Address:</strong>
                <span>FPT University Quy Nhon AI Campus</span>
              </ContactItem>
            </ContactDetails>
            <ContactButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us
            </ContactButton>
          </ContactCard>
        </ContactSection>
      </Container>
    </PageContainer>
  );
};

export default ModernInformation;
