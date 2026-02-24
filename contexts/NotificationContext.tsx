import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync, sendTokenToBackend } from "./api/push";
import { useAuth } from "./AuthContext";
import { useToken } from "./TokenContext";
import { useOverlay } from "./OverlayContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type NotificationContextType = {
  expoPushToken: string | undefined;
  notification: Notifications.Notification | undefined;
  register: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  const { user } = useAuth();
  const { getAuth } = useToken();
  const { confirm, toast } = useOverlay();

  const register = useCallback(async () => {
    try {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setExpoPushToken(token);
        const { token: authToken } = await getAuth();
        if (authToken) {
          await sendTokenToBackend(token, authToken);
        }
      }
    } catch (error) {
      console.error("Failed to register for push notifications", error);
    }
  }, [getAuth]);

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

  // Automate registration when user logs in
  useEffect(() => {
    if (user && !expoPushToken) {
      // We could automatically register or wait for user to click something
      // For now let's just expose the register function
    }
  }, [user, expoPushToken]);

  return (
    <NotificationContext.Provider value={{ expoPushToken, notification, register }}>
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
