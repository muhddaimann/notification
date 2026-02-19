import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { FAB, useTheme } from "react-native-paper";
import { useScroll } from "../contexts/ScrollContext";
import { useDesignSystem } from "../contexts/DesignSystemContext";

type ScrollTopProps = {
  tabName: string;
};

export default function ScrollTop({ tabName }: ScrollTopProps) {
  const theme = useTheme();
  const { design } = useDesignSystem();
  const { scrollY, scrollToTop, isNavBarVisible } = useScroll();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;
  const navBarOffset = useRef(new Animated.Value(0)).current;

  const isVisible = scrollY > 300;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: isVisible ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: isVisible ? 0 : -20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isVisible]);

  useEffect(() => {
    Animated.timing(navBarOffset, {
      toValue: isNavBarVisible ? 0 : -20,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isNavBarVisible]);

  return (
    <Animated.View
      pointerEvents={isVisible ? "auto" : "none"}
      style={{
        position: "absolute",
        top: design.spacing.xl,
        alignSelf: "center",
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { translateY: navBarOffset }],
      }}
    >
      <FAB
        icon="chevron-up"
        size="small"
        onPress={() => scrollToTop(tabName)}
        style={{
          backgroundColor: theme.colors.primary,
          borderRadius: design.radii.pill,
        }}
        color={theme.colors.onPrimary}
      />
    </Animated.View>
  );
}
