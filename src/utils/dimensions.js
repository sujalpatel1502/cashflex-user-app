// utils/dimensions.js
import { Dimensions, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

export const HEADER_HEIGHT = Platform.OS === 'ios' ? 88 : 64;
export const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 83 : 60;

export const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight : 44;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 50,
};
