import React, { useEffect, useRef } from "react";
import { TouchableOpacity, Animated } from "react-native";
import { Surface, Text, IconButton, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useDesignSystem } from "../contexts/DesignSystemContext";
import { useScroll } from "../contexts/ScrollContext";
import { useLoader } from "../contexts/LoaderContext";
import { useOverlay } from "../contexts/OverlayContext";

export default function NavBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { design } = useDesignSystem();
  const { isNavBarVisible } = useScroll();
  const { showLoader, hideLoader } = useLoader();
  const { confirm, toast } = useOverlay();

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: isNavBarVisible ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: isNavBarVisible ? 0 : 120,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isNavBarVisible]);

  const currentRouteName = state.routes[state.index].name;

  const handleActionButton = async () => {
    if (currentRouteName === "a") {
      showLoader();
      setTimeout(() => {
        hideLoader();
        toast({ message: "Successfully added!", variant: "success" });
        console.log("Plus pressed");
      }, 1500);
    } else {
      const ok = await confirm({
        title: "Sign Out",
        message: "Are you sure you want to sign out?",
      });

      if (ok) {
        showLoader();
        setTimeout(() => {
          hideLoader();
          toast("Signed out successfully");
          console.log("Sign out confirmed");
        }, 1500);
      }
    }
  };

  return (
    <Animated.View
      pointerEvents={isNavBarVisible ? "auto" : "none"}
      style={{
        position: "absolute",
        bottom:
          (insets.bottom > 0 ? insets.bottom : design.spacing.md) +
          design.spacing.md,
        left: design.spacing["2xl"],
        right: design.spacing["2xl"],
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: design.spacing.lg,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <Surface
        elevation={4}
        style={{
          flexDirection: "row",
          backgroundColor: theme.colors.surface,
          borderRadius: design.radii.pill,
          height: 64,
          flex: 1,
          alignItems: "center",
          paddingHorizontal: design.spacing.xs,
          borderWidth: 1,
          borderColor: theme.colors.outlineVariant,
        }}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const iconName = route.name === "a" ? "home-variant" : "cog";
          const label = route.name === "a" ? "Home" : "Settings";

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <IconButton
                icon={iconName}
                iconColor={
                  isFocused
                    ? theme.colors.primary
                    : theme.colors.onSurfaceVariant
                }
                size={isFocused ? 26 : 22}
                style={{ margin: 0, height: 32 }}
              />
              <Text
                variant="labelSmall"
                style={{
                  color: isFocused
                    ? theme.colors.primary
                    : theme.colors.onSurfaceVariant,
                  fontFamily: isFocused
                    ? "ComicNeue_700Bold"
                    : "ComicNeue_400Regular",
                  marginTop: -4,
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Surface>

      {/* Action Pill */}
      <TouchableOpacity onPress={handleActionButton} activeOpacity={0.8}>
        <Surface
          elevation={4}
          style={{
            backgroundColor:
              currentRouteName === "a"
                ? theme.colors.primary
                : theme.colors.error,
            borderRadius: design.radii.pill,
            height: 64,
            width: 64,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor:
              currentRouteName === "a"
                ? theme.colors.primary
                : theme.colors.error,
          }}
        >
          <IconButton
            icon={currentRouteName === "a" ? "plus" : "logout"}
            iconColor={
              currentRouteName === "a"
                ? theme.colors.onPrimary
                : theme.colors.onError
            }
            size={28}
            style={{ margin: 0 }}
          />
        </Surface>
      </TouchableOpacity>
    </Animated.View>
  );
}
