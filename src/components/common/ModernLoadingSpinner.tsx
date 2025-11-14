import React from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

const SpinnerWrapper = styled.div<{ fullScreen?: boolean }>`
  ${({ fullScreen }) => fullScreen && `
    position: fixed;
    inset: 0;
    z-index: ${theme.zIndex.modal};
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
  `}
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[4]};
  padding: ${theme.spacing[8]};
`;

const SpinnerContainer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
`;

const SpinnerRing = styled(motion.div)<{ delay: number }>`
  position: absolute;
  inset: 0;
  border: 4px solid transparent;
  border-top-color: ${theme.colors.primary.teal};
  border-radius: ${theme.borderRadius.full};
  opacity: ${({ delay }) => 1 - delay * 0.3};
`;

const SpinnerDot = styled(motion.div)`
  position: absolute;
  width: 16px;
  height: 16px;
  background: ${theme.colors.background.gradient.cta};
  border-radius: ${theme.borderRadius.full};
  box-shadow: ${theme.colors.shadow.colored.teal};
`;

const LoadingText = styled(motion.p)`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const DotsWrapper = styled.div`
  display: flex;
  gap: ${theme.spacing[1]};
`;

const Dot = styled(motion.span)`
  width: 8px;
  height: 8px;
  background: ${theme.colors.primary.teal};
  border-radius: ${theme.borderRadius.full};
`;

const ModernLoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  fullScreen = true,
}) => {
  return (
    <SpinnerWrapper fullScreen={fullScreen}>
      <SpinnerContainer>
        {/* Spinning Rings */}
        {[0, 1, 2].map((index) => (
          <SpinnerRing
            key={index}
            delay={index * 0.15}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
              delay: index * 0.15,
            }}
          />
        ))}

        {/* Central Dot */}
        <SpinnerDot
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </SpinnerContainer>

      {message && (
        <>
          <LoadingText
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {message}
          </LoadingText>

          <DotsWrapper>
            {[0, 1, 2].map((index) => (
              <Dot
                key={index}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              />
            ))}
          </DotsWrapper>
        </>
      )}
    </SpinnerWrapper>
  );
};

export default ModernLoadingSpinner;
