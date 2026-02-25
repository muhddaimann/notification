import React, { useRef, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { useTheme } from "react-native-paper";
import { useDesignSystem } from "../../../contexts/DesignSystemContext";
import { useScroll } from "../../../contexts/ScrollContext";
import ScrollTop from "../../../components/scrollTop";
import HomeHeader from "../../../components/a/header";
import { Button, Card, Text, TextInput, SegmentedButtons } from "react-native-paper";
import { useAuth } from "../../../contexts/AuthContext";
import { useToken } from "../../../contexts/TokenContext";
import { useNotifications } from "../../../contexts/NotificationContext";
import { useOverlay } from "../../../contexts/OverlayContext";
import { sendPushNotification } from "../../../contexts/api/push";
import { useState } from "react";

export default function Home() {
  const theme = useTheme();
  const { design } = useDesignSystem();
  const { handleScroll, registerScrollRef } = useScroll();
  const { user } = useAuth();
  const { getAuth } = useToken();
  const { expoPushToken } = useNotifications();
  const { toast } = useOverlay();
  const scrollRef = useRef<ScrollView>(null);

  const [pushTitle, setPushTitle] = useState("Push Test");
  const [pushBody, setPushBody] = useState("Your push notification system is working!");
  const [targetType, setTargetType] = useState<"self" | "all">("self");

  useEffect(() => {
    registerScrollRef("a", scrollRef.current);
  }, [registerScrollRef]);

  const handleSendPush = async () => {
    if (!user) return;
    if (!expoPushToken) {
      toast({ message: "Register for push first in Settings", variant: "warning" });
      return;
    }

    if (!pushTitle || !pushBody) {
      toast({ message: "Please enter title and message", variant: "error" });
      return;
    }

    try {
      const { token } = await getAuth();
      if (!token) return;

      toast("Sending notification...");
      
      const apiTargetType = targetType === "self" ? "specific_staff" : "all";
      const targetData = targetType === "self" 
        ? { target_staff_ids: [Number(user.id)] } 
        : {};

      await sendPushNotification(
        apiTargetType,
        targetData,
        pushTitle,
        pushBody,
        token,
        { screen: "a" }
      );
      toast({ message: "Notification sent!", variant: "success" });
    } catch (error) {
      toast({ message: "Failed to send notification", variant: "error" });
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "flex-start",
      }}
    >
      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
        alwaysBounceVertical={false}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: design.spacing["3xl"] * 2,
        }}
      >
        <HomeHeader />

        <View style={{ padding: design.spacing.lg, gap: design.spacing.md }}>
          <Card style={{ borderRadius: design.radii.lg, padding: design.spacing.md }}>
            <Card.Title title="Notification Test" subtitle="Push Targeting Feature" />
            <Card.Content style={{ marginBottom: design.spacing.md, gap: design.spacing.sm }}>
              <Text variant="bodyMedium" style={{ marginBottom: design.spacing.xs }}>
                Select your target and customize the notification payload.
              </Text>
              
              <SegmentedButtons
                value={targetType}
                onValueChange={setTargetType as any}
                buttons={[
                  { value: "self", label: "To Myself", icon: "account" },
                  { value: "all", label: "To All", icon: "account-group" },
                ]}
                style={{ marginBottom: design.spacing.sm }}
              />
              
              <TextInput
                label="Title"
                value={pushTitle}
                onChangeText={setPushTitle}
                mode="outlined"
                dense
              />
              
              <TextInput
                label="Message"
                value={pushBody}
                onChangeText={setPushBody}
                mode="outlined"
                multiline
                numberOfLines={2}
                dense
              />
            </Card.Content>
            <Card.Actions>
              <Button 
                mode="contained" 
                onPress={handleSendPush}
                icon="bell-ring"
                buttonColor={targetType === 'all' ? theme.colors.error : theme.colors.primary}
              >
                Send {targetType === 'self' ? 'to Self' : 'to All Devices'}
              </Button>
            </Card.Actions>
          </Card>
        </View>
      </ScrollView>

      <ScrollTop tabName="a" />
    </View>
  );
}
