import React, { useState, useRef, useEffect } from "react";
import { ScrollView, View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Chip,
  Divider,
  FAB,
  IconButton,
  RadioButton,
  Searchbar,
  SegmentedButtons,
  Snackbar,
  Switch,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useDesignSystem } from "../../../contexts/DesignSystemContext";
import { useScroll } from "../../../contexts/ScrollContext";
import ScrollTop from "../../../components/scrollTop";
import { useRouter } from "expo-router";

import { useOverlay } from "../../../contexts/OverlayContext";

export default function Home() {
  const theme = useTheme();
  const router = useRouter();
  const { design, isDarkMode, toggleTheme } = useDesignSystem();
  const { handleScroll, registerScrollRef } = useScroll();
  const { alert, confirm, destructiveConfirm, toast, modal } = useOverlay();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    registerScrollRef("a", scrollRef.current);
  }, [registerScrollRef]);

  const [searchQuery, setSearchQuery] = useState("");
  const [checked, setChecked] = useState(false);
  const [radioValue, setRadioValue] = useState("first");
  const [switchOn, setSwitchOn] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [segmentedValue, setSegmentedValue] = useState("walk");

  const onToggleSnackBar = () => setSnackbarVisible(!snackbarVisible);
  const onDismissSnackBar = () => setSnackbarVisible(false);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
        alwaysBounceVertical={false}
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          paddingTop: design.spacing.md,
          paddingBottom: design.spacing["3xl"] * 2,
        }}
      >
        <View
          style={{
            gap: design.spacing.xs,
            paddingHorizontal: design.spacing.md,
            paddingBottom: design.spacing.md
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text variant="headlineMedium" style={{ flex: 1 }}>
              Paper Components
            </Text>
            <IconButton
              icon={isDarkMode ? "weather-sunny" : "weather-night"}
              onPress={toggleTheme}
            />
          </View>
          <Text variant="bodyLarge" style={{ opacity: 0.7 }}>
            A showcase of react-native-paper with design tokens
          </Text>
          <Button 
            mode="contained-tonal" 
            onPress={() => router.push("/(tabs)/a/main")}
            style={{ marginTop: design.spacing.sm }}
          >
            Go to Home Main
          </Button>
        </View>

        <Divider />

        <View style={{ gap: 10, padding: design.spacing.md }}>
          <Text
            variant="titleLarge"
            style={{ fontWeight: "bold", marginBottom: design.spacing.sm }}
          >
            Overlay Module
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: design.spacing.sm,
            }}
          >
            <Button
              mode="contained"
              onPress={() =>
                alert({
                  title: "Alert",
                  message: "This is a simple alert message.",
                })
              }
            >
              Alert
            </Button>
            <Button
              mode="contained"
              onPress={async () => {
                const ok = await confirm({
                  title: "Confirm",
                  message: "Are you sure you want to proceed?",
                });
                toast(ok ? "Confirmed!" : "Cancelled");
              }}
            >
              Confirm
            </Button>
            <Button
              mode="contained"
              buttonColor={theme.colors.error}
              textColor={theme.colors.onError}
              onPress={async () => {
                const ok = await destructiveConfirm({
                  title: "Delete Item",
                  message: "This action cannot be undone.",
                });
                if (ok) toast({ message: "Item deleted", variant: "error" });
              }}
            >
              Destructive
            </Button>
            <Button
              mode="contained"
              onPress={() => toast({ message: "Success!", variant: "success" })}
            >
              Toast Success
            </Button>
            <Button
              mode="contained"
              onPress={() =>
                modal({
                  content: (
                    <View style={{ alignItems: "center", gap: 10 }}>
                      <Avatar.Icon size={64} icon="information" />
                      <Text variant="titleMedium">Custom Modal Content</Text>
                      <Text variant="bodySmall" style={{ textAlign: "center" }}>
                        You can put any React components inside the modal.
                      </Text>
                      <Button
                        mode="outlined"
                        onPress={() => toast("Modal Button Clicked")}
                      >
                        Action inside Modal
                      </Button>
                    </View>
                  ),
                })
              }
            >
              Custom Modal
            </Button>
          </View>
        </View>

        <Divider />

        <View style={{ gap: 10, padding: design.spacing.md }}>
          <Text
            variant="titleLarge"
            style={{ fontWeight: "bold", marginBottom: design.spacing.sm }}
          >
            Design Tokens
          </Text>
          <Text variant="bodyMedium">Spacing (md): {design.spacing.md}</Text>
          <Text variant="bodyMedium">Radii (lg): {design.radii.lg}</Text>
          <Text variant="bodyMedium">
            Typography size (lg): {design.typography.sizes.lg}
          </Text>
        </View>

        <Divider />

        <View style={{ gap: 10, padding: design.spacing.md }}>
          <Text
            variant="titleLarge"
            style={{ fontWeight: "bold", marginBottom: design.spacing.sm }}
          >
            Buttons
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              gap: design.spacing.sm,
            }}
          >
            <Button mode="contained">Contained</Button>
            <Button mode="outlined">Outlined</Button>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              gap: design.spacing.sm,
              marginTop: design.spacing.xs,
            }}
          >
            <Button mode="text">Text</Button>
            <Button mode="elevated">Elevated</Button>
            <Button mode="contained-tonal">Tonal</Button>
          </View>
        </View>

        <Divider />

        <View style={{ gap: 10, padding: design.spacing.md }}>
          <Text
            variant="titleLarge"
            style={{ fontWeight: "bold", marginBottom: design.spacing.sm }}
          >
            Inputs
          </Text>
          <TextInput
            label="Outlined Input"
            value={searchQuery}
            onChangeText={setSearchQuery}
            mode="outlined"
            style={{ marginBottom: design.spacing.sm }}
          />
          <TextInput
            label="Flat Input"
            value={searchQuery}
            onChangeText={setSearchQuery}
            mode="flat"
            style={{ marginBottom: design.spacing.sm }}
          />
          <Searchbar
            placeholder="Search"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={{ marginBottom: design.spacing.sm }}
          />
        </View>

        <Divider />

        <View style={{ gap: 10, padding: design.spacing.md }}>
          <Text
            variant="titleLarge"
            style={{ fontWeight: "bold", marginBottom: design.spacing.sm }}
          >
            Cards
          </Text>
          <Card style={{ borderRadius: design.radii.lg }}>
            <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
            <Card.Title
              title="Card Title"
              subtitle="Card Subtitle"
              left={(props) => <Avatar.Icon {...props} icon="folder" />}
            />
            <Card.Content>
              <Text
                variant="bodyMedium"
                style={{ fontFamily: "ComicNeue_400Regular" }}
              >
                Card content with custom font Comic Neue.
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button>Cancel</Button>
              <Button>Ok</Button>
            </Card.Actions>
          </Card>
        </View>

        <Divider />

        <View style={{ gap: 10, padding: design.spacing.md }}>
          <Text
            variant="titleLarge"
            style={{ fontWeight: "bold", marginBottom: design.spacing.sm }}
          >
            Selection Controls
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text variant="bodyLarge">Checkbox</Text>
            <Checkbox
              status={checked ? "checked" : "unchecked"}
              onPress={() => setChecked(!checked)}
            />
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text variant="bodyLarge">Switch</Text>
            <Switch value={switchOn} onValueChange={setSwitchOn} />
          </View>

          <RadioButton.Group onValueChange={setRadioValue} value={radioValue}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Text>First</Text>
              <RadioButton value="first" />
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Text>Second</Text>
              <RadioButton value="second" />
            </View>
          </RadioButton.Group>

          <SegmentedButtons
            value={segmentedValue}
            onValueChange={setSegmentedValue}
            buttons={[
              { value: "walk", label: "Walking" },
              { value: "train", label: "Transit" },
              { value: "drive", label: "Driving" },
            ]}
            style={{ marginTop: design.spacing.sm }}
          />
        </View>

        <Divider />

        <View style={{ gap: 10, padding: design.spacing.md }}>
          <Text
            variant="titleLarge"
            style={{ fontWeight: "bold", marginBottom: design.spacing.sm }}
          >
            Chips & FAB
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              gap: design.spacing.sm,
            }}
          >
            <Chip icon="information">Info</Chip>
            <Chip icon="heart" mode="outlined">
              Like
            </Chip>
          </View>

          <View style={{ alignItems: "center", marginVertical: 20 }}>
            <FAB icon="plus" onPress={onToggleSnackBar} label="Show Snackbar" />
          </View>
        </View>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={onDismissSnackBar}
          action={{
            label: "Undo",
            onPress: () => {},
          }}
        >
          Hey there! I'm a Snackbar.
        </Snackbar>
      </ScrollView>

      <ScrollTop tabName="a" />
    </View>
  );
}
