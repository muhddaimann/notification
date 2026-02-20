import React, { createContext, useContext, useCallback } from "react";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const USER_DATA_KEY = "user_data";

type TokenContextType = {
  saveAuth: (token: string, userData: any) => Promise<void>;
  getAuth: () => Promise<{ token: string | null; userData: any | null }>;
  clearAuth: () => Promise<void>;
};

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const saveAuth = useCallback(async (token: string, userData: any) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));
  }, []);

  const getAuth = useCallback(async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const userDataRaw = await SecureStore.getItemAsync(USER_DATA_KEY);
    const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
    return { token, userData };
  }, []);

  const clearAuth = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_DATA_KEY);
  }, []);

  return (
    <TokenContext.Provider value={{ saveAuth, getAuth, clearAuth }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) throw new Error("useToken must be used within TokenProvider");
  return context;
};
