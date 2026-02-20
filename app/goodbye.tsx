import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";
import { Text, useTheme, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import { useDesignSystem } from "../contexts/DesignSystemContext";

export default function Goodbye() {
  const { theme, design } = useDesignSystem();
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        router.replace("/");
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
          transform: [{ translateY: slideAnim }],
          alignItems: "center",
        }}
      >
        <Text variant="displaySmall" style={{ fontWeight: "800", marginBottom: 8 }}>
          Goodbye!
        </Text>
        <Text variant="bodyLarge" style={{ opacity: 0.6, marginBottom: 32, textAlign: 'center' }}>
          You've successfully signed out. See you again!
        </Text>
        <ActivityIndicator animating size="small" color={theme.colors.error} />
        <Text variant="bodySmall" style={{ marginTop: 16, opacity: 0.5 }}>
          Returning to login screen...
        </Text>
      </Animated.View>
    </View>
  );
}
