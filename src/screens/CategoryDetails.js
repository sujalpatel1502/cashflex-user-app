import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { 
  COLORS, 
  FONT_FAMILY, 
  FONT_SIZE, 
  SPACING, 
  BORDER_RADIUS, 
  SCREEN_WIDTH 
} from '../utils';
import { CustomScreenHeader } from '../components/common';
import categoryApi from '../services/categoryApi';

const CategoryDetails = ({ route }) => {
  const navigation = useNavigation();
  const { category } = route.params;
  const insets = useSafeAreaInsets();
  
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  console.log("routes", category);

  const getCategoryDetails = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await categoryApi.getCategoryDetails(category.id);
      console.log("response of category details", response);
      
      if (response && response.success && response.data) {
        setBrands(response.data);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Error fetching category details:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategoryDetails();
  }, [category]);

  const handleBrandPress = (brand) => {
    // Navigate to brand products or details screen
    navigation.navigate('BrandDetails', { brand, category });
  };

  const renderBrandItem = ({ item, index }) => (
    <Animatable.View 
      animation="fadeInUp" 
      duration={600} 
      delay={index * 100}
      style={styles.brandItemContainer}
    >
      <TouchableOpacity
        style={styles.brandCard}
        onPress={() => handleBrandPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.brandImageContainer}>
          <Image
            source={{ 
              uri: item.brand_img || 'https://via.placeholder.com/60' 
            }}
            style={styles.brandImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.brandName} numberOfLines={2}>
          {item.name || 'Brand'}
        </Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  const renderEmptyState = () => (
    <Animatable.View 
      animation="fadeIn" 
      duration={800}
      style={styles.emptyStateContainer}
    >
      <View style={styles.emptyStateIcon}>
        <Text style={styles.emptyStateIconText}>📱</Text>
      </View>
      <Text style={styles.emptyStateTitle}>No Brands Available</Text>
      <Text style={styles.emptyStateSubtitle}>
        We're working on adding more brands for this category. Check back soon!
      </Text>
      <TouchableOpacity 
        style={styles.retryButton}
        onPress={getCategoryDetails}
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  const renderLoader = () => (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color={COLORS.gradientStart} />
      <Text style={styles.loaderText}>Loading brands...</Text>
    </View>
  );

  const renderBrandsList = () => (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: Math.max(insets.bottom, SPACING.xl) }
      ]}
    >
      <Animatable.View animation="slideInUp" duration={800} delay={200}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Choose Your Brand</Text>
          <Text style={styles.sectionSubtitle}>
            Select the brand of your {category.cat_name || 'device'}
          </Text>
        </View>
        
        <FlatList
          data={brands}
          renderItem={renderBrandItem}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.brandsContainer}
          columnWrapperStyle={styles.brandRow}
          scrollEnabled={false}
        />
      </Animatable.View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <CustomScreenHeader
        title={category.cat_name || "Category Details"}
        subtitle="Choose what works best for you"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      
      <View style={styles.content}>
        {loading ? (
          <View style={[styles.loaderContainer, { paddingBottom: Math.max(insets.bottom, SPACING.xl) }]}>
            <ActivityIndicator size="large" color={COLORS.gradientStart} />
            <Text style={styles.loaderText}>Loading brands...</Text>
          </View>
        ) : error || brands.length === 0 ? (
          <View style={[styles.emptyStateWrapper, { paddingBottom: Math.max(insets.bottom, SPACING.xl) }]}>
            {renderEmptyState()}
          </View>
        ) : (
          renderBrandsList()
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  
  // Scroll Content
  scrollContent: {
    flexGrow: 1,
  },
  
  // Loading State
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },

  // Section Header
  sectionHeader: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  // Brands List
  brandsContainer: {
    paddingBottom: SPACING.sm,
  },
  brandRow: {
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  brandItemContainer: {
    width: (SCREEN_WIDTH - (SPACING.lg * 2) - (SPACING.sm * 2)) / 3,
  },
  brandCard: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    minHeight: 90,
    justifyContent: 'center',
  },
  brandImageContainer: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.gradientStart + '10',
    borderRadius: BORDER_RADIUS.xs,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  brandImage: {
    width: 40,
    height: 40,
  },
  brandName: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 14,
  },

  // Empty State
  emptyStateWrapper: {
    flex: 1,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.gradientStart + '15',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  emptyStateIconText: {
    fontSize: 40,
  },
  emptyStateTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  emptyStateSubtitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  retryButton: {
    backgroundColor: COLORS.gradientStart,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  retryButtonText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.background,
  },
});

export default CategoryDetails;