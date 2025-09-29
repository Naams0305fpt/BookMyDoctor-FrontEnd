import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type UserType = "admin" | "doctor" | "patient";

export interface User {
  id: string;
  name: string;
  userType: UserType;
  phone: string; // Made required since it's our primary identifier
  email?: string; // Made optional since we're using phone-based auth
  avatar?: string;
  specialization?: string; // For doctors
  isVerified?: boolean; // For doctors
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (phoneNumber: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    phone: "0123456789",
    name: "Dr. Admin Smith",
    userType: "admin",
    avatar: "/images/admin-avatar.png",
    email: "admin@bookmydoctor.com",
  },
  {
    id: "2",
    phone: "0987654321",
    name: "Dr. Sarah Johnson",
    userType: "doctor",
    avatar: "/images/doctor-avatar.png",
    specialization: "Cardiology",
    isVerified: true,
    email: "doctor@bookmydoctor.com",
  },
  {
    id: "3",
    phone: "0983214567",
    name: "John Doe",
    userType: "patient",
    avatar: "/images/patient-avatar.png",
    email: "patient@bookmydoctor.com",
  },
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session on app load
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("currentUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (
    phoneNumber: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if the phone number exists and the password matches demo123
    const foundUser = mockUsers.find((u) => u.phone === phoneNumber);
    const isValidPassword = password === "demo123";

    if (foundUser && isValidPassword) {
      setUser(foundUser);
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if user already exists with the same phone number
    const userExists = mockUsers.some((u) => u.phone === data.phone);

    if (userExists) {
      setIsLoading(false);
      return false;
    }

    // Create new user
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      name: `${data.firstName} ${data.lastName}`,
      userType: "patient",
      phone: data.phone,
      avatar: "/images/default-avatar.png",
    };

    // In a real app, you would make an API call here
    mockUsers.push(newUser);

    // Log in the new user
    setUser(newUser);
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
