import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { Surface, useTheme } from 'react-native-paper';

type CustomModalProps = {
  content: React.ReactNode;
  onDismiss: () => void;
};

export default function CustomModal({ content, onDismiss }: CustomModalProps) {
  const theme = useTheme();

  return (
    <TouchableWithoutFeedback onPress={onDismiss}>
      <View 
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
        }}
      >
        <TouchableWithoutFeedback>
          <Surface 
            elevation={4} 
            style={{ 
              padding: 32,
              width: '100%',
              maxWidth: 420,
              gap: 16,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.1)',
              backgroundColor: theme.colors.surface, 
              borderRadius: 28 
            }}
          >
            {content}
          </Surface>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}
