import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, Pressable } from "react-native";
import { ToastUI } from "../components/overlay/Toast";

export type Variant = "neutral" | "info" | "success" | "warning" | "error";

export type AlertOptions = {
  title?: string;
  message?: string;
  variant?: Variant;
};

export type ConfirmOptions = {
  title?: string;
  message?: string;
  okText?: string;
  cancelText?: string;
  variant?: Variant;
};

export type ToastOptions = {
  message: string;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
  variant?: Variant;
};

export type ModalOptions = {
  content: React.ReactNode;
  dismissible?: boolean;
};

export type OverlayContextValue = {
  alert: (opts: AlertOptions) => void;
  dismissAlert: () => void;

  confirm: (opts: ConfirmOptions) => Promise<boolean>;
  destructiveConfirm: (opts: ConfirmOptions) => Promise<boolean>;
  dismissConfirm: () => void;

  toast: (opts: ToastOptions | string) => void;

  modal: (opts: ModalOptions) => void;
  dismissModal: () => void;
};

export const OverlayContext = createContext<OverlayContextValue | null>(null);

export function OverlayProvider({
  children,
  AlertUI,
  ConfirmUI,
  ToastUI: _ToastUI,
  ModalUI,
}: {
  children: React.ReactNode;
  AlertUI: React.FC<{
    state: AlertOptions | null;
    onDismiss: () => void;
  }>;
  ConfirmUI: React.FC<{
    state: ConfirmOptions | null;
    onOk: () => void;
    onCancel: () => void;
  }>;
  ToastUI: React.FC<{
    visible: boolean;
    state: ToastOptions;
  }>;
  ModalUI: React.FC<{
    state: ModalOptions | null;
    onDismiss: () => void;
  }>;
}) {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertState, setAlertState] = useState<AlertOptions | null>(null);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmState, setConfirmState] = useState<ConfirmOptions | null>(null);
  const confirmResolver = useRef<((v: boolean) => void) | null>(null);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastState, setToastState] = useState<ToastOptions>({
    message: "",
  });
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalState, setModalState] = useState<ModalOptions | null>(null);

  const alert = useCallback((opts: AlertOptions) => {
    setAlertState({
      title: opts.title ?? "Notice",
      message: opts.message ?? "",
      variant: opts.variant,
    });
    setAlertVisible(true);
  }, []);

  const dismissAlert = useCallback(() => {
    setAlertVisible(false);
    setAlertState(null);
  }, []);

  const confirm = useCallback((opts: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      confirmResolver.current = resolve;
      setConfirmState({
        title: opts.title ?? "Are you sure?",
        message: opts.message ?? "",
        okText: opts.okText ?? "OK",
        cancelText: opts.cancelText ?? "Cancel",
        variant: opts.variant ?? "neutral",
      });
      setConfirmVisible(true);
    });
  }, []);

  const destructiveConfirm = useCallback(
    (opts: ConfirmOptions) =>
      confirm({
        ...opts,
        variant: opts.variant ?? "error",
        okText: opts.okText ?? "Delete",
      }),
    [confirm]
  );

  const dismissConfirm = useCallback(() => {
    setConfirmVisible(false);
    setConfirmState(null);
  }, []);

  const onConfirmOk = useCallback(() => {
    setConfirmVisible(false);
    const resolve = confirmResolver.current;
    confirmResolver.current = null;
    setConfirmState(null);
    resolve?.(true);
  }, []);

  const onConfirmCancel = useCallback(() => {
    setConfirmVisible(false);
    const resolve = confirmResolver.current;
    confirmResolver.current = null;
    setConfirmState(null);
    resolve?.(false);
  }, []);

  const toast = useCallback((opts: ToastOptions | string) => {
    const next = typeof opts === "string" ? { message: opts } : opts;
    
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    setToastState({
      message: next.message,
      duration: next.duration ?? 2500,
      actionLabel: next.actionLabel,
      onAction: next.onAction,
      variant: next.variant,
    });
    setToastVisible(true);

    toastTimerRef.current = setTimeout(() => {
      setToastVisible(false);
      toastTimerRef.current = null;
    }, next.duration ?? 2500);
  }, []);

  const modal = useCallback((opts: ModalOptions) => {
    setModalState(opts);
    setModalVisible(true);
  }, []);

  const dismissModal = useCallback(() => {
    setModalVisible(false);
    setModalState(null);
  }, []);

  const isBackdropVisible = alertVisible || confirmVisible || modalVisible;

  const handleBackdropPress = useCallback(() => {
    if (alertVisible) dismissAlert();
    else if (confirmVisible) onConfirmCancel();
    else if (modalVisible && modalState?.dismissible !== false) dismissModal();
  }, [
    alertVisible,
    confirmVisible,
    modalVisible,
    modalState,
    dismissAlert,
    onConfirmCancel,
    dismissModal,
  ]);

  const value = useMemo<OverlayContextValue>(
    () => ({
      alert,
      dismissAlert,
      confirm,
      destructiveConfirm,
      dismissConfirm,
      toast,
      modal,
      dismissModal,
    }),
    [
      alert,
      dismissAlert,
      confirm,
      destructiveConfirm,
      dismissConfirm,
      toast,
      modal,
      dismissModal,
    ]
  );

  return (
    <OverlayContext.Provider value={value}>
      {children}

      {isBackdropVisible && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999
        }}>
          <Pressable
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.4)"
            }}
            onPress={handleBackdropPress}
          />
          <View
            pointerEvents="box-none"
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            {alertVisible && (
              <AlertUI state={alertState} onDismiss={dismissAlert} />
            )}
            {confirmVisible && (
              <ConfirmUI
                state={confirmState}
                onOk={onConfirmOk}
                onCancel={onConfirmCancel}
              />
            )}
            {modalVisible && (
              <ModalUI state={modalState} onDismiss={dismissModal} />
            )}
          </View>
        </View>
      )}

      <ToastUI
        visible={toastVisible}
        state={toastState}
      />
    </OverlayContext.Provider>
  );
}

export function useOverlay(): OverlayContextValue {
  const ctx = useContext(OverlayContext);
  if (!ctx) {
    throw new Error("useOverlay must be used within OverlayProvider");
  }
  return ctx;
}
