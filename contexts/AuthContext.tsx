import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useToken } from "./TokenContext";
import { loginApi, AuthResponse } from "./api/auth";

type User = {
  id: string;
  username: string;
  name: string;
  SiteDepartmentProfileID?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getAuth, saveAuth, clearAuth } = useToken();

  const loadAuth = useCallback(async () => {
    try {
      const { token, userData } = await getAuth();
      if (token && userData) {
        setUser(userData);
      }
    } catch (e) {
      console.error("Auth initialization failed", e);
    } finally {
      setIsLoading(false);
    }
  }, [getAuth]);

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  const signIn = useCallback(
    async (username: string, password: string) => {
      try {
        const response: AuthResponse = await loginApi({ username, password });

        if (response.status === "success" && response.token) {
          const userData: User = { 
            id: String(response.staff_id || ""), 
            username, 
            name: response.user_name || username,
            SiteDepartmentProfileID: response.SiteDepartmentProfileID
          };
          
          await saveAuth(response.token, userData);
          setUser(userData);
          return { success: true };
        } else {
          return { 
            success: false, 
            message: response.message || "Invalid credentials" 
          };
        }
      } catch (error: any) {
        return { 
          success: false, 
          message: error.message || "An error occurred during login" 
        };
      }
    },
    [saveAuth]
  );

  const signOut = useCallback(async () => {
    await clearAuth();
    setUser(null);
  }, [clearAuth]);

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
