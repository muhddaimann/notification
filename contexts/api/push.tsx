import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import api from "./api";

/**
 * This function handles getting the user's permission and retrieving the Expo Push Token.
 * It also configures the notification channel for Android.
 * @returns The Expo Push Token string, or undefined if permission is denied or on a simulator.
 */
export async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("User denied push notification permissions.");
      // You might want to show an alert to the user here.
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);
  } else {
    console.log(
      "Push Notifications are not available on simulators. Must use a physical device.",
    );
  }

  return token;
}

/**
 * This function sends the retrieved Expo token to your backend server.
 * @param expoPushToken The token received from registerForPushNotificationsAsync.
 * @param authToken The JWT token for authenticating the user.
 */
export async function sendTokenToBackend(
  expoPushToken: string,
  authToken: string,
): Promise<void> {
  try {
    await api.post(
      "/push.php",
      { expo_token: expoPushToken },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    console.log("Expo Push Token sent to backend successfully.");
  } catch (error) {
    console.error("Failed to send Expo Push Token to backend:", error);
    // Optionally, re-throw the error if the caller needs to handle it.
    throw error;
  }
}

/**
 * This function triggers a push notification to specific staff members.
 * @param targetStaffIds Array of staff IDs to receive the notification.
 * @param title The title of the notification.
 * @param message The body text of the notification.
 * @param authToken The JWT token for authentication.
 * @param extraData Optional object containing additional data for the notification.
 */
export async function sendPushNotification(
  targetStaffIds: number[],
  title: string,
  message: string,
  authToken: string,
  extraData: object = {},
): Promise<any> {
  try {
    const response = await api.post(
      "/push.php",
      {
        action: "send",
        target_staff_ids: targetStaffIds,
        title: title,
        message: message,
        extra_data: extraData,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    console.log("Push notification request sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to trigger push notification:", error);
    throw error;
  }
}
