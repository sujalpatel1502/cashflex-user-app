// screens/PickupAddressScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
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
import addressApi from '../services/addressApi';

const PickupAddressScreen = ({ route }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);

  const [userId, setUserId] = useState(null);
  const [region, setRegion] = useState({
    latitude: 23.0225,
    longitude: 72.5714,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (userId) {
      loadAddresses();
    }
  }, [userId]);

  const loadUserData = async () => {
    try {
      const userData = await Storage.get(StorageKeys.USER_DATA);
      if (userData && userData.id) {
        setUserId(userData.id);
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await addressApi.getAllAddresses(userId);
      console.log('Addresses response:', response);
      
      if (response.success && response.data) {
        // Transform API data to match our UI format
        const transformedAddresses = response.data.map(addr => ({
          id: addr.id,
          type: addr.addressType === 'home' ? 'Home' : addr.addressType === 'work' ? 'Work' : 'Other',
          address: addr.fullAddress,
          icon: addr.addressType === 'home' ? 'home-outline' : 
                addr.addressType === 'work' ? 'briefcase-outline' : 'map-marker-outline',
          isDefault: addr.isDefault === 1,
        }));
        setSavedAddresses(transformedAddresses);
      }
    } catch (error) {
      console.log('Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location for pickup scheduling',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        }
      } else {
        const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (result === RESULTS.GRANTED) {
          getCurrentLocation();
        } else if (result === RESULTS.DENIED) {
          const requestResult = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
          if (requestResult === RESULTS.GRANTED) {
            getCurrentLocation();
          }
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const newRegion = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
      },
      (error) => {
        console.log('Error getting location:', error);
        Alert.alert('Error', 'Unable to get current location');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleUseCurrentLocation = () => {
    getCurrentLocation();
    setSelectedAddress({
      id: null, // No ID for current location
      type: 'Current Location',
      address: 'Using current GPS location',
      coordinates: region,
    });
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  const handleContinue = () => {
    if (!selectedAddress) {
      Alert.alert('Select Address', 'Please select a pickup address to continue');
      return;
    }

    navigation.navigate('ConfirmSale', {
      ...route.params,
      pickupAddress: selectedAddress,
    });
  };

  // Calculate bottom padding including safe area
  const bottomPadding = Platform.OS === 'ios' 
    ? 100 + insets.bottom 
    : 100 + Math.max(insets.bottom, 0);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <CustomScreenHeader
          title="Pickup Address"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.gradientStart} />
          <Text style={styles.loaderText}>Loading addresses...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomScreenHeader
        title="Pickup Address"
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
        {/* Map */}
        <Animatable.View animation="fadeIn" duration={800} style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
          >
            <Marker coordinate={region} />
          </MapView>
        </Animatable.View>

        {/* Search Bar */}
        <Animatable.View animation="fadeInUp" duration={800} delay={200}>
          <View style={styles.searchContainer}>
            <Icon name="magnify" size={22} color={COLORS.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for address"
              placeholderTextColor={COLORS.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </Animatable.View>

        {/* Or Choose an Address */}
        <Animatable.View animation="fadeInUp" duration={800} delay={400}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Or choose an address</Text>
            <TouchableOpacity 
              style={styles.newAddressButton}
              onPress={() => navigation.navigate('SavedAddresses')}
            >
              <Text style={styles.newAddressText}>New Address</Text>
              <Icon name="plus" size={18} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
        </Animatable.View>

        {/* Use Current Location */}
        <Animatable.View animation="fadeInUp" duration={800} delay={500}>
          <TouchableOpacity
            style={[
              styles.addressCard,
              styles.currentLocationCard,
              selectedAddress?.type === 'Current Location' && styles.addressCardSelected,
            ]}
            onPress={handleUseCurrentLocation}
            activeOpacity={0.8}
          >
            <View style={styles.addressLeft}>
              <View style={[styles.addressIcon, styles.currentLocationIcon]}>
                <Icon name="crosshairs-gps" size={24} color={COLORS.gradientStart} />
              </View>
              <Text style={styles.currentLocationText}>Use current location</Text>
            </View>
            <View style={[
              styles.radioOuter,
              selectedAddress?.type === 'Current Location' && styles.radioOuterSelected
            ]}>
              {selectedAddress?.type === 'Current Location' && (
                <View style={styles.radioInner} />
              )}
            </View>
          </TouchableOpacity>
        </Animatable.View>

        {/* Saved Addresses */}
        {savedAddresses.length === 0 ? (
          <Animatable.View animation="fadeInUp" duration={800} delay={600}>
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No saved addresses</Text>
              <Text style={styles.emptySubText}>Add an address to get started</Text>
            </View>
          </Animatable.View>
        ) : (
          savedAddresses.map((address, index) => (
            <Animatable.View
              key={address.id}
              animation="fadeInUp"
              duration={800}
              delay={600 + index * 100}
            >
              <TouchableOpacity
                style={[
                  styles.addressCard,
                  selectedAddress?.id === address.id && styles.addressCardSelected,
                ]}
                onPress={() => handleSelectAddress(address)}
                activeOpacity={0.8}
              >
                <View style={styles.addressLeft}>
                  <View style={styles.addressIcon}>
                    <Icon name={address.icon} size={24} color={COLORS.textPrimary} />
                  </View>
                  <View style={styles.addressInfo}>
                    <Text style={styles.addressType}>{address.type}</Text>
                    <Text style={styles.addressText}>{address.address}</Text>
                  </View>
                </View>
                <View style={[
                  styles.radioOuter,
                  selectedAddress?.id === address.id && styles.radioOuterSelected
                ]}>
                  {selectedAddress?.id === address.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </TouchableOpacity>
            </Animatable.View>
          ))
        )}
      </ScrollView>

      {/* Continue Button */}
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
          onPress={handleContinue}
          activeOpacity={0.8}
          disabled={!selectedAddress}
        >
          <View style={styles.buttonWrapper}>
            <LinearGradient
              colors={
                selectedAddress
                  ? [COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]
                  : ['#4A4A4A', '#3A3A3A']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Continue</Text>
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Map
  mapContainer: {
    height: 250,
    margin: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A3A3A',
    marginHorizontal: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
    paddingVertical: 0,
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
  },
  newAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  newAddressText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textPrimary,
  },

  // Address Cards
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3A3A3A',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  currentLocationCard: {
    backgroundColor: 'rgba(71, 220, 136, 0.1)',
  },
  addressCardSelected: {
    borderColor: COLORS.gradientStart,
  },
  addressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  currentLocationIcon: {
    backgroundColor: 'rgba(71, 220, 136, 0.2)',
  },
  addressInfo: {
    flex: 1,
  },
  addressType: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  addressText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
  },
  currentLocationText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.gradientStart,
  },

  // Empty State
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  emptySubText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
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
  },
  buttonText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.background,
  },
});

export default PickupAddressScreen;
