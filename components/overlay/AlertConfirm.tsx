import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
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
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        padding: design.spacing.lg,
        zIndex: 9999,
      }}
    >
      <Pressable
        onPress={onDismiss}
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      />

      <Surface
        style={{
          width: "100%",
          maxWidth: 520,
          backgroundColor: theme.colors.surface,
          borderRadius: design.radii.xl,
          paddingHorizontal: design.spacing.xl,
          paddingVertical: design.spacing.xl,
        }}
      >
        {state.title && (
          <Text
            variant="titleLarge"
            style={{
              marginBottom: design.spacing.sm,
              color: theme.colors.onSurface,
              fontWeight: "700",
            }}
          >
            {state.title}
          </Text>
        )}

        <Text
          variant="bodyMedium"
          style={{
            color: theme.colors.onSurfaceVariant,
            marginBottom: design.spacing.xl,
            lineHeight: 22,
          }}
        >
          {state.message}
        </Text>

        <View
          style={{
            alignItems: "flex-end",
          }}
        >
          <Button
            mode="contained"
            onPress={onDismiss}
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}
            contentStyle={{ paddingVertical: 6 }}
          >
            OK
          </Button>
        </View>
      </Surface>
    </View>
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
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        padding: design.spacing.lg,
        zIndex: 9999,
      }}
    >
      <Pressable
        onPress={onCancel}
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      />

      <Surface
        style={{
          width: "100%",
          maxWidth: 520,
          backgroundColor: theme.colors.surface,
          borderRadius: design.radii.xl,
          paddingHorizontal: design.spacing.xl,
          paddingVertical: design.spacing.xl,
        }}
      >
        {state.title && (
          <Text
            variant="titleLarge"
            style={{
              marginBottom: design.spacing.sm,
              color: theme.colors.onSurface,
              fontWeight: "700",
            }}
          >
            {state.title}
          </Text>
        )}

        <Text
          variant="bodyMedium"
          style={{
            color: theme.colors.onSurfaceVariant,
            marginBottom: design.spacing.xl,
            lineHeight: 22,
          }}
        >
          {state.message}
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: design.spacing.sm,
          }}
        >
          <Button
            mode="text"
            onPress={onCancel}
            textColor={theme.colors.onSurface}
            contentStyle={{ paddingVertical: 6 }}
          >
            {state.cancelText || "Cancel"}
          </Button>

          <Button
            mode="contained"
            onPress={onOk}
            buttonColor={
              isDestructive ? theme.colors.error : theme.colors.primary
            }
            textColor={
              isDestructive ? theme.colors.onError : theme.colors.onPrimary
            }
            contentStyle={{ paddingVertical: 6 }}
          >
            {state.okText || "OK"}
          </Button>
        </View>
      </Surface>
    </View>
  );
};
