import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../utils';

const CustomInput = ({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  leftIcon,
  rightIcon,
  style,
  ...props 
}) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, isFocused && styles.focused, error && styles.error]}>
        {leftIcon && (
          <Icon name={leftIcon} size={20} color={COLORS.textSecondary} style={styles.leftIcon} />
        )}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)} style={styles.rightIcon}>
            <Icon name={isSecure ? 'eye-off' : 'eye'} size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
        {rightIcon && !secureTextEntry && (
          <Icon name={rightIcon} size={20} color={COLORS.textSecondary} style={styles.rightIcon} />
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
  },
  focused: {
    borderColor: COLORS.gradientStart,
  },
  error: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.md,
  },
  leftIcon: {
    marginRight: SPACING.sm,
  },
  rightIcon: {
    marginLeft: SPACING.sm,
  },
  errorText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});

export default CustomInput;
