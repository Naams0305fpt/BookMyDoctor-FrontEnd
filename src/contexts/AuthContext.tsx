import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserType = 'admin' | 'doctor' | 'patient';

export interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  avatar?: string;
  specialization?: string; // For doctors
  isVerified?: boolean; // For doctors
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@bookmydoctor.com',
    name: 'Dr. Admin Smith',
    userType: 'admin',
    avatar: '/images/admin-avatar.png'
  },
  {
    id: '2',
    email: 'doctor@bookmydoctor.com',
    name: 'Dr. Sarah Johnson',
    userType: 'doctor',
    avatar: '/images/doctor-avatar.png',
    specialization: 'Cardiology',
    isVerified: true
  },
  {
    id: '3',
    email: 'patient@bookmydoctor.com',
    name: 'John Doe',
    userType: 'patient',
    avatar: '/images/patient-avatar.png'
  },
  {
    id: '4',
    email: 'doctor2@bookmydoctor.com',
    name: 'Dr. Michael Chen',
    userType: 'doctor',
    avatar: '/images/doctor2-avatar.png',
    specialization: 'Pediatrics',
    isVerified: true
  }
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session on app load
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, any password works with the mock users
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};