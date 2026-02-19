import React, { useCallback } from "react";
import { View, ScrollView } from "react-native";
import { Text, Button, useTheme, Card } from "react-native-paper";
import { useFocusEffect } from "expo-router";
import { useDesignSystem } from "../../../contexts/DesignSystemContext";
import { useScroll } from "../../../contexts/ScrollContext";
import { useLoader } from "../../../contexts/LoaderContext";
import { useOverlay } from "../../../contexts/OverlayContext";
import Header from "../../../components/header";

export default function HomeMain() {
  const theme = useTheme();
  const { design } = useDesignSystem();
  const { setNavBarVisible } = useScroll();
  const { showLoader, hideLoader } = useLoader();
  const { showAlert, showConfirm, showToast, showModal, hideOverlay } =
    useOverlay();
  useFocusEffect(
    useCallback(() => {
      setNavBarVisible(false);

      return () => {
        setNavBarVisible(true);
      };
    }, [setNavBarVisible]),
  );

  const testLoader = () => {
    showLoader();
    setTimeout(hideLoader, 2000);
  };

  const testCustomModal = () => {
    showModal(
      <View style={{ gap: 16 }}>
        <Text
          variant="headlineSmall"
          style={{ fontFamily: "ComicNeue_700Bold" }}
        >
          Custom Modal Content
        </Text>
        <Text variant="bodyMedium">
          This is a custom React component rendered inside a modal using the
          OverlayContext.
        </Text>
        <Button mode="contained" onPress={hideOverlay}>
          Close Modal
        </Button>
      </View>,
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="Home Main" subtitle="Context Demo" />
      <ScrollView
        contentContainerStyle={{
          padding: design.spacing.md,
          gap: design.spacing.md,
        }}
      >
        <Card style={{ padding: design.spacing.md }}>
          <Text
            variant="titleMedium"
            style={{ marginBottom: design.spacing.sm }}
          >
            Loader Context
          </Text>
          <Text
            variant="bodyMedium"
            style={{ marginBottom: design.spacing.md }}
          >
            Full screen loader with a semi-transparent background.
          </Text>
          <Button mode="contained" onPress={testLoader}>
            Trigger 2s Loader
          </Button>
        </Card>

        <Card style={{ padding: design.spacing.md }}>
          <Text
            variant="titleMedium"
            style={{ marginBottom: design.spacing.sm }}
          >
            Overlay Context: Dialogs
          </Text>
          <View style={{ gap: 8 }}>
            <Button
              mode="outlined"
              onPress={() =>
                showAlert("Hello", "This is a simple alert dialog.")
              }
            >
              Show Alert
            </Button>
            <Button
              mode="outlined"
              onPress={() =>
                showConfirm(
                  "Delete Item",
                  "Are you sure? This cannot be undone.",
                  () => showToast("Item deleted", "error"),
                )
              }
            >
              Show Confirm
            </Button>
          </View>
        </Card>

        <Card style={{ padding: design.spacing.md }}>
          <Text
            variant="titleMedium"
            style={{ marginBottom: design.spacing.sm }}
          >
            Overlay Context: Toasts
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            <Button
              compact
              mode="contained-tonal"
              onPress={() => showToast("Information message")}
            >
              Info Toast
            </Button>
            <Button
              compact
              mode="contained-tonal"
              buttonColor="#4CAF50"
              textColor="white"
              onPress={() => showToast("Action successful!", "success")}
            >
              Success Toast
            </Button>
            <Button
              compact
              mode="contained-tonal"
              buttonColor={theme.colors.error}
              textColor="white"
              onPress={() => showToast("Something went wrong", "error")}
            >
              Error Toast
            </Button>
          </View>
        </Card>

        <Card style={{ padding: design.spacing.md }}>
          <Text
            variant="titleMedium"
            style={{ marginBottom: design.spacing.sm }}
          >
            Overlay Context: Custom Modal
          </Text>
          <Button mode="contained" onPress={testCustomModal}>
            Show Custom Modal
          </Button>
        </Card>
      </ScrollView>
    </View>
  );
}
