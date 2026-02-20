import React from "react";
import { View, Pressable } from "react-native";
import { Surface } from "react-native-paper";
import { ModalOptions } from "../../contexts/OverlayContext";
import { useDesignSystem } from "../../contexts/DesignSystemContext";

interface ModalUIProps {
  state: ModalOptions | null;
  onDismiss: () => void;
}

export const ModalUI: React.FC<ModalUIProps> = ({ state, onDismiss }) => {
  const { theme, design } = useDesignSystem();

  if (!state) return null;

  return (
    <Pressable style={{ width: "100%" }}>
      <Surface
        elevation={5}
        style={{ 
          backgroundColor: theme.colors.elevatedSurface || theme.colors.surface,
          padding: design.spacing.xl,
          borderRadius: design.radii.lg,
          minWidth: 280,
          maxWidth: 560,
          alignSelf: "center",
        }}
      >
        <View style={{ width: "100%" }}>{state.content}</View>
      </Surface>
    </Pressable>
  );
};
