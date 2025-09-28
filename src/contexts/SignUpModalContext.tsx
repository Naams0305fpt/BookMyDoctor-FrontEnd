import React, { createContext, useContext, useState, ReactNode } from "react";

interface SignUpModalContextType {
  showSignUp: boolean;
  openSignUp: () => void;
  closeSignUp: () => void;
}

const SignUpModalContext = createContext<SignUpModalContextType | undefined>(
  undefined
);

interface SignUpModalProviderProps {
  children: ReactNode;
}

export const SignUpModalProvider: React.FC<SignUpModalProviderProps> = ({
  children,
}) => {
  const [showSignUp, setShowSignUp] = useState(false);

  const openSignUp = () => setShowSignUp(true);
  const closeSignUp = () => setShowSignUp(false);

  const value: SignUpModalContextType = {
    showSignUp,
    openSignUp,
    closeSignUp,
  };

  return (
    <SignUpModalContext.Provider value={value}>
      {children}
    </SignUpModalContext.Provider>
  );
};

export const useSignUpModal = (): SignUpModalContextType => {
  const context = useContext(SignUpModalContext);
  if (context === undefined) {
    throw new Error("useSignUpModal must be used within a SignUpModalProvider");
  }
  return context;
};
