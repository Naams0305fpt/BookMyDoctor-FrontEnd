/**
 * Design System Theme Configuration
 * Modern medical booking platform with professional aesthetics
 */

export const theme = {
  // Color Palette - Medical Professional Theme
  colors: {
    // Primary Colors
    primary: {
      teal: '#13B6C6',
      light: '#17A3B7',
      dark: '#0E8694',
      lighter: '#A8E1EA',
      lightest: '#C8F3E1',
    },
    secondary: {
      blue: '#477DFF',
      light: '#6B95FF',
      dark: '#3661DB',
      lighter: '#90B8F7',
    },
    accent: {
      navy: '#113B57',
      purple: '#D8B4FE',
      aqua: 'rgba(23, 163, 183, 0.85)',
    },
    
    // Semantic Colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Neutrals
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    
    // Text
    text: {
      primary: 'rgba(14, 43, 58, 0.95)',
      secondary: 'rgba(14, 43, 58, 0.75)',
      tertiary: 'rgba(14, 43, 58, 0.6)',
      disabled: 'rgba(14, 43, 58, 0.4)',
      inverse: '#FFFFFF',
    },
    
    // Backgrounds
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6',
      gradient: {
        primary: 'linear-gradient(135deg, #C8F3E1 0%, #A8E1EA 50%, #90B8F7 100%)',
        hero: 'linear-gradient(120deg, #C8F3E1 0%, #A8E1EA 35%, #90B8F7 100%)',
        cta: 'linear-gradient(90deg, #13B6C6 0%, #477DFF 100%)',
        card: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 100%)',
        overlay: 'linear-gradient(180deg, rgba(17, 59, 87, 0) 0%, rgba(17, 59, 87, 0.8) 100%)',
      },
    },
    
    // Shadows & Effects
    shadow: {
      xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      sm: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
      md: '0 4px 16px 0 rgba(0, 0, 0, 0.12)',
      lg: '0 8px 24px 0 rgba(0, 0, 0, 0.15)',
      xl: '0 12px 32px 0 rgba(0, 0, 0, 0.18)',
      colored: {
        teal: '0 8px 24px 0 rgba(19, 182, 198, 0.25)',
        blue: '0 8px 24px 0 rgba(71, 125, 255, 0.25)',
      },
    },
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      script: "'Great Vibes', cursive",
      mono: "'Fira Code', 'Courier New', monospace",
    },
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem',   // 60px
      '7xl': '4.5rem',    // 72px
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
    letterSpacing: {
      tight: '-0.02em',
      normal: '0',
      wide: '0.02em',
      wider: '0.05em',
    },
  },
  
  // Spacing (8px base system)
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    base: '0.5rem',   // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    '2xl': '2rem',    // 32px
    '3xl': '3rem',    // 48px
    full: '9999px',
    card: '1.5rem',   // 24px
    pill: '9999px',
    avatar: '1.25rem', // 20px
  },
  
  // Breakpoints
  breakpoints: {
    xs: '375px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Z-index
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
  
  // Transitions
  transitions: {
    duration: {
      fastest: '100ms',
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
      slowest: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
  
  // Animation Variants for Framer Motion
  animations: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    slideDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
    },
    scaleSpring: {
      initial: { scale: 0 },
      animate: { scale: 1 },
      transition: { type: 'spring', stiffness: 500, damping: 30 },
    },
  },
  
  // Layout
  layout: {
    maxWidth: '1280px',
    headerHeight: '80px',
    footerHeight: '400px',
    sidebarWidth: '280px',
    containerPadding: '2rem',
  },
} as const;

export type Theme = typeof theme;

// Helper function to create media queries
export const media = {
  xs: `@media (min-width: ${theme.breakpoints.xs})`,
  sm: `@media (min-width: ${theme.breakpoints.sm})`,
  md: `@media (min-width: ${theme.breakpoints.md})`,
  lg: `@media (min-width: ${theme.breakpoints.lg})`,
  xl: `@media (min-width: ${theme.breakpoints.xl})`,
  '2xl': `@media (min-width: ${theme.breakpoints['2xl']})`,
};

export default theme;
