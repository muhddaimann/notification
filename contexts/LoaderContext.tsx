import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { View, StyleSheet, Animated } from "react-native";
import { ActivityIndicator, useTheme, Text } from "react-native-paper";

type LoaderContextType = {
  isLoading: boolean;
  loadingText?: string;
  showLoader: (text?: string) => void;
  hideLoader: () => void;
};

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loaderState, setLoaderState] = useState<{
    isVisible: boolean;
    text?: string;
  }>({
    isVisible: false,
  });
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: loaderState.isVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [loaderState.isVisible]);

  const showLoader = useCallback((text?: string) => {
    setLoaderState({ isVisible: true, text });
  }, []);

  const hideLoader = useCallback(() => {
    setLoaderState((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return (
    <LoaderContext.Provider
      value={{
        isLoading: loaderState.isVisible,
        loadingText: loaderState.text,
        showLoader,
        hideLoader,
      }}
    >
      <View style={{ flex: 1 }}>
        {children}

        <Animated.View
          pointerEvents={loaderState.isVisible ? "auto" : "none"}
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: theme.colors.primary + "CC",
              justifyContent: "center",
              alignItems: "center",
              opacity: fadeAnim,
              zIndex: 20000,
            },
          ]}
        >
          <ActivityIndicator size={48} color={theme.colors.onPrimary} />
          {loaderState.text && (
            <Text
              style={{
                color: theme.colors.onPrimary,
                marginTop: 16,
                fontFamily: "ComicNeue_700Bold",
                fontSize: 18,
                textAlign: "center",
                paddingHorizontal: 32,
              }}
            >
              {loaderState.text}
            </Text>
          )}
        </Animated.View>
      </View>
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
