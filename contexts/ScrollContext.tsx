import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from "react-native";

type ScrollContextType = {
  isNavBarVisible: boolean;
  scrollY: number;
  setNavBarVisible: (visible: boolean) => void;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  registerScrollRef: (tabName: string, ref: ScrollView | null) => void;
  scrollToTop: (tabName: string) => void;
};

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isNavBarVisible, setNavBarVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const scrollRefs = useRef<{ [key: string]: ScrollView | null }>({});
  const lastOffset = useRef(0);

  const registerScrollRef = useCallback((tabName: string, ref: ScrollView | null) => {
    scrollRefs.current[tabName] = ref;
  }, []);

  const scrollToTop = useCallback((tabName: string) => {
    const ref = scrollRefs.current[tabName];
    if (ref) {
      ref.scrollTo({ y: 0, animated: true });
      setNavBarVisible(true);
    }
  }, []);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    setScrollY(currentOffset);
    
    // Always show at the very top
    if (currentOffset <= 0) {
      setNavBarVisible(true);
      lastOffset.current = currentOffset;
      return;
    }

    // Determine direction
    const direction = currentOffset > lastOffset.current ? "down" : "up";
    const diff = Math.abs(currentOffset - lastOffset.current);

    // Only trigger after a small threshold to avoid jitter
    if (diff > 10) {
      if (direction === "down" && isNavBarVisible) {
        setNavBarVisible(false);
      } else if (direction === "up" && !isNavBarVisible) {
        setNavBarVisible(true);
      }
      lastOffset.current = currentOffset;
    }
  }, [isNavBarVisible]);

  return (
    <ScrollContext.Provider
      value={{
        isNavBarVisible,
        scrollY,
        setNavBarVisible,
        handleScroll,
        registerScrollRef,
        scrollToTop,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error("useScroll must be used within a ScrollProvider");
  }
  return context;
};
