import React from "react";
import { motion } from "framer-motion";
import styled from "@emotion/styled";
import { Calendar, Star, Award, MapPin } from "lucide-react";
import { theme } from "../../styles/theme";

interface DoctorCardProps {
  doctor: {
    id?: string;
    name: string;
    specialty?: string;
    experience?: string;
    rating?: number;
    image?: string;
    location?: string;
    availability?: string;
  };
  onClick?: () => void;
}

const CardWrapper = styled(motion.div)`
  background: white;
  border-radius: ${theme.borderRadius["2xl"]};
  overflow: hidden;
  box-shadow: ${theme.colors.shadow.sm};
  cursor: pointer;
  transition: all ${theme.transitions.duration.normal}
    ${theme.transitions.easing.default};
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${theme.colors.shadow.xl};
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: ${theme.colors.background.gradient.primary};
  overflow: hidden;
`;

const DoctorImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${theme.transitions.duration.slow}
    ${theme.transitions.easing.default};

  ${CardWrapper}:hover & {
    transform: scale(1.1);
  }
`;

const BadgeContainer = styled.div`
  position: absolute;
  top: ${theme.spacing[4]};
  right: ${theme.spacing[4]};
  display: flex;
  gap: ${theme.spacing[2]};
`;

const Badge = styled.div<{ variant?: "rating" | "experience" }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  padding: ${theme.spacing[1]} ${theme.spacing[3]};
  background: ${({ variant }) =>
    variant === "rating"
      ? "rgba(255, 215, 0, 0.95)"
      : "rgba(255, 255, 255, 0.95)"};
  backdrop-filter: blur(10px);
  border-radius: ${theme.borderRadius.pill};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${({ variant }) =>
    variant === "rating" ? "#000" : theme.colors.text.primary};
  box-shadow: ${theme.colors.shadow.sm};
`;

const CardContent = styled.div`
  padding: ${theme.spacing[6]};
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const DoctorName = styled.h3`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.accent.navy};
  margin-bottom: ${theme.spacing[2]};
  line-height: ${theme.typography.lineHeight.tight};
`;

const Specialty = styled.p`
  font-size: ${theme.typography.fontSize.base};
  color: ${theme.colors.primary.teal};
  font-weight: ${theme.typography.fontWeight.medium};
  margin-bottom: ${theme.spacing[4]};
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[5]};
  flex: 1;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};

  svg {
    color: ${theme.colors.primary.teal};
    flex-shrink: 0;
  }
`;

const CardFooter = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  padding-top: ${theme.spacing[4]};
  border-top: 1px solid ${theme.colors.gray[200]};
`;

const ActionButton = styled(motion.button)<{
  variant?: "primary" | "secondary";
}>`
  flex: 1;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border: none;
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  ${({ variant = "primary" }) =>
    variant === "primary"
      ? `
        background: ${theme.colors.background.gradient.cta};
        color: white;
        box-shadow: ${theme.colors.shadow.sm};
        
        &:hover {
          box-shadow: ${theme.colors.shadow.md};
        }
      `
      : `
        background: transparent;
        color: ${theme.colors.primary.teal};
        border: 2px solid ${theme.colors.primary.teal};
        
        &:hover {
          background: ${theme.colors.primary.lightest};
        }
      `}
`;

const ModernDoctorCard: React.FC<DoctorCardProps> = ({ doctor, onClick }) => {
  const defaultImage =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23C8F3E1" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="120" text-anchor="middle" dy=".3em" fill="%23113B57"%3E👨‍⚕️%3C/text%3E%3C/svg%3E';

  return (
    <CardWrapper
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
    >
      <ImageContainer>
        <DoctorImage
          src={doctor.image || defaultImage}
          alt={doctor.name}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = defaultImage;
          }}
        />
        <BadgeContainer>
          {doctor.rating && (
            <Badge variant="rating">
              <Star size={12} fill="currentColor" />
              {doctor.rating.toFixed(1)}
            </Badge>
          )}
          {doctor.experience && (
            <Badge variant="experience">
              <Award size={12} />
              {doctor.experience}
            </Badge>
          )}
        </BadgeContainer>
      </ImageContainer>

      <CardContent>
        <DoctorName>{doctor.name}</DoctorName>
        {doctor.specialty && <Specialty>{doctor.specialty}</Specialty>}

        <InfoList>
          {doctor.location && (
            <InfoItem>
              <MapPin size={16} />
              <span>{doctor.location}</span>
            </InfoItem>
          )}
          {doctor.availability && (
            <InfoItem>
              <Calendar size={16} />
              <span>{doctor.availability}</span>
            </InfoItem>
          )}
        </InfoList>

        <CardFooter>
          <ActionButton
            variant="primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              // Handle book appointment
            }}
          >
            Book Now
          </ActionButton>
          <ActionButton
            variant="secondary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              // Handle view profile
            }}
          >
            Profile
          </ActionButton>
        </CardFooter>
      </CardContent>
    </CardWrapper>
  );
};

export default ModernDoctorCard;
