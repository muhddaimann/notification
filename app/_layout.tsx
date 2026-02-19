import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  DesignSystemProvider,
  useDesignSystem,
} from "../contexts/DesignSystemContext";
import { ScrollProvider } from "../contexts/ScrollContext";
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
      <PaperProvider theme={theme}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <SafeAreaView
          edges={["top"]}
          style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaView>
      </PaperProvider>
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
        <RootLayoutNav />
      </DesignSystemProvider>
    </SafeAreaProvider>
  );
}
