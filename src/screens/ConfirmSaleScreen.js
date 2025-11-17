// screens/ConfirmSaleScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import axios from 'axios';
import Config from 'react-native-config';
import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZE,
  SPACING,
  BORDER_RADIUS,
  Storage,
  StorageKeys,
} from '../utils';
import { CustomScreenHeader } from '../components/common';

const ConfirmSaleScreen = ({ route }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const { 
    productDetails, 
    selectedVariant, 
    finalPrice, 
    responses,
    pickupAddress 
  } = route.params;

  const [userId, setUserId] = useState(null);
  const [pickupDate, setPickupDate] = useState(new Date());
  const [pickupStartTime, setPickupStartTime] = useState(new Date());
  const [pickupEndTime, setPickupEndTime] = useState(new Date());
  const [paymentMode, setPaymentMode] = useState('card');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await Storage.get(StorageKeys.USER_DATA);
      if (userData && userData.id) {
        setUserId(userData.id);
        console.log('User ID loaded:', userData.id);
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const paymentModes = [
    { id: 'card', name: 'Card Payment', icon: 'credit-card-outline' },
    { id: 'upi', name: 'UPI Payment', icon: 'qrcode-scan' },
    { id: 'cash', name: 'Cash Payment', icon: 'cash' },
  ];

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}:00`;
  };

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatDisplayTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleConfirmSale = async () => {
    if (!userId) {
      Alert.alert('Error', 'User information not found. Please try again.');
      return;
    }

    if (!pickupAddress || (!pickupAddress.id && pickupAddress.type !== 'Current Location')) {
      Alert.alert('Error', 'Please select a valid pickup address.');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        user_id: userId,
        pickupAddress: pickupAddress.id || null, // null for current location
        pickupDate: formatDate(pickupDate),
        pickupStartTime: formatTime(pickupStartTime),
        pickupEndTime: formatTime(pickupEndTime),
        payment_mode: paymentMode,
        evaluatePrice: finalPrice,
        response: responses,
        selectedProduct: {
          product_id: productDetails.product_id,
          product_name: productDetails.product_name,
          brand_name: productDetails.brand_name,
          category_name: productDetails.category_name,
          product_image: productDetails.product_image,
          unique_specifications: productDetails.unique_specifications,
          leadPrice: productDetails.leadPrice,
          variant: {
            variant_id: selectedVariant.variant_id,
            variant_name: selectedVariant.variant_name,
            variant_price: selectedVariant.variant_price,
            specification: selectedVariant.specification,
          },
        },
      };

      console.log('Submitting lead payload:', JSON.stringify(payload, null, 2));

      const response = await axios.post(
        `${Config.API_URL}/lead/addLead/${userId}`,
        payload
      );

      console.log('Lead submission response:', response.data);

      if (response.data && response.data.success) {
        Alert.alert(
          'Success!',
          'Your device sale has been confirmed. We will contact you shortly for pickup.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('MainTab'),
            },
          ]
        );
      } else {
        Alert.alert('Error', response.data?.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate bottom padding including safe area
  const bottomPadding = Platform.OS === 'ios' 
    ? 100 + insets.bottom 
    : 100 + Math.max(insets.bottom, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomScreenHeader
        title="confirm sale"
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
        {/* Device Summary */}
        <Animatable.View animation="fadeInUp" duration={800} delay={200}>
          <Text style={styles.sectionTitle}>Device Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.deviceImageWrapper}>
              <Image
                source={{ uri: productDetails.product_image }}
                style={styles.deviceImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.deviceSummaryInfo}>
              <Text style={styles.deviceSummaryName}>
                {productDetails.product_name}
              </Text>
              <Text style={styles.deviceSummaryCondition}>Excellent condition</Text>
            </View>
          </View>
        </Animatable.View>

        {/* Estimated Price */}
        <Animatable.View animation="fadeInUp" duration={800} delay={300}>
          <Text style={styles.sectionTitle}>Estimated Price</Text>
          <View style={styles.priceCard}>
            <Text style={styles.priceAmount}>
              ₹ {parseFloat(finalPrice).toLocaleString('en-IN', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </Text>
            <Text style={styles.priceCurrency}>INR</Text>
          </View>
        </Animatable.View>

        {/* Pickup Address */}
        <Animatable.View animation="fadeInUp" duration={800} delay={400}>
          <Text style={styles.sectionTitle}>Pickup Address</Text>
          <View style={styles.addressCard}>
            <View style={styles.addressIconWrapper}>
              <Icon name="map-marker" size={24} color={COLORS.textPrimary} />
            </View>
            <View style={styles.addressInfo}>
              <Text style={styles.addressTitle}>
                {pickupAddress?.type || 'Home Address'}
              </Text>
              <Text style={styles.addressText}>
                {pickupAddress?.address || 'No address selected'}
              </Text>
            </View>
          </View>
        </Animatable.View>

        {/* Pickup Date & Time */}
        <Animatable.View animation="fadeInUp" duration={800} delay={500}>
          <Text style={styles.sectionTitle}>Pickup Date & Time</Text>
          
          {/* Date Picker */}
          <TouchableOpacity
            style={styles.dateTimeCard}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.8}
          >
            <Icon name="calendar" size={24} color={COLORS.gradientStart} />
            <View style={styles.dateTimeInfo}>
              <Text style={styles.dateTimeLabel}>Pickup Date</Text>
              <Text style={styles.dateTimeValue}>{formatDisplayDate(pickupDate)}</Text>
            </View>
            <Icon name="chevron-right" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>

          {/* Start Time Picker */}
          <TouchableOpacity
            style={styles.dateTimeCard}
            onPress={() => setShowStartTimePicker(true)}
            activeOpacity={0.8}
          >
            <Icon name="clock-time-four-outline" size={24} color={COLORS.gradientStart} />
            <View style={styles.dateTimeInfo}>
              <Text style={styles.dateTimeLabel}>Start Time</Text>
              <Text style={styles.dateTimeValue}>{formatDisplayTime(pickupStartTime)}</Text>
            </View>
            <Icon name="chevron-right" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>

          {/* End Time Picker */}
          <TouchableOpacity
            style={styles.dateTimeCard}
            onPress={() => setShowEndTimePicker(true)}
            activeOpacity={0.8}
          >
            <Icon name="clock-time-four-outline" size={24} color={COLORS.gradientStart} />
            <View style={styles.dateTimeInfo}>
              <Text style={styles.dateTimeLabel}>End Time</Text>
              <Text style={styles.dateTimeValue}>{formatDisplayTime(pickupEndTime)}</Text>
            </View>
            <Icon name="chevron-right" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </Animatable.View>

        {/* Payment Mode */}
        <Animatable.View animation="fadeInUp" duration={800} delay={600}>
          <Text style={styles.sectionTitle}>Payment Mode</Text>
          {paymentModes.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[
                styles.paymentCard,
                paymentMode === mode.id && styles.paymentCardSelected,
              ]}
              onPress={() => setPaymentMode(mode.id)}
              activeOpacity={0.8}
            >
              <View style={styles.paymentLeft}>
                <View style={styles.paymentIcon}>
                  <Icon name={mode.icon} size={24} color={COLORS.textPrimary} />
                </View>
                <Text style={styles.paymentName}>{mode.name}</Text>
              </View>
              <View style={[
                styles.radioOuter,
                paymentMode === mode.id && styles.radioOuterSelected
              ]}>
                {paymentMode === mode.id && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </Animatable.View>

        {/* Next Steps Info */}
        <Animatable.View animation="fadeInUp" duration={800} delay={700}>
          <Text style={styles.sectionTitle}>Next Steps</Text>
          <View style={styles.infoCard}>
            <Icon name="information-outline" size={24} color={COLORS.gradientStart} />
            <Text style={styles.infoText}>
              Once you confirm, we'll schedule a pickup within 24 hours. You'll receive a 
              notification with the exact pickup time. Please ensure the device is factory 
              reset and ready for collection.
            </Text>
          </View>
        </Animatable.View>
      </ScrollView>

      {/* Confirm Sale Button */}
      <Animatable.View
        animation="fadeInUp"
        duration={600}
        style={[
          styles.bottomButton,
          {
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleConfirmSale}
          activeOpacity={0.8}
          disabled={submitting || !userId}
        >
          <View style={styles.buttonWrapper}>
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <View style={styles.buttonContent}>
                {submitting ? (
                  <>
                    <ActivityIndicator size="small" color={COLORS.background} />
                    <Text style={[styles.buttonText, { marginLeft: 8 }]}>Submitting...</Text>
                  </>
                ) : (
                  <Text style={styles.buttonText}>Confirm Sale</Text>
                )}
              </View>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Animatable.View>

      {/* Date Pickers */}
      <DatePicker
        modal
        open={showDatePicker}
        date={pickupDate}
        mode="date"
        minimumDate={new Date()}
        onConfirm={(date) => {
          setShowDatePicker(false);
          setPickupDate(date);
        }}
        onCancel={() => setShowDatePicker(false)}
      />

      <DatePicker
        modal
        open={showStartTimePicker}
        date={pickupStartTime}
        mode="time"
        onConfirm={(date) => {
          setShowStartTimePicker(false);
          setPickupStartTime(date);
        }}
        onCancel={() => setShowStartTimePicker(false)}
      />

      <DatePicker
        modal
        open={showEndTimePicker}
        date={pickupEndTime}
        mode="time"
        onConfirm={(date) => {
          setShowEndTimePicker(false);
          setPickupEndTime(date);
        }}
        onCancel={() => setShowEndTimePicker(false)}
      />
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

  // Section Title
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },

  // Device Summary
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#3A3A3A',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  deviceImageWrapper: {
    width: 50,
    height: 60,
    backgroundColor: 'rgba(162, 162, 162, 0.48)',
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.xs,
    marginRight: SPACING.sm,
  },
  deviceImage: {
    width: '100%',
    height: '100%',
  },
  deviceSummaryInfo: {
    flex: 1,
  },
  deviceSummaryName: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  deviceSummaryCondition: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
  },

  // Price Card
  priceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3A3A3A',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  priceAmount: {
    fontSize: 28,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
  },
  priceCurrency: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.textSecondary,
  },

  // Address Card
  addressCard: {
    flexDirection: 'row',
    backgroundColor: '#3A3A3A',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  addressIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  addressInfo: {
    flex: 1,
  },
  addressTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  addressText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
  },

  // Date Time Cards
  dateTimeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A3A3A',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  dateTimeInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  dateTimeLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  dateTimeValue: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.textPrimary,
  },

  // Payment Cards
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3A3A3A',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentCardSelected: {
    borderColor: COLORS.gradientStart,
    backgroundColor: 'rgba(71, 220, 136, 0.1)',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  paymentName: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.textPrimary,
  },

  // Radio Button
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: COLORS.gradientStart,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.gradientStart,
  },

  // Info Card
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(71, 220, 136, 0.1)',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  infoText: {
    flex: 1,
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    lineHeight: 18,
  },

  // Bottom Button
  bottomButton: {
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
  buttonGradient: {
    width: '100%',
  },
  buttonContent: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.background,
  },
});

export default ConfirmSaleScreen;
