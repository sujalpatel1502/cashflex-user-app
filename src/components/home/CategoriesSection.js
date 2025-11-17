// components/home/CategoriesSection.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../utils';

const CategoriesSection = ({ categories, navigation }) => {
  // Icon mapping for categories
  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('mobile') || name.includes('phone')) return 'cellphone';
    if (name.includes('laptop')) return 'laptop';
    if (name.includes('tablet')) return 'tablet';
    if (name.includes('watch')) return 'watch';
    if (name.includes('earbuds') || name.includes('headphone')) return 'headphones';
    if (name.includes('speaker')) return 'speaker';
    if (name.includes('tv')) return 'television';
    if (name.includes('ac')) return 'air-conditioner';
    if (name.includes('printer')) return 'printer';
    if (name.includes('washing')) return 'washing-machine';
    return 'devices';
  };

  const handleCategoryPress = (category) => {
    console.log("Pressed category:", category);
    // Check availability before navigation
    if (category.avail === 'Available') {
      navigation.navigate('Sell', { 
        category: category
      });
    } else {
      // Show coming soon or not available message
      console.log(`${category.cat_name} is ${category.avail}`);
    }
  };

  const renderCategoryItem = (item, index) => {
    const isAvailable = item.avail === 'Available';
    const isComingSoon = item.avail === 'Coming Soon';
    
    return (
      <Animatable.View 
        key={item.id}
        animation="fadeInUp" 
        duration={600} 
        delay={index * 50}
        style={styles.categoryItemWrapper}
      >
        <TouchableOpacity
          style={styles.categoryTouchable}
          onPress={() => handleCategoryPress(item)}
          activeOpacity={0.7}
          disabled={!isAvailable}
        >
          {/* SOLUTION 1: Wrapper View + Absolute Positioning */}
          <View style={styles.gradientWrapper}>
            {/* Gradient Border Layer */}
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBorderLayer}
            />
            
            {/* Inner wrapper to ensure proper spacing */}
            <View style={styles.innerWrapper}>
              {/* Content Card */}
              <View style={styles.categoryCard}>
                {/* Category Icon/Image Container */}
                {item.fileUrl ? (
                  <Image 
                    source={{ uri: item.fileUrl }} 
                    style={styles.categoryImage} 
                    resizeMode="contain"
                  />
                ) : (
                  <Icon 
                    name={getCategoryIcon(item.cat_name)} 
                    size={40} 
                    color={COLORS.textPrimary} 
                  />
                )}

                {/* Availability Badge */}
                
              </View>
            </View>
          </View>

          {/* Category Name - Outside the box */}
          <Text 
            style={styles.categoryName} 
            numberOfLines={2}
          >
            {item.cat_name}
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.sectionTitle}>Categories</Text>
      </View>

      <View style={styles.categoriesGrid}>
        {categories.map((item, index) => renderCategoryItem(item, index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(37, 36, 36, 0.89)', // #252424E3 - Dark grey background
    paddingVertical: SPACING.lg,
    marginHorizontal: 2,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  headerSection: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xxl,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.sm,
  },
  categoryItemWrapper: {
    width: '25%',
    padding: SPACING.sm,
  },
  categoryTouchable: {
    alignItems: 'center',
  },
  // SOLUTION 1: Wrapper container with relative positioning
  gradientWrapper: {
    position: 'relative',
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
    width: '100%',
    minHeight: 94, // Ensures full border visibility (90 + 2*2 for margins)
  },
  // Gradient border as absolute positioned layer
  gradientBorderLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BORDER_RADIUS.md,
  },
  // Inner wrapper to maintain proper spacing
  innerWrapper: {
    flex: 1,
    padding: 2, // This creates the border width
  },
  categoryCard: {
    backgroundColor: '#254941',
    borderRadius: BORDER_RADIUS.md - 2,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 90,
    position: 'relative',
  },
  categoryImage: {
    width: 50,
    height: 50,
  },
  categoryName: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginTop: 4,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 10,
  },
  badgeComingSoon: {
    backgroundColor: COLORS.warning,
  },
  badgeNotAvailable: {
    backgroundColor: COLORS.error,
  },
  badgeText: {
    fontSize: 8,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textWhite,
  },
});

export default CategoriesSection;