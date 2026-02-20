import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useToken } from "./TokenContext";

type User = {
  id: string;
  username: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<boolean>;
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
      if (password === "123") {
        const dummyToken = "auth-token-123-" + Date.now();
        const userData = { id: "1", username, name: "Daimann" };
        
        await saveAuth(dummyToken, userData);
        setUser(userData);
        return true;
      }
      return false;
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
