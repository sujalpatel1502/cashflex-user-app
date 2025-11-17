import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING } from '../../utils';

const CustomToast = ({ visible, message, type = 'success', duration = 3000, onHide }) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(duration),
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide && onHide();
      });
    }
  }, [visible]);

  if (!visible) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return COLORS.success;
      case 'error': return COLORS.error;
      case 'warning': return COLORS.warning;
      case 'info': return COLORS.info;
      default: return COLORS.success;
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { backgroundColor: getBackgroundColor(), transform: [{ translateY: slideAnim }] }
      ]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: SPACING.md,
    right: SPACING.md,
    padding: SPACING.md,
    borderRadius: 8,
    zIndex: 1000,
    elevation: 5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  message: {
    color: COLORS.textWhite,
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.medium,
    textAlign: 'center',
  },
});

export default CustomToast;
