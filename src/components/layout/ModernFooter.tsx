import React from "react";
import { motion } from "framer-motion";
import styled from "@emotion/styled";
import { MapPin, Phone, Mail, Facebook, Youtube, Music } from "lucide-react";
import { theme } from "../../styles/theme";

const FooterWrapper = styled.footer`
  position: relative;
  background: ${theme.colors.accent.navy};
  color: white;
  padding-top: ${theme.spacing[16]};
  // margin-top: ${theme.spacing[12]};
  overflow: hidden;
`;

const WaveTop = styled.div`
  position: absolute;
  top: -1px;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;

  svg {
    position: relative;
    display: block;
    width: calc(100% + 1.3px);
    height: 80px;
  }

  path {
    fill: white;
  }
`;

const FooterContainer = styled.div`
  max-width: ${theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 ${theme.spacing[6]};
  padding-top: ${theme.spacing[12]};

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0 ${theme.spacing[4]};
  }
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: ${theme.spacing[12]};
  margin-bottom: ${theme.spacing[12]};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: ${theme.spacing[8]};
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[6]};

  &:last-of-type {
    align-items: flex-end;

    & > div > div:first-of-type {
      justify-content: flex-end;
    }

    @media (max-width: ${theme.breakpoints.lg}) {
      align-items: center;

      & > div > div:first-of-type {
        justify-content: center;
      }
    }
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  color: ${theme.colors.primary.teal};
  margin-bottom: ${theme.spacing[2]};

  @media (max-width: ${theme.breakpoints.lg}) {
    justify-content: center;
  }

  svg {
    width: 20px;
    height: 20px;
  }

  h4 {
    font-size: ${theme.typography.fontSize.lg};
    font-weight: ${theme.typography.fontWeight.semibold};
    margin: 0;
    color: ${theme.colors.primary.teal};
  }
`;

const ContactItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  color: rgba(255, 255, 255, 0.8);
  font-size: ${theme.typography.fontSize.base};
  transition: color ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  @media (max-width: ${theme.breakpoints.lg}) {
    justify-content: center;
  }

  svg {
    width: 16px;
    height: 16px;
    color: ${theme.colors.primary.light};
    flex-shrink: 0;
  }

  &:hover {
    color: ${theme.colors.primary.teal};
  }
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing[4]};
`;

const Logo = styled.img`
  height: 120px;
  width: auto;
  filter: brightness(0) invert(1);

  @media (max-width: ${theme.breakpoints.md}) {
    height: 100px;
  }
`;

const Tagline = styled.p`
  font-family: ${theme.typography.fontFamily.script};
  font-size: ${theme.typography.fontSize["2xl"]};
  color: ${theme.colors.primary.lighter};
  margin: 0;
  text-align: center;
`;

const FooterLinks = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
  align-items: flex-end;

  @media (max-width: ${theme.breakpoints.lg}) {
    align-items: center;
  }
`;

const FooterLink = styled(motion.a)`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: ${theme.typography.fontSize.base};
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};
  position: relative;
  display: inline-block;

  &:hover {
    color: ${theme.colors.primary.teal};
    padding-left: ${theme.spacing[2]};
  }

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 2px;
    background: ${theme.colors.primary.teal};
    transition: width ${theme.transitions.duration.fast}
      ${theme.transitions.easing.default};
  }

  &:hover::before {
    width: 12px;
  }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing[6]} 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${theme.spacing[4]};
    text-align: center;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
`;

const SocialLink = styled(motion.a)`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.full};
  color: white;
  text-decoration: none;
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover {
    background: ${theme.colors.primary.teal};
    transform: translateY(-4px);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Copyright = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: ${theme.typography.fontSize.sm};
`;

const DecorativeShapes = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  opacity: 0.05;
`;

const Shape = styled(motion.div)<{ size: number; top: string; left: string }>`
  position: absolute;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  top: ${({ top }) => top};
  left: ${({ left }) => left};
  border-radius: ${theme.borderRadius.full};
  background: white;
`;

const ModernFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: "Privacy Policy", href: "#privacy-policy" },
    { name: "Terms of Service", href: "#terms" },
    { name: "FAQ", href: "#faq" },
    { name: "Help Center", href: "#help" },
    { name: "Free Consultation", href: "#consultation" },
  ];

  return (
    <FooterWrapper>
      <WaveTop>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </WaveTop>

      <DecorativeShapes>
        <Shape size={300} top="10%" left="5%" />
        <Shape size={200} top="50%" left="80%" />
        <Shape size={150} top="70%" left="10%" />
      </DecorativeShapes>

      <FooterContainer>
        <FooterGrid>
          {/* Left Column - Contact Info */}
          <FooterColumn>
            <FooterSection>
              <SectionHeader>
                <MapPin />
                <h4>Our Location</h4>
              </SectionHeader>
              <ContactItem whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <span>FPT University Quy Nhon AI Campus</span>
              </ContactItem>
            </FooterSection>

            <FooterSection>
              <SectionHeader>
                <Phone />
                <h4>Contact Us</h4>
              </SectionHeader>
              <ContactItem whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Phone size={16} />
                <span>Hotline: 1900 9000</span>
              </ContactItem>
              <ContactItem whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Mail size={16} />
                <span>info@bookmydoctor.com</span>
              </ContactItem>
            </FooterSection>
          </FooterColumn>

          {/* Center Column - Logo */}
          <LogoSection>
            <Logo src="/images/logo-non.png" alt="BookMyDoctor" />
            <Tagline>Care Like a Mother</Tagline>
          </LogoSection>

          {/* Right Column - Links */}
          <FooterColumn>
            <FooterSection>
              <SectionHeader>
                <h4>Quick Links</h4>
              </SectionHeader>
              <FooterLinks>
                {footerLinks.map((link, index) => (
                  <FooterLink
                    key={index}
                    href={link.href}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.name}
                  </FooterLink>
                ))}
              </FooterLinks>
            </FooterSection>
          </FooterColumn>
        </FooterGrid>

        {/* Bottom Section */}
        <FooterBottom>
          <SocialIcons>
            <SocialLink
              href="#"
              whileHover={{ scale: 1.1, y: -4 }}
              whileTap={{ scale: 0.95 }}
              aria-label="TikTok"
            >
              <Music />
            </SocialLink>
            <SocialLink
              href="#"
              whileHover={{ scale: 1.1, y: -4 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Facebook"
            >
              <Facebook />
            </SocialLink>
            <SocialLink
              href="#"
              whileHover={{ scale: 1.1, y: -4 }}
              whileTap={{ scale: 0.95 }}
              aria-label="YouTube"
            >
              <Youtube />
            </SocialLink>
          </SocialIcons>

          <Copyright>
            © {currentYear} BookMyDoctor. All rights reserved.
          </Copyright>
        </FooterBottom>
      </FooterContainer>
    </FooterWrapper>
  );
};

export default ModernFooter;
