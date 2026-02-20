import React, { useEffect, useRef } from "react";
import { View, Animated, Easing, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import { useDesignSystem } from "../contexts/DesignSystemContext";

export default function Index() {
  const theme = useTheme();
  const router = useRouter();
  const { design } = useDesignSystem();
  const screenWidth = Dimensions.get("window").width;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnim, {
          toValue: -screenWidth * 0.3,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        router.replace("/a");
      });
    }, 2000);

    return () => clearTimeout(timeout);
  }, [router, screenWidth]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: design.spacing.xl,
        paddingTop: design.spacing["3xl"] * 4,
      }}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateX: translateAnim }],
        }}
      >
        <View
          style={{
            alignItems: "center",
            gap: design.spacing.sm,
          }}
        >
          <Text variant="headlineLarge" style={{ fontWeight: "600" }}>
            Faith HRMS
          </Text>

          <Text
            variant="bodyMedium"
            style={{
              opacity: 0.6,
              textAlign: "center",
              lineHeight: 20,
            }}
          >
            Preparing your workspace and syncing staff data...
          </Text>
        </View>

        <View
          style={{
            marginTop: design.spacing["2xl"],
            alignItems: "center",
          }}
        >
          <ActivityIndicator
            animating
            size="large"
            color={theme.colors.primary}
          />
        </View>
      </Animated.View>
    </View>
  );
}
