import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { theme } from './theme';

// Button Components
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = styled(motion.button)<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[2]};
  font-family: ${theme.typography.fontFamily.sans};
  font-weight: ${theme.typography.fontWeight.semibold};
  border-radius: ${theme.borderRadius.pill};
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast} ${theme.transitions.easing.default};
  border: none;
  position: relative;
  overflow: hidden;
  white-space: nowrap;

  /* Size variants */
  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return `
          padding: ${theme.spacing[2]} ${theme.spacing[4]};
          font-size: ${theme.typography.fontSize.sm};
          min-height: 36px;
        `;
      case 'lg':
        return `
          padding: ${theme.spacing[4]} ${theme.spacing[8]};
          font-size: ${theme.typography.fontSize.lg};
          min-height: 56px;
        `;
      default:
        return `
          padding: ${theme.spacing[3]} ${theme.spacing[6]};
          font-size: ${theme.typography.fontSize.base};
          min-height: 44px;
        `;
    }
  }}

  /* Style variants */
  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary.teal};
          color: white;
          box-shadow: ${theme.colors.shadow.sm};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary.dark};
            box-shadow: ${theme.colors.shadow.colored.teal};
            transform: translateY(-2px);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      case 'secondary':
        return `
          background: ${theme.colors.secondary.blue};
          color: white;
          box-shadow: ${theme.colors.shadow.sm};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.secondary.dark};
            box-shadow: ${theme.colors.shadow.colored.blue};
            transform: translateY(-2px);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${theme.colors.primary.teal};
          border: 2px solid ${theme.colors.primary.teal};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary.teal};
            color: white;
            transform: translateY(-2px);
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${theme.colors.primary.teal};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary.lightest};
          }
        `;
      case 'gradient':
        return `
          background: ${theme.colors.background.gradient.cta};
          color: white;
          box-shadow: ${theme.colors.shadow.md};
          
          &:hover:not(:disabled) {
            box-shadow: ${theme.colors.shadow.lg};
            transform: translateY(-2px);
          }
        `;
      default:
        return '';
    }
  }}

  ${({ fullWidth }) => fullWidth && 'width: 100%;'}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Ripple effect */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
    opacity: 0;
    transform: scale(0);
    transition: all ${theme.transitions.duration.normal} ${theme.transitions.easing.out};
  }

  &:active:not(:disabled)::after {
    opacity: 1;
    transform: scale(2);
    transition: 0s;
  }
`;

// Card Components
interface CardProps {
  hoverable?: boolean;
  glass?: boolean;
}

export const Card = styled(motion.div)<CardProps>`
  background: ${({ glass }) => 
    glass ? 'rgba(255, 255, 255, 0.8)' : theme.colors.background.primary};
  border-radius: ${theme.borderRadius.card};
  padding: ${theme.spacing[6]};
  box-shadow: ${theme.colors.shadow.sm};
  
  ${({ glass }) => glass && `
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  `}
  
  ${({ hoverable }) => hoverable && `
    cursor: pointer;
    transition: all ${theme.transitions.duration.normal} ${theme.transitions.easing.default};
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${theme.colors.shadow.lg};
    }
  `}
`;

export const CardHeader = styled.div`
  margin-bottom: ${theme.spacing[4]};
`;

export const CardTitle = styled.h3`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.accent.navy};
  margin-bottom: ${theme.spacing[2]};
`;

export const CardDescription = styled.p`
  font-size: ${theme.typography.fontSize.base};
  color: ${theme.colors.text.secondary};
  line-height: ${theme.typography.lineHeight.relaxed};
`;

export const CardBody = styled.div`
  margin-bottom: ${theme.spacing[4]};
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing[4]};
  padding-top: ${theme.spacing[4]};
  border-top: 1px solid ${theme.colors.gray[200]};
`;

// Input Components
interface InputProps {
  error?: boolean;
  success?: boolean;
}

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
  width: 100%;
`;

export const InputLabel = styled.label`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.primary};
`;

export const Input = styled.input<InputProps>`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border: 2px solid ${({ error, success }) => 
    error ? theme.colors.error : 
    success ? theme.colors.success : 
    theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.lg};
  font-family: ${theme.typography.fontFamily.sans};
  font-size: ${theme.typography.fontSize.base};
  background: ${theme.colors.background.primary};
  color: ${theme.colors.text.primary};
  transition: all ${theme.transitions.duration.fast} ${theme.transitions.easing.default};

  &:focus {
    outline: none;
    border-color: ${({ error }) => error ? theme.colors.error : theme.colors.primary.teal};
    box-shadow: 0 0 0 3px ${({ error }) => 
      error ? `${theme.colors.error}20` : `${theme.colors.primary.teal}20`};
  }

  &::placeholder {
    color: ${theme.colors.text.tertiary};
  }

  &:disabled {
    background: ${theme.colors.gray[100]};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const TextArea = styled.textarea<InputProps>`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border: 2px solid ${({ error, success }) => 
    error ? theme.colors.error : 
    success ? theme.colors.success : 
    theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.lg};
  font-family: ${theme.typography.fontFamily.sans};
  font-size: ${theme.typography.fontSize.base};
  background: ${theme.colors.background.primary};
  color: ${theme.colors.text.primary};
  transition: all ${theme.transitions.duration.fast} ${theme.transitions.easing.default};
  resize: vertical;
  min-height: 120px;

  &:focus {
    outline: none;
    border-color: ${({ error }) => error ? theme.colors.error : theme.colors.primary.teal};
    box-shadow: 0 0 0 3px ${({ error }) => 
      error ? `${theme.colors.error}20` : `${theme.colors.primary.teal}20`};
  }

  &::placeholder {
    color: ${theme.colors.text.tertiary};
  }

  &:disabled {
    background: ${theme.colors.gray[100]};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const InputError = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.error};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
`;

export const InputHelper = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
`;

// Badge Component
interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
}

export const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing[1]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: ${theme.typography.letterSpacing.wide};
  
  ${({ variant = 'default' }) => {
    const variants = {
      success: {
        bg: `${theme.colors.success}20`,
        color: theme.colors.success,
      },
      warning: {
        bg: `${theme.colors.warning}20`,
        color: theme.colors.warning,
      },
      error: {
        bg: `${theme.colors.error}20`,
        color: theme.colors.error,
      },
      info: {
        bg: `${theme.colors.info}20`,
        color: theme.colors.info,
      },
      default: {
        bg: theme.colors.gray[200],
        color: theme.colors.gray[700],
      },
    };
    
    const { bg, color } = variants[variant];
    return `
      background: ${bg};
      color: ${color};
    `;
  }}
`;

// Avatar Component
interface AvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Avatar = styled.div<AvatarProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.background.gradient.cta};
  color: white;
  font-weight: ${theme.typography.fontWeight.semibold};
  overflow: hidden;
  flex-shrink: 0;
  
  ${({ size = 'md' }) => {
    const sizes = {
      sm: { size: '32px', font: theme.typography.fontSize.sm },
      md: { size: '40px', font: theme.typography.fontSize.base },
      lg: { size: '56px', font: theme.typography.fontSize.xl },
      xl: { size: '80px', font: theme.typography.fontSize['2xl'] },
    };
    
    const { size: dimension, font } = sizes[size];
    return `
      width: ${dimension};
      height: ${dimension};
      font-size: ${font};
    `;
  }}

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// Divider Component
export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${theme.colors.gray[200]};
  margin: ${theme.spacing[4]} 0;
`;

// Container Component
export const Container = styled.div`
  max-width: ${theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 ${theme.spacing[6]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0 ${theme.spacing[4]};
  }
`;

// Grid System
interface GridProps {
  cols?: number;
  gap?: string;
}

export const Grid = styled.div<GridProps>`
  display: grid;
  grid-template-columns: repeat(${({ cols = 1 }) => cols}, 1fr);
  gap: ${({ gap = theme.spacing[6] }) => gap};
  
  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(${({ cols = 1 }) => Math.min(cols, 2)}, 1fr);
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

// Flex utilities
export const Flex = styled.div<{
  direction?: 'row' | 'column';
  align?: string;
  justify?: string;
  gap?: string;
  wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${({ direction = 'row' }) => direction};
  align-items: ${({ align = 'stretch' }) => align};
  justify-content: ${({ justify = 'flex-start' }) => justify};
  gap: ${({ gap = theme.spacing[4] }) => gap};
  ${({ wrap }) => wrap && 'flex-wrap: wrap;'}
`;

// Section Component
export const Section = styled.section`
  padding: ${theme.spacing[16]} 0;
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[12]} 0;
  }
`;

// Loading Spinner
export const Spinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 4px solid ${theme.colors.gray[200]};
  border-top-color: ${theme.colors.primary.teal};
  border-radius: ${theme.borderRadius.full};
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex.modal};
`;
