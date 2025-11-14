import { Global, css } from "@emotion/react";
import { theme } from "./theme";

export const GlobalStyles = () => (
  <Global
    styles={css`
      /* Import fonts */
      @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Great+Vibes&display=swap");

      /* CSS Reset */
      *,
      *::before,
      *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      html {
        scroll-behavior: smooth;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      body {
        font-family: ${theme.typography.fontFamily.sans};
        font-size: ${theme.typography.fontSize.base};
        line-height: ${theme.typography.lineHeight.normal};
        color: ${theme.colors.text.primary};
        background: ${theme.colors.background.gradient.primary};
        min-height: 100vh;
        overflow-x: hidden;
      }

      /* Remove focus outline for mouse users but keep for keyboard users */
      :focus:not(:focus-visible) {
        outline: none;
      }

      :focus-visible {
        outline: 2px solid ${theme.colors.primary.teal};
        outline-offset: 2px;
        border-radius: ${theme.borderRadius.sm};
      }

      /* Selection styles */
      ::selection {
        background-color: ${theme.colors.primary.teal};
        color: white;
      }

      /* Custom Scrollbar */
      ::-webkit-scrollbar {
        width: 12px;
        height: 12px;
      }

      ::-webkit-scrollbar-track {
        background: ${theme.colors.gray[100]};
      }

      ::-webkit-scrollbar-thumb {
        background: ${theme.colors.primary.teal};
        border-radius: ${theme.borderRadius.full};
        border: 2px solid ${theme.colors.gray[100]};

        &:hover {
          background: ${theme.colors.primary.dark};
        }
      }

      /* Links */
      a {
        color: ${theme.colors.primary.teal};
        text-decoration: none;
        transition: color ${theme.transitions.duration.fast}
          ${theme.transitions.easing.default};

        &:hover {
          color: ${theme.colors.primary.dark};
        }
      }

      /* Images */
      img,
      picture,
      video,
      canvas,
      svg {
        display: block;
        max-width: 100%;
        height: auto;
      }

      /* Form elements */
      input,
      button,
      textarea,
      select {
        font: inherit;
      }

      button {
        cursor: pointer;
        border: none;
        background: none;
      }

      /* Headings */
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-weight: ${theme.typography.fontWeight.bold};
        line-height: ${theme.typography.lineHeight.tight};
        color: ${theme.colors.accent.navy};
      }

      h1 {
        font-size: ${theme.typography.fontSize["5xl"]};
        font-weight: ${theme.typography.fontWeight.extrabold};

        @media (max-width: ${theme.breakpoints.md}) {
          font-size: ${theme.typography.fontSize["4xl"]};
        }
      }

      h2 {
        font-size: ${theme.typography.fontSize["4xl"]};

        @media (max-width: ${theme.breakpoints.md}) {
          font-size: ${theme.typography.fontSize["3xl"]};
        }
      }

      h3 {
        font-size: ${theme.typography.fontSize["3xl"]};

        @media (max-width: ${theme.breakpoints.md}) {
          font-size: ${theme.typography.fontSize["2xl"]};
        }
      }

      h4 {
        font-size: ${theme.typography.fontSize["2xl"]};
      }

      h5 {
        font-size: ${theme.typography.fontSize.xl};
      }

      h6 {
        font-size: ${theme.typography.fontSize.lg};
      }

      /* Utility Classes */
      .container {
        max-width: ${theme.layout.maxWidth};
        margin: 0 auto;
        padding: 0 ${theme.spacing[6]};

        @media (max-width: ${theme.breakpoints.md}) {
          padding: 0 ${theme.spacing[4]};
        }
      }

      .text-center {
        text-align: center;
      }
      .text-left {
        text-align: left;
      }
      .text-right {
        text-align: right;
      }

      .font-script {
        font-family: ${theme.typography.fontFamily.script};
      }
      .font-mono {
        font-family: ${theme.typography.fontFamily.mono};
      }

      .uppercase {
        text-transform: uppercase;
      }
      .capitalize {
        text-transform: capitalize;
      }

      /* Animations */
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes shimmer {
        0% {
          background-position: -1000px 0;
        }
        100% {
          background-position: 1000px 0;
        }
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }

      @keyframes float {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      @keyframes bounce {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-5px);
        }
      }

      /* Animation utility classes */
      .animate-fadeIn {
        animation: fadeIn ${theme.transitions.duration.normal}
          ${theme.transitions.easing.default};
      }

      .animate-slideUp {
        animation: slideUp ${theme.transitions.duration.normal}
          ${theme.transitions.easing.default};
      }

      .animate-slideDown {
        animation: slideDown ${theme.transitions.duration.normal}
          ${theme.transitions.easing.default};
      }

      .animate-scaleIn {
        animation: scaleIn ${theme.transitions.duration.normal}
          ${theme.transitions.easing.spring};
      }

      .animate-pulse {
        animation: pulse 2s ${theme.transitions.easing.default} infinite;
      }

      .animate-float {
        animation: float 3s ${theme.transitions.easing.inOut} infinite;
      }

      .animate-bounce {
        animation: bounce 1s ${theme.transitions.easing.default} infinite;
      }

      /* Loading skeleton */
      .skeleton {
        background: linear-gradient(
          90deg,
          ${theme.colors.gray[200]} 0%,
          ${theme.colors.gray[100]} 50%,
          ${theme.colors.gray[200]} 100%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: ${theme.borderRadius.md};
      }

      /* Glassmorphism effect */
      .glass {
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      /* Gradient text */
      .gradient-text {
        background: ${theme.colors.background.gradient.cta};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      /* Card hover effect */
      .card-hover {
        transition: all ${theme.transitions.duration.normal}
          ${theme.transitions.easing.default};

        &:hover {
          transform: translateY(-4px);
          box-shadow: ${theme.colors.shadow.lg};
        }
      }

      /* Smooth transitions */
      .transition {
        transition: all ${theme.transitions.duration.normal}
          ${theme.transitions.easing.default};
      }

      .transition-fast {
        transition: all ${theme.transitions.duration.fast}
          ${theme.transitions.easing.default};
      }

      .transition-slow {
        transition: all ${theme.transitions.duration.slow}
          ${theme.transitions.easing.default};
      }
    `}
  />
);

export default GlobalStyles;
