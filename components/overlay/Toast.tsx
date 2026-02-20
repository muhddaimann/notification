import React, { useEffect, useRef, useState } from "react";
import { View, Animated, Easing, Pressable } from "react-native";
import { Text, Surface, IconButton, Button } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesignSystem } from "../../contexts/DesignSystemContext";
import { ToastOptions } from "../../contexts/OverlayContext";

interface ToastUIProps {
  visible: boolean;
  state: ToastOptions;
}

export const ToastUI: React.FC<ToastUIProps> = ({ visible, state }) => {
  const { theme, design } = useDesignSystem();
  const insets = useSafeAreaInsets();

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-24)).current;
  const scale = useRef(new Animated.Value(0.98)).current;

  const [activeState, setActiveState] = useState<ToastOptions>(state);
  const [rendered, setRendered] = useState(false);

  const variant = activeState.variant ?? "info";

  const config = (() => {
    switch (variant) {
      case "success":
        return { color: theme.colors.tertiary, icon: "check-circle" };
      case "error":
        return { color: theme.colors.error, icon: "close-circle" };
      case "warning":
        return { color: theme.colors.secondary, icon: "alert-circle" };
      case "info":
      default:
        return { color: theme.colors.primary, icon: "information" };
    }
  })();

  const animateIn = () => {
    opacity.setValue(0);
    translateY.setValue(-24);
    scale.setValue(0.98);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateOut = (cb?: () => void) => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -24,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.98,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(cb);
  };

  useEffect(() => {
    if (visible) {
      setActiveState(state);
      setRendered(true);
      animateIn();
    } else if (rendered) {
      animateOut(() => setRendered(false));
    }
  }, [visible, state]);

  if (!rendered) return null;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        top: insets.top + design.spacing.sm,
        left: design.spacing.lg,
        right: design.spacing.lg,
        zIndex: 9999,
      }}
    >
      <Animated.View
        style={{
          opacity,
          transform: [{ translateY }, { scale }],
        }}
      >
        <Pressable>
          <Surface
            style={{
              borderRadius: design.radii.xl,
              backgroundColor: theme.colors.surface,
              paddingHorizontal: design.spacing.lg,
              paddingVertical: design.spacing.md,
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: config.color + "33",
              shadowColor: config.color,
              shadowOpacity: 0.15,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 8 },
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: config.color + "15",
                marginRight: design.spacing.sm,
              }}
            >
              <IconButton
                icon={config.icon}
                iconColor={config.color}
                size={18}
                style={{ margin: 0 }}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                variant="bodyMedium"
                numberOfLines={2}
                style={{
                  color: theme.colors.onSurface,
                  lineHeight: 20,
                  fontWeight: "600",
                }}
              >
                {activeState.message}
              </Text>
            </View>

            {activeState.actionLabel && activeState.onAction && (
              <Button
                mode="text"
                onPress={activeState.onAction}
                textColor={config.color}
                compact
                style={{ marginLeft: design.spacing.sm }}
                labelStyle={{
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                {activeState.actionLabel}
              </Button>
            )}
          </Surface>
        </Pressable>
      </Animated.View>
    </View>
  );
};
