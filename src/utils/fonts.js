// utils/fonts.js
import { Platform } from 'react-native';

export const FONT_FAMILY = {
  regular: Platform.OS === 'ios' ? 'System' : 'Roboto-Regular',
  medium: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
  bold: Platform.OS === 'ios' ? 'System' : 'Roboto-Bold',
  light: Platform.OS === 'ios' ? 'System' : 'Roboto-Light',
};

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  title: 32,
};
