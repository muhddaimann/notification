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

export default function Home() {
  const theme = useTheme();
  const router = useRouter();
  const { design, isDarkMode, toggleTheme } = useDesignSystem();
  const { handleScroll, registerScrollRef } = useScroll();
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
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
        alwaysBounceVertical={false}
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
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
