import React, { useRef, useEffect } from "react";
import { ScrollView, View } from "react-native";
import {
  List,
  Switch,
  Text,
  Divider,
  useTheme,
  Avatar,
} from "react-native-paper";
import { useDesignSystem } from "../../../contexts/DesignSystemContext";
import { useScroll } from "../../../contexts/ScrollContext";
import ScrollTop from "../../../components/scrollTop";

export default function SettingsScreen() {
  const theme = useTheme();
  const { design, isDarkMode, toggleTheme } = useDesignSystem();
  const { handleScroll, registerScrollRef } = useScroll();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    registerScrollRef("b", scrollRef.current);
  }, [registerScrollRef]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
        alwaysBounceVertical={false}
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
        contentContainerStyle={{
          paddingBottom: design.spacing["3xl"] * 2,
        }}
      >
        <View
          style={{
            padding: design.spacing.md,
            alignItems: "center",
            marginVertical: design.spacing.lg,
          }}
        >
          <Avatar.Icon size={80} icon="account" />
          <Text
            variant="headlineSmall"
            style={{ marginTop: design.spacing.sm }}
          >
            Guest User
          </Text>
          <Text variant="bodyMedium" style={{ opacity: 0.7 }}>
            guest@example.com
          </Text>
        </View>

        <Divider />

        <List.Section title="Appearance">
          <List.Item
            title="Dark Mode"
            description="Toggle application theme"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch value={isDarkMode} onValueChange={toggleTheme} />
            )}
          />
        </List.Section>

        <Divider />

        <List.Section title="About">
          <List.Item
            title="App Version"
            description="1.0.0"
            left={(props) => (
              <List.Icon {...props} icon="information-outline" />
            )}
          />
          <List.Item
            title="Design Token: Spacing"
            description={`MD: ${design.spacing.md}, LG: ${design.spacing.lg}`}
            left={(props) => <List.Icon {...props} icon="format-size" />}
          />
          <List.Item
            title="Design Token: Radii"
            description={`LG: ${design.radii.lg}, XL: ${design.radii.xl}`}
            left={(props) => <List.Icon {...props} icon="rounded-corner" />}
          />
        </List.Section>

        <View
          style={{
            padding: design.spacing.md,
            marginTop: design.spacing.xl,
          }}
        >
          <Text
            variant="bodySmall"
            style={{ textAlign: "center", opacity: 0.5 }}
          >
            Built with React Native Paper & Expo Router
          </Text>
        </View>
      </ScrollView>

      <ScrollTop tabName="b" />
    </View>
  );
}
