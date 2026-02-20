import React, { useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Button, useTheme, Card, Divider } from 'react-native-paper';
import { useRouter, useFocusEffect } from 'expo-router';
import { useDesignSystem } from '../../../contexts/DesignSystemContext';
import { useScroll } from '../../../contexts/ScrollContext';
import { useLoader } from '../../../contexts/LoaderContext';
import { useOverlay } from '../../../contexts/OverlayContext';
import Header from "../../../components/header";

export default function HomeMain() {
  const theme = useTheme();
  const { design } = useDesignSystem();
  const { setNavBarVisible } = useScroll();
  const { showLoader, hideLoader } = useLoader();
  const { alert, confirm, toast, modal, dismissModal } = useOverlay();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      setNavBarVisible(false);
      
      return () => {
        setNavBarVisible(true);
      };
    }, [setNavBarVisible])
  );

  const testLoader = (text?: string) => {
    showLoader(text);
    setTimeout(hideLoader, 2000);
  };

  const testCustomModal = () => {
    modal({
      content: (
        <View style={{ gap: 16 }}>
          <Text variant="headlineSmall" style={{ fontFamily: 'ComicNeue_700Bold' }}>Custom Modal Content</Text>
          <Text variant="bodyMedium">This is a custom React component rendered inside a modal using the OverlayContext.</Text>
          <Button mode="contained" onPress={dismissModal}>Close Modal</Button>
        </View>
      )
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="Home Main" subtitle="Context Demo" />
      <ScrollView 
        contentContainerStyle={{ padding: design.spacing.md, gap: design.spacing.md }}
      >
        <Card style={{ padding: design.spacing.md }}>
          <Text variant="titleMedium" style={{ marginBottom: design.spacing.sm }}>Loader Context</Text>
          <Text variant="bodyMedium" style={{ marginBottom: design.spacing.md }}>
            Full screen loader. Now supports optional loading text!
          </Text>
          <View style={{ gap: 8 }}>
            <Button mode="contained" onPress={() => testLoader()}>
              Default Loader
            </Button>
            <Button mode="outlined" onPress={() => testLoader("Uploading files...")}>
              With Custom Text
            </Button>
          </View>
        </Card>

        <Card style={{ padding: design.spacing.md }}>
          <Text variant="titleMedium" style={{ marginBottom: design.spacing.sm }}>Overlay Context: Dialogs</Text>
          <View style={{ gap: 8 }}>
            <Button mode="outlined" onPress={() => alert({ title: "Hello", message: "This is a simple alert dialog." })}>
              Show Alert
            </Button>
            <Button mode="outlined" onPress={async () => {
              const ok = await confirm({
                title: "Delete Item", 
                message: "Are you sure? This cannot be undone.", 
                okText: "Delete",
                variant: "error"
              });
              if (ok) toast({ message: "Item deleted", variant: "error" });
            }}>
              Show Confirm
            </Button>
          </View>
        </Card>

        <Card style={{ padding: design.spacing.md }}>
          <Text variant="titleMedium" style={{ marginBottom: design.spacing.sm }}>Overlay Context: Toasts</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Button compact mode="contained-tonal" onPress={() => toast("Information message")}>
              Info Toast
            </Button>
            <Button compact mode="contained-tonal" buttonColor="#4CAF50" textColor="white" onPress={() => toast({ message: "Action successful!", variant: "success" })}>
              Success Toast
            </Button>
            <Button compact mode="contained-tonal" buttonColor={theme.colors.error} textColor="white" onPress={() => toast({ message: "Something went wrong", variant: "error" })}>
              Error Toast
            </Button>
          </View>
        </Card>

        <Card style={{ padding: design.spacing.md }}>
          <Text variant="titleMedium" style={{ marginBottom: design.spacing.sm }}>Overlay Context: Custom Modal</Text>
          <Button mode="contained" onPress={testCustomModal}>Show Custom Modal</Button>
        </Card>

        <Divider style={{ marginVertical: design.spacing.sm }} />
      </ScrollView>
    </View>
  );
}
