import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  DesignSystemProvider,
  useDesignSystem,
} from "../contexts/DesignSystemContext";
import { ScrollProvider } from "../contexts/ScrollContext";
import { LoaderProvider } from "../contexts/LoaderContext";
import { OverlayProvider } from "../contexts/OverlayContext";
import {
  useFonts,
  ComicNeue_400Regular,
  ComicNeue_700Bold,
} from "@expo-google-fonts/comic-neue";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { theme, isDarkMode } = useDesignSystem();

  return (
    <ScrollProvider>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <SafeAreaView
        edges={["top"]}
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </ScrollProvider>
  );
}

export default function Layout() {
  const [loaded, error] = useFonts({
    ComicNeue_400Regular,
    ComicNeue_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <DesignSystemProvider>
        <PaperContextWrapper />
      </DesignSystemProvider>
    </SafeAreaProvider>
  );
}

import { AlertUI, ConfirmUI } from "../components/overlay/AlertConfirm";
import { ToastUI } from "../components/overlay/Toast";
import { ModalUI } from "../components/overlay/CustomModal";

function PaperContextWrapper() {
  const { theme } = useDesignSystem();
  
  return (
    <PaperProvider theme={theme}>
      <LoaderProvider>
        <OverlayProvider
          AlertUI={AlertUI}
          ConfirmUI={ConfirmUI}
          ToastUI={ToastUI}
          ModalUI={ModalUI}
        >
          <RootLayoutNav />
        </OverlayProvider>
      </LoaderProvider>
    </PaperProvider>
  );
}
