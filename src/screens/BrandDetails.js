// screens/BrandDetails.js
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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
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
import BrandApi from '../services/brandApi';

const BrandDetails = ({ route }) => {
  const navigation = useNavigation();
  const { brand, category } = route.params;
  const insets = useSafeAreaInsets();
  
  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getBrandModels = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await BrandApi.getBrandByCatId(brand.id, brand.cat_id);
      console.log("response of brand models", response);
      
      if (response && response.success && response.data) {
        setModels(response.data);
        setFilteredModels(response.data);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Error fetching brand models:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBrandModels();
  }, [brand]);

  // Search functionality
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredModels(models);
    } else {
      const filtered = models.filter(model =>
        model.name?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredModels(filtered);
    }
  };

  const handleModelPress = (model) => {
    // Navigate to model details or next screen
    navigation.navigate('ModelDetails', { model, brand, category });
  };

  const renderModelItem = ({ item, index }) => (
    <Animatable.View 
      animation="fadeInUp" 
      duration={600} 
      delay={index * 50}
      style={styles.modelItemContainer}
    >
      <TouchableOpacity
        style={styles.modelCard}
        onPress={() => handleModelPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.modelImageContainer}>
          <Image
            source={{ 
              uri: item.fileUrl || 'https://via.placeholder.com/120' 
            }}
            style={styles.modelImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.modelName} numberOfLines={2}>
          {item.name || 'Model'}
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
      <Text style={styles.emptyStateTitle}>
        {searchQuery ? 'No Models Found' : 'No Models Available'}
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {searchQuery 
          ? `No results found for "${searchQuery}"`
          : `We're working on adding more models for ${brand.name}. Check back soon!`
        }
      </Text>
      {!searchQuery && (
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={getBrandModels}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      )}
    </Animatable.View>
  );

  const renderLoader = () => (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color={COLORS.gradientStart} />
      <Text style={styles.loaderText}>Loading models...</Text>
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

  const renderModelsList = () => (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: Math.max(insets.bottom + 80, SPACING.xl) }
      ]}
    >
      {/* Search Bar */}
      {renderSearchBar()}

      {/* All Models Section */}
      <Animatable.View animation="slideInUp" duration={800} delay={200}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All model</Text>
        </View>
        
        {filteredModels.length > 0 ? (
          <FlatList
            data={filteredModels}
            renderItem={renderModelItem}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modelsContainer}
            columnWrapperStyle={styles.modelRow}
            scrollEnabled={false}
          />
        ) : (
          renderEmptyState()
        )}
      </Animatable.View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomScreenHeader
        title="Select Model"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      
      <View style={styles.content}>
        {loading ? renderLoader() : renderModelsList()}
      </View>
    </SafeAreaView>
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

  // Models List
  modelsContainer: {
    paddingBottom: SPACING.sm,
  },
  modelRow: {
    justifyContent: 'flex-start',
    marginBottom: SPACING.md,
  },
  modelItemContainer: {
    width: (SCREEN_WIDTH - SPACING.md * 2 - SPACING.md * 2) / 3,
    marginRight: SPACING.md,
  },
  modelCard: {
    backgroundColor: '#252424',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
    minHeight: 130,
    justifyContent: 'space-between',
  },
  modelImageContainer: {
    width: '100%',
    height: 80,
    backgroundColor: COLORS.textWhite,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  modelImage: {
    width: '90%',
    height: '90%',
  },
  modelName: {
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

export default BrandDetails;
