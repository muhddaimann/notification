import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";
import { Platform } from "react-native";
import { registerForPushNotificationsAsync, sendTokenToBackend } from "./api/push";
import { useAuth } from "./AuthContext";
import { useToken } from "./TokenContext";
import { useOverlay } from "./OverlayContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type NotificationContextType = {
  expoPushToken: string | undefined;
  notification: Notifications.Notification | undefined;
  isPermissionGranted: boolean;
  register: (force?: boolean) => Promise<void>;
  openSettings: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  const { user } = useAuth();
  const { getAuth, getPushToken, savePushToken } = useToken();
  const { confirm, toast } = useOverlay();

  const openSettings = useCallback(() => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  }, []);

  const register = useCallback(async (force = false) => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      
      if (existingStatus === "denied" && force) {
        const ok = await confirm({
          title: "Permission Required",
          message: "Notifications are disabled. Please enable them in your device settings to stay updated.",
          okText: "Open Settings",
          cancelText: "Later"
        });
        if (ok) openSettings();
        return;
      }

      const savedToken = await getPushToken();
      const registration = await registerForPushNotificationsAsync();
      
      if (registration) {
        setIsPermissionGranted(true);
        setExpoPushToken(registration.token);
        
        if (force || savedToken !== registration.token) {
          const { token: authToken } = await getAuth();
          if (authToken) {
            await sendTokenToBackend(registration, authToken);
            await savePushToken(registration.token);
          }
        }
      } else {
        setIsPermissionGranted(false);
      }
    } catch (error) {
      console.error("Failed to register for push notifications", error);
    }
  }, [getAuth, getPushToken, savePushToken, confirm, openSettings]);

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response);
      }
    );

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (user) {
      register();
    }
  }, [user]);

  return (
    <NotificationContext.Provider value={{ expoPushToken, notification, isPermissionGranted, register, openSettings }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
