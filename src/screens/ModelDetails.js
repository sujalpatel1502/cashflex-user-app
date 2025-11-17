// screens/ModelDetails.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZE,
  SPACING,
  BORDER_RADIUS,
} from '../utils';
import { CustomScreenHeader } from '../components/common';
import BrandApi from '../services/brandApi';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ModelDetails = ({ route }) => {
  const navigation = useNavigation();
  const { model } = route.params;
  const insets = useSafeAreaInsets();

  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRAM, setSelectedRAM] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [availableRAM, setAvailableRAM] = useState([]);
  const [availableStorage, setAvailableStorage] = useState([]);

  const getProductDetails = async () => {
    try {
      setLoading(true);
      const response = await BrandApi.getModelDetails(model.id);
      console.log('Product details response:', response);

      if (response && response.success && response.data) {
        setProductDetails(response.data);

        const ramSet = new Set();
        response.data.variants.forEach(variant => {
          if (variant.specification.RAM) {
            ramSet.add(variant.specification.RAM);
          }
        });
        setAvailableRAM(Array.from(ramSet));
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductDetails();
  }, [model]);

  useEffect(() => {
    if (selectedRAM && productDetails) {
      const storageSet = new Set();
      productDetails.variants.forEach(variant => {
        if (variant.specification.RAM === selectedRAM) {
          storageSet.add(variant.specification.STORAGE);
        }
      });
      setAvailableStorage(Array.from(storageSet));
      setSelectedStorage(null);
      setSelectedVariant(null);
    }
  }, [selectedRAM, productDetails]);

  useEffect(() => {
    if (selectedRAM && selectedStorage && productDetails) {
      const variant = productDetails.variants.find(
        v =>
          v.specification.RAM === selectedRAM &&
          v.specification.STORAGE === selectedStorage
      );
      setSelectedVariant(variant);
    }
  }, [selectedRAM, selectedStorage, productDetails]);

const handleGetValue = () => {
  if (selectedVariant) {
    navigation.navigate('QuestionnaireScreen', {
      productDetails,
      selectedVariant,
      model,
    });
  }
};

  // Calculate bottom padding including safe area
  const bottomPadding = selectedVariant 
    ? Platform.OS === 'ios' 
      ? 100 + insets.bottom 
      : 100 + Math.max(insets.bottom, 0)
    : SPACING.lg;

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <CustomScreenHeader
          title="Your device"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.gradientStart} />
          <Text style={styles.loaderText}>Loading details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!productDetails) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <CustomScreenHeader
          title="Your device"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loaderContainer}>
          <Text style={styles.loaderText}>No data available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomScreenHeader
        title="Your device"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding },
        ]}
      >
        <View style={styles.mainContainer}>
          {/* Product Header */}
          <View style={styles.productHeader}>
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: productDetails.product_image }}
                style={styles.productImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.productNameContainer}>
              <Text style={styles.productName}>
                {productDetails.product_name}
              </Text>
              {/* Price Display */}
              {selectedVariant && (
                <Animatable.View animation="fadeIn" duration={500}>
                  <Text style={styles.priceText}>
                    ₹{parseFloat(selectedVariant.variant_price).toLocaleString('en-IN')}
                  </Text>
                </Animatable.View>
              )}
            </View>
          </View>

          {/* RAM Selection */}
          {availableRAM.length > 0 && (
            <Animatable.View animation="fadeInUp" duration={600} delay={100}>
              <View style={styles.sectionWrapper}>
                <LinearGradient
                  colors={[
                    'rgba(71, 220, 136, 0.12)',
                    'rgba(55, 217, 180, 0.12)',
                    'rgba(39, 212, 228, 0.12)',
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientContainer}
                >
                  <View style={styles.contentWrapper}>
                    <Text style={styles.sectionTitle}>Choose a variant</Text>

                    {availableRAM.map((ram, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.optionItem,
                          selectedRAM === ram && styles.optionItemSelected,
                          index === availableRAM.length - 1 && styles.lastOptionItem,
                        ]}
                        onPress={() => setSelectedRAM(ram)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.radio}>
                          {selectedRAM === ram && <View style={styles.radioFilled} />}
                        </View>
                        <Text style={styles.optionLabel}>{ram}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </LinearGradient>
              </View>
            </Animatable.View>
          )}

          {/* Storage Selection */}
          {selectedRAM && availableStorage.length > 0 && (
            <Animatable.View animation="fadeInUp" duration={600} delay={200}>
              <View style={styles.sectionWrapper}>
                <LinearGradient
                  colors={[
                    'rgba(71, 220, 136, 0.12)',
                    'rgba(55, 217, 180, 0.12)',
                    'rgba(39, 212, 228, 0.12)',
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientContainer}
                >
                  <View style={styles.contentWrapper}>
                    <Text style={styles.sectionTitle}>Choose Storage</Text>

                    {availableStorage.map((storage, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.optionItem,
                          selectedStorage === storage && styles.optionItemSelected,
                          index === availableStorage.length - 1 && styles.lastOptionItem,
                        ]}
                        onPress={() => setSelectedStorage(storage)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.radio}>
                          {selectedStorage === storage && (
                            <View style={styles.radioFilled} />
                          )}
                        </View>
                        <Text style={styles.optionLabel}>{storage}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </LinearGradient>
              </View>
            </Animatable.View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Fixed Button */}
      {selectedVariant && (
        <Animatable.View
          animation="fadeInUp"
          duration={600}
          style={[
            styles.bottomButtonContainer,
            {
              paddingBottom: Math.max(insets.bottom, 16),
            },
          ]}
        >
          <TouchableOpacity onPress={handleGetValue} activeOpacity={0.8}>
            <View style={styles.buttonWrapper}>
              <LinearGradient
                colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>Get Accurate Price</Text>
                </View>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        </Animatable.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
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
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    flexGrow: 1,
  },
  mainContainer: {
    backgroundColor: '#262626',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  imageWrapper: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(162, 162, 162, 0.48)',
    borderRadius: BORDER_RADIUS.md,
    padding: 8,
    marginRight: SPACING.md,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productNameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    flexWrap: 'wrap',
    marginBottom: SPACING.xs,
  },
  priceText: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.gradientStart,
  },
  sectionWrapper: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  gradientContainer: {
    width: '100%',
  },
  contentWrapper: {
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.gradientStart,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 14,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  lastOptionItem: {
    marginBottom: 0,
  },
  optionItemSelected: {
    backgroundColor: 'rgba(71, 220, 136, 0.2)',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.textWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  radioFilled: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.gradientStart,
  },
  optionLabel: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textPrimary,
    flex: 1,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  buttonWrapper: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  gradientButton: {
    width: '100%',
  },
  buttonContent: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.background,
  },
});

export default ModelDetails;