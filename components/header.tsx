import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useDesignSystem } from '../contexts/DesignSystemContext';

type HeaderProps = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  showBack?: boolean;
};

export default function Header({ title, subtitle, right, showBack = true }: HeaderProps) {
  const theme = useTheme();
  const router = useRouter();
  const { design } = useDesignSystem();

  const canGoBack = router.canGoBack() && showBack;

  return (
    <View 
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: design.spacing.sm,
        height: 64,
        backgroundColor: theme.colors.background,
        gap: design.spacing.xs,
      }}
    >
      {canGoBack && (
        <IconButton 
          icon="chevron-left" 
          size={28} 
          onPress={() => router.back()} 
          style={{ margin: 0 }}
        />
      )}
      
      <View style={{ flex: 1, paddingLeft: canGoBack ? 0 : design.spacing.xs }}>
        <Text 
          variant="titleLarge" 
          style={{ 
            fontFamily: 'ComicNeue_700Bold',
            color: theme.colors.onBackground
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text 
            variant="bodySmall" 
            style={{ 
              fontFamily: 'ComicNeue_400Regular',
              opacity: 0.6,
              color: theme.colors.onBackground,
              marginTop: -4
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {right && (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {right}
        </View>
      )}
    </View>
  );
}
