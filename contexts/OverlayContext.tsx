import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { View, StyleSheet, Animated, BackHandler } from "react-native";
import AlertConfirm from "../components/overlay/AlertConfirm";
import CustomModal from "../components/overlay/CustomModal";
import Toast from "../components/overlay/Toast";

type OverlayType = "alert" | "confirm" | "modal" | "none";

type OverlayConfig = {
  type: OverlayType;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  content?: React.ReactNode;
};

type ToastConfig = {
  message: string;
  type: "info" | "success" | "error";
  duration?: number;
};

type OverlayContextType = {
  showAlert: (title: string, message: string, onConfirm?: () => void) => void;
  showConfirm: (
    title: string, 
    message: string, 
    onConfirm: () => void, 
    onCancel?: () => void,
    confirmLabel?: string,
    cancelLabel?: string
  ) => void;
  showModal: (content: React.ReactNode) => void;
  showToast: (message: string, type?: "info" | "success" | "error", duration?: number) => void;
  hideOverlay: () => void;
};

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export const OverlayProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<OverlayConfig>({ type: "none" });
  const [toast, setToast] = useState<ToastConfig | null>(null);
  
  // Track visibility for components to handle their own exit animations
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isModalVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
        hideOverlay();
        return true;
      });
      return () => backHandler.remove();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isModalVisible]);

  const showAlert = useCallback((title: string, message: string, onConfirm?: () => void) => {
    setConfig({ type: "alert", title, message, onConfirm });
    setIsDialogVisible(true);
  }, []);

  const showConfirm = useCallback((
    title: string, 
    message: string, 
    onConfirm: () => void, 
    onCancel?: () => void,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel"
  ) => {
    setConfig({ type: "confirm", title, message, onConfirm, onCancel, confirmLabel, cancelLabel });
    setIsDialogVisible(true);
  }, []);

  const showModal = useCallback((content: React.ReactNode) => {
    setConfig({ type: "modal", content });
    setIsModalVisible(true);
  }, []);

  const showToast = useCallback((message: string, type: "info" | "success" | "error" = "info", duration = 3000) => {
    setToast({ message, type, duration });
  }, []);

  const hideOverlay = useCallback(() => {
    setIsDialogVisible(false);
    setIsModalVisible(false);
    
    // We don't reset the config immediately to allow exit animations to finish
    // with the existing data (title, message, etc.)
    setTimeout(() => {
      setConfig(prev => {
        // Only clear if no new overlay was shown during the timeout
        if (!isDialogVisible && !isModalVisible) {
          return { type: "none" };
        }
        return prev;
      });
    }, 300); // Wait for exit animations
  }, [isDialogVisible, isModalVisible]);

  const handleConfirm = () => {
    if (config.onConfirm) config.onConfirm();
    hideOverlay();
  };

  const handleCancel = () => {
    if (config.onCancel) config.onCancel();
    hideOverlay();
  };

  return (
    <OverlayContext.Provider value={{ showAlert, showConfirm, showModal, showToast, hideOverlay }}>
      <View style={{ flex: 1 }}>
        {children}
        
        <AlertConfirm 
          visible={isDialogVisible}
          type={config.type as any}
          title={config.title}
          message={config.message}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          confirmLabel={config.confirmLabel}
          cancelLabel={config.cancelLabel}
        />

        {config.content && (
          <Animated.View 
            pointerEvents={isModalVisible ? 'auto' : 'none'}
            style={{
              ...StyleSheet.absoluteFillObject,
              opacity: fadeAnim,
              zIndex: 9999,
            }}
          >
            <CustomModal 
              content={config.content}
              onDismiss={hideOverlay}
            />
          </Animated.View>
        )}

        <Toast 
          visible={toast !== null}
          message={toast?.message || ""}
          type={toast?.type || "info"}
          duration={toast?.duration}
          onDismiss={() => setToast(null)}
        />
      </View>
    </OverlayContext.Provider>
  );
};

export const useOverlay = () => {
  const context = useContext(OverlayContext);
  if (context === undefined) {
    throw new Error("useOverlay must be used within an OverlayProvider");
  }
  return context;
};
