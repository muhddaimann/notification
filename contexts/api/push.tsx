import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import api from "./api";

/**
 * Result type for push registration
 */
export interface PushRegistrationResult {
  token: string;
  os: string;
  deviceName: string | null;
}

/**
 * This function handles getting the user's permission and retrieving the Expo Push Token.
 * Now collects device metadata (OS and Model Name).
 */
export async function registerForPushNotificationsAsync(): Promise<
  PushRegistrationResult | undefined
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
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.log("Push Notifications are not available on simulators.");
    return;
  }

  return {
    token: token,
    os: Platform.OS,
    deviceName: Device.modelName,
  };
}

/**
 * This function sends the retrieved Expo token and device metadata to your backend server.
 */
export async function sendTokenToBackend(
  registration: PushRegistrationResult,
  authToken: string,
): Promise<void> {
  try {
    await api.post(
      "/push.php",
      {
        action: "register",
        expo_token: registration.token,
        device_os: registration.os,
        device_name: registration.deviceName,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    console.log("Push registration successful.");
  } catch (error) {
    console.error("Failed to send push metadata to backend:", error);
    throw error;
  }
}

/**
 * This function triggers a push notification with support for advanced targeting.
 * @param targetType 'all', 'specific_staff', or 'specific_device'
 * @param targetData Object containing target_staff_ids or target_tokens
 * @param title Notification title
 * @param message Notification body
 * @param authToken JWT token
 * @param extraData Optional payload
 */
export async function sendPushNotification(
  targetType: "all" | "specific_staff" | "specific_device",
  targetData: { target_staff_ids?: number[]; target_tokens?: string[] },
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
        target_type: targetType,
        ...targetData,
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
    return response.data;
  } catch (error) {
    console.error("Failed to trigger push notification:", error);
    throw error;
  }
}
