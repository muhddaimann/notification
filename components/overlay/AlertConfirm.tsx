import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Animated, BackHandler } from 'react-native';
import { Surface, Button, Paragraph, Text, useTheme } from 'react-native-paper';

type AlertConfirmProps = {
  visible: boolean;
  type: 'alert' | 'confirm' | 'none';
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
};

export default function AlertConfirm({
  visible,
  type,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}: AlertConfirmProps) {
  const theme = useTheme();
  const [shouldRender, setShouldRender] = useState(visible);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        onCancel();
        return true;
      });
      return () => backHandler.remove();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => setShouldRender(false));
    }
  }, [visible]);

  if (!shouldRender) return null;

  return (
    <View 
      style={{
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <Animated.View 
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.6)',
            opacity: fadeAnim 
          }} 
        />
      </TouchableWithoutFeedback>
      
      <Animated.View 
        style={{ 
          width: '100%',
          alignItems: 'center',
          padding: 24,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }}
      >
        <Surface 
          elevation={4} 
          style={{ 
            padding: 24,
            width: '100%',
            maxWidth: 400,
            backgroundColor: theme.colors.surface, 
            borderRadius: 28 
          }}
        >
          {title && (
            <Text 
              style={{ 
                fontFamily: 'ComicNeue_700Bold',
                fontSize: 24,
                marginBottom: 12,
                color: theme.colors.onSurface 
              }}
            >
              {title}
            </Text>
          )}
          
          <View style={{ marginBottom: 24 }}>
            {message && (
              <Paragraph 
                style={{ 
                  fontFamily: 'ComicNeue_400Regular',
                  fontSize: 16,
                  lineHeight: 22,
                  color: theme.colors.onSurfaceVariant 
                }}
              >
                {message}
              </Paragraph>
            )}
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
            {type === 'confirm' && (
              <Button 
                onPress={onCancel} 
                mode="text" 
                textColor={theme.colors.error}
                labelStyle={{ fontFamily: 'ComicNeue_700Bold' }}
              >
                {cancelLabel}
              </Button>
            )}
            <Button 
              onPress={onConfirm} 
              mode="contained"
              labelStyle={{ fontFamily: 'ComicNeue_700Bold' }}
              style={{ borderRadius: 14 }}
            >
              {type === 'confirm' ? confirmLabel : 'OK'}
            </Button>
          </View>
        </Surface>
      </Animated.View>
    </View>
  );
}
