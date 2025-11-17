import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../utils';

const CustomButton = ({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  variant = 'primary',
  disabled = false,
  gradient = false 
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: COLORS.backgroundLight, borderWidth: 1, borderColor: COLORS.gradientStart };
      case 'outline':
        return { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.gradientStart };
      default:
        return { backgroundColor: COLORS.gradientStart };
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
      case 'outline':
        return { color: COLORS.gradientStart };
      default:
        return { color: COLORS.textWhite };
    }
  };

  const ButtonContent = () => (
    <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
  );

  if (gradient && variant === 'primary') {
    return (
      <TouchableOpacity 
        style={[styles.button, style]} 
        onPress={onPress} 
        disabled={disabled}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[COLORS.gradientEnd, COLORS.gradientStart, COLORS.gradientMid]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <ButtonContent />
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.button, getButtonStyle(), style, disabled && styles.disabled]} 
      onPress={onPress} 
      disabled={disabled}
      activeOpacity={0.8}
    >
      <ButtonContent />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  gradient: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
  },
  text: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.medium,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default CustomButton;
