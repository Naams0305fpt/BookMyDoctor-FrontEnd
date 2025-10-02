import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "../services/api";

export type UserType = "admin" | "doctor" | "patient";

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
    try {
      const result = await api.login({ identifier, password });

      if (result) {
        const loggedUser: User = {
          id: result.id || "temp-id",
          name: result.username || identifier,
          phone: result.phone || identifier,
          userType: "patient", // Hoặc lấy từ result.role nếu backend có trả
          email: result.email,
          avatar: "/images/default-avatar.png",
        };

        setUser(loggedUser);
        localStorage.setItem("currentUser", JSON.stringify(loggedUser));
        if (result.token) {
          localStorage.setItem("token", result.token);
        }

        setIsLoading(false);
        return true;
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
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
