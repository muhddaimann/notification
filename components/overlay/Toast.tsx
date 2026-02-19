import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';
import { useTheme, Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type ToastProps = {
  visible: boolean;
  message: string;
  type: 'info' | 'success' | 'error';
  duration?: number;
  onDismiss: () => void;
};

export default function Toast({ visible, message, type, duration = 3000, onDismiss }: ToastProps) {
  const theme = useTheme();
  const [shouldRender, setShouldRender] = useState(visible);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        onDismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setShouldRender(false));
    }
  }, [visible, duration, onDismiss]);

  if (!shouldRender) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return theme.colors.error;
      default:
        return theme.colors.onSurfaceVariant;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'alert-circle';
      default:
        return 'information';
    }
  };

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 10,
        left: 16,
        right: 16,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        zIndex: 10000,
      }}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <TouchableOpacity activeOpacity={0.9} onPress={onDismiss}>
        <Surface
          elevation={4}
          style={{
            backgroundColor: getBackgroundColor(),
            borderRadius: 16,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <MaterialCommunityIcons name={getIcon()} size={22} color="white" />
            <Text 
              style={{ 
                color: 'white', 
                fontFamily: 'ComicNeue_700Bold',
                marginLeft: 12,
                fontSize: 15,
                flex: 1
              }}
            >
              {message}
            </Text>
          </View>
          <Text 
            style={{ 
              color: 'white', 
              fontFamily: 'ComicNeue_700Bold',
              fontSize: 12,
              opacity: 0.8,
              marginLeft: 8
            }}
          >
            DISMISS
          </Text>
        </Surface>
      </TouchableOpacity>
    </Animated.View>
  );
}
