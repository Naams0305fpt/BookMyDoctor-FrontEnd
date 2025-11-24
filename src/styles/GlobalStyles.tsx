import React from "react";
import { Global, css } from "@emotion/react";
import { theme } from "./theme";

const GlobalStyles: React.FC = () => (
  <Global
    styles={css`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      html {
        scroll-behavior: smooth;
      }

      body {
        font-family: ${theme.typography.fontFamily.sans};
        color: ${theme.colors.text.primary};
        background: ${theme.colors.background.primary};
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      #root {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 10px;
      }

      ::-webkit-scrollbar-track {
        background: ${theme.colors.gray[100]};
      }

      ::-webkit-scrollbar-thumb {
        background: ${theme.colors.primary.teal};
        border-radius: ${theme.borderRadius.full};
      }

      ::-webkit-scrollbar-thumb:hover {
        background: ${theme.colors.primary.dark};
      }

      /* Focus visible for accessibility */
      *:focus-visible {
        outline: 2px solid ${theme.colors.primary.teal};
        outline-offset: 2px;
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
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .animate-spin {
        animation: spin 1s linear infinite;
      }
    `}
  />
);

export default GlobalStyles;
