import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "../services/api";

export type UserType = "admin" | "doctor" | "patient";

// Mock users for testing
const mockUsers = {
  admin: {
    id: "mock-admin-1",
    name: "Admin User",
    userType: "admin" as UserType,
    phone: "0123456789",
    email: "admin@bookdoctor.com",
    avatar: "/images/default-avatar.png",
    isVerified: true,
  },
  doctor: {
    id: "mock-doctor-1",
    name: "Dr. John Smith",
    userType: "doctor" as UserType,
    phone: "0987654321",
    email: "dr.smith@bookdoctor.com",
    avatar: "/images/doctor1.png",
    specialization: "General Medicine",
    isVerified: true,
  },
  patient: {
    id: "mock-patient-1",
    name: "Alice Johnson",
    userType: "patient" as UserType,
    phone: "+0983214567",
    email: "alice@example.com",
    avatar: "/images/default-avatar.png",
    isVerified: true,
  },
};

export interface User {
  id: string;
  name: string;
  userType: UserType;
  phone: string;
  email?: string;
  avatar?: string;
  specialization?: string;
  isVerified?: boolean;
}

export interface RegisterData {
  username: string;
  email?: string;
  phone: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<boolean>;
  register: (
    data: RegisterData
  ) => Promise<{ success: boolean; message?: string }>; // <-- sửa đây
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
    identifier: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);

    // Mock login for testing - password is demmo123 for all mock users
    if (password === "demo123") {
      let mockUser = null;

      if (
        identifier === "admin@bookdoctor.com" ||
        identifier === "0123456789"
      ) {
        mockUser = mockUsers.admin;
      } else if (
        identifier === "dr.smith@bookdoctor.com" ||
        identifier === "0987654321"
      ) {
        mockUser = mockUsers.doctor;
      } else if (
        identifier === "alice@example.com" ||
        identifier === "0983214567"
      ) {
        mockUser = mockUsers.patient;
      }

      if (mockUser) {
        setUser(mockUser);
        localStorage.setItem("currentUser", JSON.stringify(mockUser));
        localStorage.setItem("token", `mock-token-${mockUser.userType}`);
        setIsLoading(false);
        return true;
      }
    }

    // Real API login
    // try {
    //   const result = await api.login({ identifier, password });

    //   if (result) {
    //     const loggedUser: User = {
    //       id: result.id || "temp-id",
    //       name: result.username || identifier,
    //       phone: result.phone || identifier,
    //       userType: "patient",
    //       email: result.email,
    //       avatar: "/images/default-avatar.png",
    //     };

    //     setUser(loggedUser);
    //     localStorage.setItem("currentUser", JSON.stringify(loggedUser));
    //     if (result.token) {
    //       localStorage.setItem("token", result.token);
    //     }

    //     setIsLoading(false);
    //     return true;
    //   }
    // } catch (err) {
    //   console.error("Login failed:", err);
    // }
    setIsLoading(false);
    return false;
  };

  const register = async (
    data: RegisterData
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const result = await api.register({
        username: data.username,
        email: data.email || "",
        phone: data.phone,
        password: data.password,
      });

      if (result) {
        const newUser: User = {
          id: result.id || "temp-id",
          name: data.username,
          userType: "patient",
          phone: data.phone,
          email: data.email,
          avatar: "/images/default-avatar.png",
        };

        setUser(newUser);
        localStorage.setItem("currentUser", JSON.stringify(newUser));
        if (result.token) {
          localStorage.setItem("token", result.token);
        }

        setIsLoading(false);
        return { success: true, message: "Registration successful" };
      }
    } catch (err: any) {
      console.error("Register failed:", err);
      return { success: false, message: err.message || "Registration failed" };
    }

    setIsLoading(false);
    return { success: false, message: "Registration failed" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
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
