// screens/SellScreen.js
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
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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

const SellScreen = ({ route }) => {
  const navigation = useNavigation();
  // Use default category id of 1 if category is not provided
  const category = route.params?.category || null;
  const categoryId = category?.id || 1;
  
  console.log("Selected category in SellScreen:", category);
  console.log("Using category ID:", categoryId);
  
  const insets = useSafeAreaInsets();
  
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getCategoryDetails = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await categoryApi.getCategoryDetails(categoryId);
      console.log("response of category details", response);
      
      if (response && response.success && response.data) {
        setBrands(response.data);
        setFilteredBrands(response.data);
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
  }, [categoryId]);

  // Search functionality
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredBrands(brands);
    } else {
      const filtered = brands.filter(brand =>
        brand.name?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredBrands(filtered);
    }
  };

  const handleBrandPress = (brand) => {
    navigation.navigate('BrandDetails', { brand, category });
  };

  const renderBrandItem = ({ item, index }) => (
    <Animatable.View 
      animation="fadeInUp" 
      duration={600} 
      delay={index * 50}
      style={styles.brandItemContainer}
    >
      <TouchableOpacity
        style={styles.brandCard}
        onPress={() => handleBrandPress(item)}
        activeOpacity={0.8}
      >
        <Image
          source={{ 
            uri: item.brand_img || 'https://via.placeholder.com/80' 
          }}
          style={styles.brandImage}
          resizeMode="contain"
        />
        <Text style={styles.brandName} numberOfLines={1}>
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
        <Text style={styles.emptyStateIconText}>🔍</Text>
      </View>
      <Text style={styles.emptyStateTitle}>
        {searchQuery ? 'No Brands Found' : 'No Brands Available'}
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {searchQuery 
          ? `No results found for "${searchQuery}"`
          : "We're working on adding more brands for this category. Check back soon!"
        }
      </Text>
      {!searchQuery && (
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={getCategoryDetails}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      )}
    </Animatable.View>
  );

  const renderLoader = () => (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color={COLORS.gradientStart} />
      <Text style={styles.loaderText}>Loading brands...</Text>
    </View>
  );

  const renderSearchBar = () => (
    <Animatable.View animation="fadeInDown" duration={800} style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Icon name="magnify" size={22} color={COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Icon name="close-circle" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.imageSearchButton}>
          <Icon name="image-outline" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );

  const renderBrandsList = () => (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: Math.max(insets.bottom + 80, SPACING.xl) }
      ]}
    >
      {/* Search Bar */}
      {renderSearchBar()}

      {/* All Brands Section */}
      <Animatable.View animation="slideInUp" duration={800} delay={200}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Brands</Text>
        </View>
        
        {filteredBrands.length > 0 ? (
          <FlatList
            data={filteredBrands}
            renderItem={renderBrandItem}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.brandsContainer}
            columnWrapperStyle={styles.brandRow}
            scrollEnabled={false}
          />
        ) : (
          renderEmptyState()
        )}
      </Animatable.View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <CustomScreenHeader
        title="Select Brand"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      
      <View style={styles.content}>
        {loading ? renderLoader() : renderBrandsList()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  
  // Scroll Content
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.md,
  },
  
  // Search Bar
  searchContainer: {
    marginVertical: SPACING.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A3A3A',
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    height: 50,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  imageSearchButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.sm,
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
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
  },

  // Brands List
  brandsContainer: {
    paddingBottom: SPACING.sm,
  },
  brandRow: {
    justifyContent: 'flex-start',
    marginBottom: SPACING.xl,
  },
  brandItemContainer: {
    width: (SCREEN_WIDTH - SPACING.md * 2 - SPACING.md * 2) / 3,
    marginRight: SPACING.md,
  },
  brandCard: {
    backgroundColor: '#252424',
    borderRadius: BORDER_RADIUS.md,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandImage: {
    width: 90,
    height: 50,
    marginBottom: SPACING.sm,
  },
  brandName: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 14,
  },

  // Empty State
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
    minHeight: 300,
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
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  retryButtonText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.background,
  },
});

export default SellScreen;