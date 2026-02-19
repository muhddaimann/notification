import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useColorScheme } from "react-native";
import { MD3Theme } from "react-native-paper";
import { design, DesignTokens } from "../constants/design";
import { lightTheme, darkTheme } from "../constants/theme";

type DesignSystemContextType = {
  design: DesignTokens;
  theme: MD3Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const DesignSystemContext = createContext<DesignSystemContextType | undefined>(
  undefined
);

export const DesignSystemProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");

  useEffect(() => {
    setIsDarkMode(colorScheme === "dark");
  }, [colorScheme]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const theme = useMemo(() => {
    return isDarkMode ? darkTheme : lightTheme;
  }, [isDarkMode]);

  const value = useMemo(
    () => ({
      design,
      theme,
      isDarkMode,
      toggleTheme,
    }),
    [theme, isDarkMode]
  );

  return (
    <DesignSystemContext.Provider value={value}>
      {children}
    </DesignSystemContext.Provider>
  );
};

export const useDesignSystem = () => {
  const context = useContext(DesignSystemContext);
  if (context === undefined) {
    throw new Error(
      "useDesignSystem must be used within a DesignSystemProvider"
    );
  }
  return context;
};
