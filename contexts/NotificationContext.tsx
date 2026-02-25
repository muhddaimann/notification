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
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type NotificationContextType = {
  expoPushToken: string | undefined;
  notification: Notifications.Notification | undefined;
  register: (force?: boolean) => Promise<void>;
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
  const { getAuth, getPushToken, savePushToken } = useToken();
  const { toast } = useOverlay();

  const register = useCallback(async (force = false) => {
    try {
      // 1. Get current token from SecureStore
      const savedToken = await getPushToken();
      
      // 2. Register with Expo
      const newToken = await registerForPushNotificationsAsync();
      
      if (newToken) {
        setExpoPushToken(newToken);
        
        // 3. Only send to backend if it's new, changed, or forced
        if (force || savedToken !== newToken) {
          const { token: authToken } = await getAuth();
          if (authToken) {
            await sendTokenToBackend(newToken, authToken);
            await savePushToken(newToken);
            console.log("Push token updated on backend.");
          }
        } else {
          console.log("Push token is already up to date.");
        }
      }
    } catch (error) {
      console.error("Failed to register for push notifications", error);
    }
  }, [getAuth, getPushToken, savePushToken]);

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

  // Automate registration when user logs in or app launches with user
  useEffect(() => {
    if (user) {
      register();
    }
  }, [user]);

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
