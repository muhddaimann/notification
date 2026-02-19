import React, { createContext, useContext, useState, useCallback } from "react";
import { View, StyleSheet, Modal } from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";

type LoaderContextType = {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
};

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  const showLoader = useCallback(() => setIsLoading(true), []);
  const hideLoader = useCallback(() => setIsLoading(false), []);

  return (
    <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
      {children}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isLoading}
        onRequestClose={hideLoader}
      >
        <View style={[styles.container, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]}>
          <View style={[styles.loaderBox, { backgroundColor: theme.colors.surface }]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        </View>
      </Modal>
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (context === undefined) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderBox: {
    padding: 24,
    borderRadius: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
