import React, { useState, useEffect, useRef } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { useDesignSystem } from "../contexts/DesignSystemContext";
import { useOverlay } from "../contexts/OverlayContext";
import { useLoader } from "../contexts/LoaderContext";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);

  const { signIn, user, isLoading } = useAuth();
  const { theme, design } = useDesignSystem();
  const { toast } = useOverlay();
  const { showLoader, hideLoader } = useLoader();
  const router = useRouter();

  const splashFade = useRef(new Animated.Value(1)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentTranslate = useRef(new Animated.Value(40)).current;
  const [isSplashDone, setIsSplashDone] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace("/welcome");
      } else {
        Animated.parallel([
          Animated.timing(splashFade, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(contentFade, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(contentTranslate, {
            toValue: 0,
            duration: 800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start(() => {
          setIsSplashDone(true);
        });
      }
    }
  }, [isLoading, user]);

  const handleLogin = async () => {
    if (!username || !password) {
      toast({ message: "Username and Password required", variant: "error" });
      return;
    }

    showLoader("Authenticating...");

    setTimeout(async () => {
      const result = await signIn(username, password);
      hideLoader();

      if (result.success) {
        toast({ message: "Successfully logged in", variant: "success" });
        router.replace("/welcome");
      } else {
        toast({
          message: result.message || "Invalid credentials",
          variant: "error",
        });
      }
    }, 1200);
  };

  if (isLoading && !isSplashDone) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 20, opacity: 0.6 }}>
          Initializing HRMS...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      {!isSplashDone && (
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.background,
            opacity: splashFade,
            zIndex: 10,
          }}
        >
          <Text variant="headlineLarge" style={{ fontWeight: "700" }}>
            Faith HRMS
          </Text>
        </Animated.View>
      )}

      <Animated.View
        style={{
          flex: 1,
          justifyContent: "center",
          padding: design.spacing.xl,
          opacity: contentFade,
          transform: [{ translateY: contentTranslate }],
        }}
      >
        <View style={{ marginBottom: 40 }}>
          <Text
            variant="displaySmall"
            style={{ fontWeight: "800", marginBottom: 4 }}
          >
            Welcome Back
          </Text>
          <Text variant="bodyLarge" style={{ opacity: 0.6 }}>
            Login to access your workspace
          </Text>
        </View>

        <View style={{ width: "100%", gap: design.spacing.md }}>
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            autoCapitalize="none"
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secure}
            mode="outlined"
            autoCapitalize="none"
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={secure ? "eye-off" : "eye"}
                onPress={() => setSecure(!secure)}
              />
            }
            onSubmitEditing={handleLogin}
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            style={{
              marginTop: design.spacing.sm,
              borderRadius: design.radii.lg,
            }}
            contentStyle={{ height: 50 }}
            labelStyle={{ fontSize: 16, fontWeight: "700" }}
          >
            SIGN IN
          </Button>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
