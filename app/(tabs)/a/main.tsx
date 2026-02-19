import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useRouter, useFocusEffect } from 'expo-router';
import { useDesignSystem } from '../../../contexts/DesignSystemContext';
import { useScroll } from '../../../contexts/ScrollContext';
import Header from "../../../components/header";

export default function Main() {
  const theme = useTheme();
  const { design } = useDesignSystem();
  const { setNavBarVisible } = useScroll();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      // Hide navbar when entering this screen
      setNavBarVisible(false);
      
      return () => {
        // Show navbar when leaving this screen
        setNavBarVisible(true);
      };
    }, [setNavBarVisible])
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="Home Main" subtitle="Secondary Screen" />
      
    </View>
  );
}
