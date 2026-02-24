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

import { useAuth } from "../../../contexts/AuthContext";
import { useNotifications } from "../../../contexts/NotificationContext";

export default function SettingsScreen() {
  const theme = useTheme();
  const { design, isDarkMode, toggleTheme } = useDesignSystem();
  const { handleScroll, registerScrollRef } = useScroll();
  const { user } = useAuth();
  const { expoPushToken, register } = useNotifications();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    registerScrollRef("b", scrollRef.current);
  }, [registerScrollRef]);

  const handlePushToggle = async () => {
    if (!expoPushToken) {
      await register();
    }
  };

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
            style={{ marginTop: design.spacing.sm, fontWeight: '700' }}
          >
            {user?.name || "Guest User"}
          </Text>
          <Text variant="bodyMedium" style={{ opacity: 0.7 }}>
            @{user?.username || "guest"}
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

        <List.Section title="System">
          <List.Item
            title="Push Notifications"
            description={expoPushToken ? "Notifications enabled" : "Enable push notifications"}
            left={(props) => <List.Icon {...props} icon="bell-outline" />}
            right={() => (
              <Switch 
                value={!!expoPushToken} 
                onValueChange={handlePushToggle}
                disabled={!!expoPushToken}
              />
            )}
          />
          {expoPushToken && (
             <List.Item
             title="Token"
             description={expoPushToken}
             descriptionNumberOfLines={1}
             left={(props) => <List.Icon {...props} icon="key-outline" />}
           />
          )}
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
