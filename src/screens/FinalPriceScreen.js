// screens/FinalPriceScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZE,
  SPACING,
  BORDER_RADIUS,
} from '../utils';
import { CustomScreenHeader } from '../components/common';
import FastPayment from '../assets/images/FastPayment.png';
import Pickup from '../assets/images/Pickup.png';
import Safe from '../assets/images/Safe.png';


const FinalPriceScreen = ({ route }) => {
  const navigation = useNavigation();
  const { productDetails, selectedVariant, finalPrice, responses } = route.params;
  const insets = useSafeAreaInsets();


  const [showFAQs, setShowFAQs] = useState({});


  const toggleFAQ = (index) => {
    setShowFAQs(prev => ({ ...prev, [index]: !prev[index] }));
  };


  const faqs = [
    {
      question: 'How did you calculate my device price?',
      answer: 'We calculate your device price based on the variant, condition, and defects you\'ve selected. Each factor affects the final price proportionally.',
    },
    {
      question: 'Is it safe to sell my phone on Cash Flex?',
      answer: 'Yes, absolutely! We ensure 100% safe transactions with secure payment methods and verified pickup services.',
    },
    {
      question: 'How does Voucher payment work?',
      answer: 'Voucher payments allow you to receive your payment in the form of store vouchers which can be redeemed at partner stores.',
    },
  ];


  const handleSellNow = () => {
    // Navigate to PickupAddress screen with all required data
    navigation.navigate('PickupAddress', {
      productDetails,
      selectedVariant,
      finalPrice,
      responses, // This contains all the questionnaire responses
    });
  };


  const handleViewBreakup = () => {
    console.log('View price breakup...');
    // navigation.navigate('PriceBreakup', { ...route.params });
  };


  // Calculate bottom padding including safe area
  const bottomPadding = Platform.OS === 'ios' 
    ? 120 + insets.bottom 
    : 120 + Math.max(insets.bottom, 0);


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomScreenHeader
        title="Your Device"
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
        {/* Price Card */}
        <Animatable.View animation="fadeInUp" duration={800} delay={200}>
          <View style={styles.priceCard}>
            <View style={styles.deviceHeader}>
              <View style={styles.deviceImageWrapper}>
                <Image
                  source={{ uri: productDetails.product_image }}
                  style={styles.deviceImage}
                  resizeMode="contain"
                />
              </View>
              
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>
                  {productDetails.product_name} ({selectedVariant.specification.STORAGE})
                </Text>
                <Text style={styles.priceLabel}>Selling price:</Text>
                <Text style={styles.finalPrice}>
                  ₹ {parseFloat(finalPrice).toLocaleString('en-IN', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </Text>
              </View>
            </View>


            {/* Divider */}
            <View style={styles.divider} />


            {/* Features */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Image source={FastPayment} style={styles.featureIcon} resizeMode="contain" />
                <Text style={styles.featureText}>Fast Payments</Text>
              </View>
              
              <View style={styles.featureDivider} />
              
              <View style={styles.featureItem}>
                <Image source={Pickup} style={styles.featureIcon} resizeMode="contain" />
                <Text style={styles.featureText}>Free Pickup</Text>
              </View>
              
              <View style={styles.featureDivider} />
              
              <View style={styles.featureItem}>
                <Image source={Safe} style={styles.featureIcon} resizeMode="contain" />
                <Text style={styles.featureText}>100% Safe</Text>
              </View>
            </View>


            {/* Divider */}
            <View style={styles.divider} />


            {/* Sell Now Button Inside Card */}
            <TouchableOpacity
              onPress={handleSellNow}
              activeOpacity={0.8}
            >
              <View style={styles.sellNowCardButton}>
                <LinearGradient
                  colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.sellNowCardGradient}
                >
                  <View style={styles.sellNowCardContent}>
                    <Text style={styles.sellNowCardText}>Sell Now</Text>
                  </View>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          </View>
        </Animatable.View>


        {/* Apply Coupons - Smaller */}
        <Animatable.View animation="fadeInUp" duration={800} delay={400}>
          <TouchableOpacity style={styles.couponCard} activeOpacity={0.8}>
            <View style={styles.couponLeft}>
              <View style={styles.couponIcon}>
                <Icon name="brightness-percent" size={24} color={COLORS.textPrimary} />
              </View>
              <Text style={styles.couponText}>Apply Coupons</Text>
            </View>
            <Icon name="chevron-right" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </Animatable.View>


        {/* FAQs */}
        <Animatable.View animation="fadeInUp" duration={800} delay={600}>
          <Text style={styles.faqsTitle}>FAQs</Text>
          
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => toggleFAQ(index)}
                activeOpacity={0.8}
              >
                <Text style={styles.faqQuestionText}>{faq.question}</Text>
                <Icon
                  name={showFAQs[index] ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={COLORS.textPrimary}
                />
              </TouchableOpacity>
              
              {showFAQs[index] && (
                <Animatable.View animation="fadeIn" duration={300}>
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                </Animatable.View>
              )}
            </View>
          ))}
        </Animatable.View>
      </ScrollView>


      {/* Bottom Fixed Bar - #262626 background */}
      <Animatable.View
        animation="fadeInUp"
        duration={600}
        style={[
          styles.bottomBar,
          {
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        <View style={styles.bottomLeft}>
          <Text style={styles.bottomPrice}>
            ₹ {parseFloat(finalPrice).toLocaleString('en-IN', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </Text>
          <TouchableOpacity onPress={handleViewBreakup}>
            <Text style={styles.viewBreakup}>View Breakup</Text>
          </TouchableOpacity>
        </View>


        <TouchableOpacity
          onPress={handleSellNow}
          activeOpacity={0.8}
        >
          <View style={styles.bottomButton}>
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.bottomButtonGradient}
            >
              <View style={styles.bottomButtonContent}>
                <Text style={styles.bottomButtonText}>Sell Now</Text>
              </View>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    flexGrow: 1,
  },


  // Price Card
  priceCard: {
    backgroundColor: '#3A3A3A',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  deviceHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  deviceImageWrapper: {
    width: 90,
    height: 110,
    backgroundColor: 'rgba(162, 162, 162, 0.48)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xs,
    marginRight: SPACING.md,
  },
  deviceImage: {
    width: '100%',
    height: '100%',
  },
  deviceInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  deviceName: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    lineHeight: 24,
  },
  priceLabel: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  finalPrice: {
    fontSize: 32,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.gradientStart,
  },


  // Divider
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: SPACING.md,
  },


  // Features
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: 40,
    height: 40,
    marginBottom: SPACING.xs,
  },
  featureDivider: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },


  // Sell Now Button Inside Card
  sellNowCardButton: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  sellNowCardGradient: {
    width: '100%',
  },
  sellNowCardContent: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellNowCardText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.background,
  },


  // Coupon Card - Smaller
  couponCard: {
    backgroundColor: '#3A3A3A',
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  couponLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  couponText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
  },


  // FAQs
  faqsTitle: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  faqItem: {
    marginBottom: SPACING.xs,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  faqQuestionText: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textPrimary,
    marginRight: SPACING.sm,
  },
  faqAnswer: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    paddingVertical: SPACING.md,
    paddingRight: SPACING.xl,
    lineHeight: 20,
  },


  // Bottom Fixed Bar - #262626 background
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    backgroundColor: '#262626',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  bottomLeft: {
    flex: 1,
  },
  bottomPrice: {
    fontSize: FONT_SIZE.xxl,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.gradientStart,
    marginBottom: 4,
  },
  viewBreakup: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
  },
  bottomButton: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    marginLeft: SPACING.sm,
  },
  bottomButtonGradient: {
    width: '100%',
  },
  bottomButtonContent: {
    paddingVertical: 14,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButtonText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.background,
  },
});


export default FinalPriceScreen;
