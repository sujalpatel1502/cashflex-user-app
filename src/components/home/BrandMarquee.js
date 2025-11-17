// components/home/BrandMarquee.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { COLORS, SPACING } from '../../utils';

const { width: screenWidth } = Dimensions.get('window');

const BrandMarquee = () => {
  const scrollX = useRef(new Animated.Value(0)).current;

  const brands = [
    { name: 'Samsung', logo: require('../../assets/brands/Samsung.png') },
    { name: 'Apple', logo: require('../../assets/brands/Apple.png') },
    { name: 'Realme', logo: require('../../assets/brands/Realme.png') },
    { name: 'Huawei', logo: require('../../assets/brands/Huawei.png') },
    { name: 'OnePlus', logo: require('../../assets/brands/Samsung.png') },
    { name: 'Xiaomi', logo: require('../../assets/brands/Apple.png') },
    { name: 'Oppo', logo: require('../../assets/brands/Realme.png') },
    { name: 'Vivo', logo: require('../../assets/brands/Huawei.png') },
    { name: 'Google', logo: require('../../assets/brands/Apple.png') },
  ];

  // Duplicate brands for seamless loop
  const duplicatedBrands = [...brands, ...brands];
  const totalWidth = duplicatedBrands.length * 120; // 120 is brand item width

  useEffect(() => {
    const startAnimation = () => {
      scrollX.setValue(0);
      Animated.timing(scrollX, {
        toValue: -totalWidth / 2, // Move half the total width (one complete set)
        duration: 20000, // 20 seconds for smooth scrolling
        useNativeDriver: true,
      }).start(() => startAnimation()); // Loop infinitely
    };

    startAnimation();
  }, [scrollX, totalWidth]);

  const BrandItem = ({ brand, index }) => (
    <View style={styles.brandItem} key={`${brand.name}-${index}`}>
      <View style={styles.brandLogoContainer}>
        <Image 
          source={brand.logo} 
          style={styles.brandLogo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.brandName}>{brand.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trusted by Top Brands</Text>
        <Text style={styles.subtitle}>We accept devices from all major manufacturers</Text>
      </View>
      
      <View style={styles.marqueeContainer}>
        <Animated.View
          style={[
            styles.marqueeContent,
            {
              transform: [{ translateX: scrollX }],
            },
          ]}
        >
          {duplicatedBrands.map((brand, index) => (
            <BrandItem brand={brand} index={index} key={`${brand.name}-${index}`} />
          ))}
        </Animated.View>
      </View>
      
      {/* Gradient overlays for fade effect */}
      <View style={[styles.gradientOverlay, styles.leftGradient]} />
      <View style={[styles.gradientOverlay, styles.rightGradient]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.lg,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  marqueeContainer: {
    height: 80,
    overflow: 'hidden',
  },
  marqueeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  brandItem: {
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.sm,
  },
  brandLogoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  brandLogo: {
    width: 30,
    height: 30,
  },
  brandName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 30,
    zIndex: 1,
  },
  leftGradient: {
    left: 0,
    backgroundColor: 'transparent',
    background: `linear-gradient(to right, ${COLORS.background}, transparent)`,
  },
  rightGradient: {
    right: 0,
    backgroundColor: 'transparent',
    background: `linear-gradient(to left, ${COLORS.background}, transparent)`,
  },
});

export default BrandMarquee;