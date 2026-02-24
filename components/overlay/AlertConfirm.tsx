import React from "react";
import { View, Pressable } from "react-native";
import { Button, Text, Surface } from "react-native-paper";
import { AlertOptions, ConfirmOptions } from "../../contexts/OverlayContext";
import { useDesignSystem } from "../../contexts/DesignSystemContext";

interface AlertUIProps {
  state: AlertOptions | null;
  onDismiss: () => void;
}

export const AlertUI: React.FC<AlertUIProps> = ({ state, onDismiss }) => {
  const { theme, design } = useDesignSystem();

  if (!state) return null;

  return (
    <Pressable style={{ width: "100%" }}>
      <Surface
        elevation={5}
        style={{
          backgroundColor: theme.colors.surface,
          paddingVertical: design.spacing.lg,
          paddingHorizontal: design.spacing.xl,
          borderRadius: design.radii.lg,
          minWidth: 280,
          maxWidth: 560,
          alignSelf: "center",
        }}
      >
        {state.title && (
          <Text
            variant="titleLarge"
            style={{ fontWeight: "600", marginBottom: design.spacing.md }}
          >
            {state.title}
          </Text>
        )}
        <View style={{ marginBottom: design.spacing.xl }}>
          <Text variant="bodyMedium">{state.message}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: design.spacing.sm,
          }}
        >
          <Button onPress={onDismiss}>OK</Button>
        </View>
      </Surface>
    </Pressable>
  );
};

interface ConfirmUIProps {
  state: ConfirmOptions | null;
  onOk: () => void;
  onCancel: () => void;
}

export const ConfirmUI: React.FC<ConfirmUIProps> = ({
  state,
  onOk,
  onCancel,
}) => {
  const { theme, design } = useDesignSystem();
  const isDestructive = state?.variant === "error";

  if (!state) return null;

  return (
    <Pressable style={{ width: "100%" }}>
      <Surface
        elevation={5}
        style={{
          backgroundColor: theme.colors.surface,
          paddingVertical: design.spacing.lg,
          paddingHorizontal: design.spacing.xl,
          borderRadius: design.radii.lg,
          minWidth: 280,
          maxWidth: 560,
          alignSelf: "center",
        }}
      >
        {state.title && (
          <Text
            variant="titleLarge"
            style={{ fontWeight: "600", marginBottom: design.spacing.md }}
          >
            {state.title}
          </Text>
        )}
        <View style={{ marginBottom: design.spacing.xl }}>
          <Text variant="bodyMedium">{state.message}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: design.spacing.sm,
          }}
        >
          <Button onPress={onCancel} textColor={theme.colors.onSurface}>
            {state.cancelText || "Cancel"}
          </Button>
          <Button
            onPress={onOk}
            mode="contained"
            buttonColor={
              isDestructive ? theme.colors.error : theme.colors.primary
            }
            textColor={
              isDestructive ? theme.colors.onError : theme.colors.onPrimary
            }
          >
            {state.okText || "OK"}
          </Button>
        </View>
      </Surface>
    </Pressable>
  );
};
