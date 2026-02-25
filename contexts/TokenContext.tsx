import React, { createContext, useContext, useCallback } from "react";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const USER_DATA_KEY = "user_data";
const PUSH_TOKEN_KEY = "expo_push_token";

type TokenContextType = {
  saveAuth: (token: string, userData: any) => Promise<void>;
  getAuth: () => Promise<{ token: string | null; userData: any | null }>;
  clearAuth: () => Promise<void>;
  savePushToken: (token: string) => Promise<void>;
  getPushToken: () => Promise<string | null>;
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
    // Note: We might want to keep push token even after logout, 
    // or clear it to stop receiving notifications for that user.
    // Usually, it's safer to clear it or let the backend handle it.
    await SecureStore.deleteItemAsync(PUSH_TOKEN_KEY);
  }, []);

  const savePushToken = useCallback(async (token: string) => {
    await SecureStore.setItemAsync(PUSH_TOKEN_KEY, token);
  }, []);

  const getPushToken = useCallback(async () => {
    return await SecureStore.getItemAsync(PUSH_TOKEN_KEY);
  }, []);

  return (
    <TokenContext.Provider value={{ saveAuth, getAuth, clearAuth, savePushToken, getPushToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) throw new Error("useToken must be used within TokenProvider");
  return context;
};
