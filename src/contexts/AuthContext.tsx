import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api, RegisterRequest } from "../services/api";

export type UserType = "admin" | "doctor" | "patient";

export interface User {
  id: string;
  name: string;
  userType: UserType;
  phone?: string;
  email?: string;
  avatar?: string;
  specialization?: string;
  isVerified?: boolean;
  doctorId?: number; // Thêm doctorId cho doctor
  patientId?: number; // Thêm patientId cho patient
  dateOfBirth?: string; // Thêm dateOfBirth (format: "YYYY-MM-DD" hoặc ISO string)
  gender?: string; // Thêm gender ("Male", "Female", "Other")
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (
    data: RegisterRequest
  ) => Promise<{ success: boolean; message?: string }>;
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

  // useEffect (checkAuthStatus) đã chuẩn, vì nó đọc roleName
  // Giữ nguyên phần này
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // api.checkAuthStatus đang hoạt động đúng (vì nó đọc roleName)
        const currentUser = await api.checkAuthStatus();
        setUser(currentUser);
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
      } catch (error) {
        setUser(null);
        localStorage.removeItem("currentUser");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (identifier: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Bước 1: Gọi API login. Nó chỉ set cookie và trả về { message: "..." }
      await api.login({
        UsernameOrPhoneOrEmail: identifier,
        Password: password,
      });

      // Bước 2: Nếu login thành công, GỌI checkAuthStatus để lấy dữ liệu user
      const currentUser = await api.checkAuthStatus();

      // Bước 3: Set user và lưu vào localStorage
      setUser(currentUser);
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      setIsLoading(false);
    } catch (err) {
      // Bất kỳ lỗi nào (login sai, checkAuth lỗi) đều sẽ nhảy vào đây
      console.error("Login failed:", err);
      setIsLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    try {
      await api.logout();
    } catch (error) {
      console.error("Error during API logout:", error);
    }
  };

  const register = async (
    data: RegisterRequest
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      // Bước 1: Gọi API register.
      // Giả định nó cũng tự động login (set cookie) và chỉ trả về thông báo
      const result = await api.register(data);

      // Bước 2: Nếu register thành công, GỌI checkAuthStatus
      // const currentUser = await api.checkAuthStatus();

      // Bước 3: Set user
      // setUser(currentUser);
      // localStorage.setItem("currentUser", JSON.stringify(currentUser));

      setIsLoading(false);
      return {
        success: true,
        message: result.message || "Registration successful. Please log in.",
      };
    } catch (err: any) {
      console.error("Register failed:", err);
      setIsLoading(false);
      return { success: false, message: err.message || "Registration failed" };
    }
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
