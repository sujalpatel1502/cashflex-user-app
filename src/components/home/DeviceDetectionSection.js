// components/home/DeviceDetectionSection.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../utils';

const DeviceDetectionSection = ({ deviceModel, estimatedPrice, onSellPress }) => {
  return (
    <View style={styles.deviceSection}>
      <Animatable.View animation="slideInUp" duration={800} delay={200}>
        <View style={styles.deviceCard}>
          <View style={styles.deviceImageContainer}>
            <Image 
              source={require('../../assets/images/mobile_placeholder.png')} 
              style={styles.deviceImage}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.deviceInfo}>
            <Text style={styles.sellThisDevice}>Sell This Device</Text>
            <Text style={styles.deviceModelText} numberOfLines={1}>{deviceModel}</Text>
            <Text style={styles.priceText}>Get ₹{estimatedPrice}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.sellNowButton}
            onPress={onSellPress}
          >
            <Text style={styles.sellNowButtonText}>Sell Now</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  deviceSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  deviceCard: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  deviceImageContainer: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.gradientStart + '15',
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  deviceImage: {
    width: 50,
    height: 50,
  },
  deviceInfo: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  sellThisDevice: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.gradientStart,
    marginBottom: 2,
  },
  deviceModelText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  priceText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.success,
  },
  sellNowButton: {
    backgroundColor: COLORS.gradientStart,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  sellNowButtonText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textWhite,
  },
});

export default DeviceDetectionSection;
