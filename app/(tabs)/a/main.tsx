import React from 'react';
import { View } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useDesignSystem } from '../../../contexts/DesignSystemContext';

export default function HomeMain() {
  const theme = useTheme();
  const { design } = useDesignSystem();
  const router = useRouter();

  return (
    <View 
      style={{ 
        flex: 1, 
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: design.spacing.md
      }}
    >
      <Text variant="headlineMedium">Home Main Screen</Text>
      <Text variant="bodyLarge" style={{ textAlign: 'center', marginVertical: design.spacing.md }}>
        This is a secondary screen within the Home tab folder.
      </Text>
      <Button mode="contained" onPress={() => router.back()}>
        Go Back
      </Button>
    </View>
  );
}
