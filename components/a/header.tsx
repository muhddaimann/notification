import React from "react";
import { View } from "react-native";
import { Text, IconButton, Avatar, useTheme } from "react-native-paper";
import { useDesignSystem } from "../../contexts/DesignSystemContext";

export default function HomeHeader() {
  const theme = useTheme();
  const { design } = useDesignSystem();

  const dummyUser = {
    name: "Aiman Zulkifli",
    id: "EMP-10241",
  };

  return (
    <View
      style={{
        paddingHorizontal: design.spacing.lg,
        paddingBottom: design.spacing.md,
        backgroundColor: theme.colors.background,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          variant="labelMedium"
          style={{
            color: theme.colors.onBackground,
            opacity: 0.6,
            marginBottom: 2,
          }}
        >
          Welcome back
        </Text>

        <Text
          variant="titleLarge"
          style={{
            color: theme.colors.onBackground,
            fontFamily: "ComicNeue_700Bold",
          }}
        >
          {dummyUser.name}
        </Text>

        <Text
          variant="bodySmall"
          style={{
            color: theme.colors.onBackground,
            opacity: 0.5,
            marginTop: 2,
          }}
        >
          {dummyUser.id}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: design.spacing.xs,
        }}
      >
        <IconButton
          icon="bell-outline"
          size={22}
          onPress={() => {}}
          style={{ margin: 0 }}
        />

        <Avatar.Text
          size={40}
          label={dummyUser.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
          style={{
            backgroundColor: theme.colors.primary,
          }}
          labelStyle={{
            color: theme.colors.onPrimary,
            fontWeight: "700",
          }}
        />
      </View>
    </View>
  );
}
