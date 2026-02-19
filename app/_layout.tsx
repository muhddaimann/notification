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
        {/* PaperProvider MUST wrap everything that uses Paper components, including Contexts that render Paper Portal elements */}
        <PaperContextWrapper />
      </DesignSystemProvider>
    </SafeAreaProvider>
  );
}

// Separate component to access the theme from DesignSystemProvider
function PaperContextWrapper() {
  const { theme } = useDesignSystem();
  
  return (
    <PaperProvider theme={theme}>
      <LoaderProvider>
        <OverlayProvider>
          <RootLayoutNav />
        </OverlayProvider>
      </LoaderProvider>
    </PaperProvider>
  );
}
