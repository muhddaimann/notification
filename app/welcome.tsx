import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";
import { Text, useTheme, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { useDesignSystem } from "../contexts/DesignSystemContext";

export default function Welcome() {
  const { theme, design } = useDesignSystem();
  const { user } = useAuth();
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        router.replace("/(tabs)/a");
      });
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: design.spacing.xl,
      }}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          alignItems: "center",
        }}
      >
        <Text variant="displaySmall" style={{ fontWeight: "800", marginBottom: 8, textAlign: 'center' }}>
          Welcome back,
        </Text>
        <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: "700", marginBottom: 32 }}>
          {user?.name || "User"}
        </Text>
        <ActivityIndicator animating size="small" color={theme.colors.primary} />
        <Text variant="bodySmall" style={{ marginTop: 16, opacity: 0.5 }}>
          Preparing your dashboard...
        </Text>
      </Animated.View>
    </View>
  );
}
