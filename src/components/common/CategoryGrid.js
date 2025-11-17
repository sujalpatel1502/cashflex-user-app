import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CategoryGrid = ({ categories, navigation }) => {
  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryDetails', { category });
  };

  const getIconName = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('phone') || name.includes('mobile')) return 'cellphone';
    if (name.includes('laptop')) return 'laptop';
    if (name.includes('tablet')) return 'tablet';
    if (name.includes('watch') || name.includes('smartwatch')) return 'watch';
    if (name.includes('gaming') || name.includes('console')) return 'gamepad-variant';
    if (name.includes('tv') || name.includes('television')) return 'television';
    if (name.includes('camera') || name.includes('dslr')) return 'camera';
    if (name.includes('speaker')) return 'speaker';
    if (name.includes('earbuds') || name.includes('headphone')) return 'headphones';
    if (name.includes('refrigerator') || name.includes('fridge')) return 'fridge';
    if (name.includes('ac') || name.includes('air conditioner')) return 'air-conditioner';
    if (name.includes('imac') || name.includes('desktop')) return 'desktop-mac';
    return 'devices';
  };

  const getGradientColors = (index) => {
    const gradients = [
      ['#42C8B7', '#36B5A3'], // Teal
      ['#FF6B6B', '#EE5A52'], // Red
      ['#4ECDC4', '#44A08D'], // Green-Teal
      ['#45B7D1', '#3498DB'], // Blue
      ['#96CEB4', '#FFECD2'], // Green-Yellow
      ['#FDA085', '#F6D365'], // Orange-Yellow
      ['#A8EDEA', '#FED6E3'], // Cyan-Pink
      ['#D299C2', '#FEF9D7'], // Purple-Yellow
      ['#89F7FE', '#66A6FF'], // Light Blue
      ['#FDBB2D', '#22C1C3'], // Yellow-Cyan
      ['#FF9A9E', '#FECFEF'], // Pink-Light Pink
      ['#C471F5', '#FA71CD'], // Purple-Pink
    ];
    return gradients[index % gradients.length];
  };

  const renderCategoryItem = React.useCallback(({ item, index }) => {
    const iconName = getIconName(item.cat_name);
    const gradientColors = getGradientColors(index);

    return (
      <Animatable.View
        animation="fadeInUp"
        duration={600}
        delay={index * 100}
        style={styles.categoryItemContainer}
      >
        <TouchableOpacity
          style={styles.categoryItem}
          onPress={() => handleCategoryPress(item)}
          activeOpacity={0.8}
        >
          {/* Category Image/Icon Container */}
          <View style={[
            styles.categoryImageContainer,
            { backgroundColor: gradientColors[0] + '15' }
          ]}>
            {item.fileUrl ? (
              <Image
                source={{ uri: item.fileUrl }}
                style={styles.categoryImage}
                resizeMode="contain"
              />
            ) : (
              <Icon
                name={iconName}
                size={40}
                color={gradientColors[0]}
              />
            )}
          </View>

          {/* Category Name */}
          <Text style={styles.categoryName} numberOfLines={2}>
            {item.cat_name}
          </Text>

          {/* Availability Badge */}
          {item.avail === 'Available' && (
            <View style={[
              styles.availabilityBadge,
              { backgroundColor: COLORS.success + '15' }
            ]}>
              <Text style={styles.availabilityText}>Available</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animatable.View>
    );
  }, []);

  if (!categories || categories.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="folder-outline" size={60} color={COLORS.textLight} />
        <Text style={styles.emptyText}>No categories available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatGrid
        itemDimension={SCREEN_WIDTH / 2 - SPACING.xl - 10} // 2 columns with spacing
        data={categories}
        style={styles.gridList}
        spacing={SPACING.md}
        renderItem={renderCategoryItem}
        maxItemsPerRow={2}
        staticDimension={SCREEN_WIDTH - (SPACING.lg * 2)}
        fixed={true}
        scrollEnabled={false} // Disable scroll as it's inside ScrollView
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridList: {
    marginTop: SPACING.sm,
  },
  categoryItemContainer: {
    flex: 1,
  },
  categoryItem: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    position: 'relative',
  },
  categoryImageContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  categoryImage: {
    width: 60,
    height: 60,
  },
  categoryName: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 20,
  },
  availabilityBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  availabilityText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.success,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textLight,
    marginTop: SPACING.lg,
  },
});

export default CategoryGrid;