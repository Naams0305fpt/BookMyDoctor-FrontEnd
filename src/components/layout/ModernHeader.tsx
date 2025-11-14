import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styled from "@emotion/styled";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useLoginModal } from "../../contexts/LoginModalContext";
import UserMenu from "./UserMenu";
import { theme } from "../../styles/theme";

const HeaderWrapper = styled(motion.header)<{ $scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${theme.zIndex.sticky};
  transition: all ${theme.transitions.duration.normal}
    ${theme.transitions.easing.default};

  ${({ $scrolled }) =>
    $scrolled
      ? `
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: ${theme.colors.shadow.sm};
  `
      : `
    background: transparent;
  `}
`;

const HeaderContainer = styled.div`
  max-width: ${theme.layout.maxWidth};
  margin: 0 auto;
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing[6]};

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[3]} ${theme.spacing[4]};
  }
`;

const LogoSection = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  text-decoration: none;
  z-index: 10;

  img {
    height: 48px;
    width: auto;
    filter: drop-shadow(${theme.colors.shadow.sm});
    transition: transform ${theme.transitions.duration.fast}
      ${theme.transitions.easing.default};
  }

  &:hover img {
    transform: scale(1.05);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    img {
      height: 40px;
    }
  }
`;

const Nav = styled.nav<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};

  @media (max-width: ${theme.breakpoints.md}) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${theme.colors.background.gradient.primary};
    flex-direction: column;
    justify-content: center;
    padding: ${theme.spacing[8]};
    transform: ${({ $isOpen }) =>
      $isOpen ? "translateX(0)" : "translateX(-100%)"};
    transition: transform ${theme.transitions.duration.normal}
      ${theme.transitions.easing.default};
  }
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  position: relative;
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${({ $active }) =>
    $active ? theme.colors.primary.teal : theme.colors.text.primary};
  text-decoration: none;
  border-radius: ${theme.borderRadius.lg};
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover {
    color: ${theme.colors.primary.teal};
    background: ${theme.colors.primary.lightest};
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    width: ${({ $active }) => ($active ? "80%" : "0")};
    height: 2px;
    background: ${theme.colors.primary.teal};
    transform: translateX(-50%);
    transition: width ${theme.transitions.duration.fast}
      ${theme.transitions.easing.default};
  }

  &:hover::after {
    width: 80%;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize.xl};
    padding: ${theme.spacing[3]} ${theme.spacing[6]};
    width: 100%;
    text-align: center;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

const MobileMenuButton = styled(motion.button)`
  display: none;
  padding: ${theme.spacing[2]};
  background: ${theme.colors.primary.lightest};
  border: none;
  border-radius: ${theme.borderRadius.lg};
  cursor: pointer;
  color: ${theme.colors.primary.teal};
  z-index: 10;

  @media (max-width: ${theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const IconButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: ${theme.colors.background.gradient.cta};
  border: none;
  border-radius: ${theme.borderRadius.full};
  cursor: pointer;
  color: white;
  box-shadow: ${theme.colors.shadow.sm};
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.colors.shadow.md};
  }

  &:active {
    transform: translateY(0);
  }
`;

const ModernHeader: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { openLogin } = useLoginModal();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isActiveLink = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.includes(path)) return true;
    return false;
  };

  return (
    <HeaderWrapper
      $scrolled={scrolled}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <HeaderContainer>
        <LogoSection to="/">
          <img src="/images/logo.png" alt="BookMyDoctor" />
        </LogoSection>

        <Nav $isOpen={mobileMenuOpen}>
          <NavLink to="/" $active={isActiveLink("/")}>
            Home
          </NavLink>
          <NavLink to="/about" $active={isActiveLink("/about")}>
            About
          </NavLink>
          <NavLink to="/information" $active={isActiveLink("/information")}>
            Information
          </NavLink>
          <NavLink to="/demo" $active={isActiveLink("/demo")}>
            Demo
          </NavLink>
        </Nav>

        <RightSection>
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <IconButton
              onClick={openLogin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <User size={20} />
            </IconButton>
          )}

          <MobileMenuButton
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </MobileMenuButton>
        </RightSection>
      </HeaderContainer>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: theme.zIndex.sticky - 1,
            }}
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </HeaderWrapper>
  );
};

export default ModernHeader;
