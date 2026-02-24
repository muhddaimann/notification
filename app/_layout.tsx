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

import { TokenProvider } from "../contexts/TokenContext";
import { AuthProvider } from "../contexts/AuthContext";

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
      <TokenProvider>
        <AuthProvider>
          <DesignSystemProvider>
            <PaperContextWrapper />
          </DesignSystemProvider>
        </AuthProvider>
      </TokenProvider>
    </SafeAreaProvider>
  );
}

import { AlertUI, ConfirmUI } from "../components/overlay/AlertConfirm";
import { ToastUI } from "../components/overlay/Toast";
import { ModalUI } from "../components/overlay/CustomModal";

import { NotificationProvider } from "../contexts/NotificationContext";

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
          <NotificationProvider>
            <RootLayoutNav />
          </NotificationProvider>
        </OverlayProvider>
      </LoaderProvider>
    </PaperProvider>
  );
}
