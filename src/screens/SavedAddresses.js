// screens/SavedAddresses.js
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZE,
  SPACING,
  BORDER_RADIUS,
} from '../utils';
import { CustomScreenHeader } from '../components/common';
import userApi from '../services/userApi';


const SavedAddresses = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const userId = 47;


  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAddress, setCurrentAddress] = useState({
    id: null,
    fullAddress: '',
    addressType: 'home',
    isDefault: false,
  });
  const [showDropdown, setShowDropdown] = useState(false);


  const addressTypes = ['home', 'work', 'other'];


  useEffect(() => {
    getAddress();
  }, []);


  const getAddress = async () => {
    try {
      setLoading(true);
      const response = await userApi.getAddresses(userId);
      console.log('response of addresses', response);
      if (response.success) {
        setAddresses(response.data);
      }
    } catch (error) {
      console.log('error while getting addresses', error);
    } finally {
      setLoading(false);
    }
  };


  const handleAddNew = () => {
    setEditMode(false);
    setCurrentAddress({
      id: null,
      fullAddress: '',
      addressType: 'home',
      isDefault: false,
    });
    setModalVisible(true);
  };


  const handleEdit = (address) => {
    setEditMode(true);
    setCurrentAddress({
      id: address.id,
      fullAddress: address.fullAddress,
      addressType: address.addressType,
      isDefault: address.isDefault === 1,
    });
    setModalVisible(true);
  };


  const handleSaveAddress = async () => {
    if (!currentAddress.fullAddress.trim()) {
      Alert.alert('Error', 'Please enter address');
      return;
    }


    try {
      let response;
      if (editMode) {
        // Update existing address
        response = await userApi.updateAddress({
          addressId: currentAddress.id,
          fullAddress: currentAddress.fullAddress,
          addressType: currentAddress.addressType,
          isDefault: currentAddress.isDefault,
        });
      } else {
        // Create new address
        response = await userApi.createAddress({
          userid: userId,
          fullAddress: currentAddress.fullAddress,
          addressType: currentAddress.addressType,
          isDefault: currentAddress.isDefault,
        });
      }


      if (response.success) {
        Alert.alert('Success', editMode ? 'Address updated' : 'Address added');
        setModalVisible(false);
        getAddress();
      } else {
        Alert.alert('Error', 'Failed to save address');
      }
    } catch (error) {
      console.log('error saving address', error);
      Alert.alert('Error', 'Failed to save address');
    }
  };


  const handleSetDefault = async (addressId) => {
    try {
      const response = await userApi.setDefaultAddress(addressId);
      if (response.success) {
        Alert.alert('Success', 'Default address updated');
        getAddress();
      } else {
        Alert.alert('Error', 'Failed to set default address');
      }
    } catch (error) {
      console.log('error setting default', error);
      Alert.alert('Error', 'Failed to set default address');
    }
  };


  const handleDelete = (addressId) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await userApi.deleteAddress(addressId);
              if (response.success) {
                Alert.alert('Success', 'Address deleted');
                getAddress();
              } else {
                Alert.alert('Error', 'Failed to delete address');
              }
            } catch (error) {
              console.log('error deleting address', error);
              Alert.alert('Error', 'Failed to delete address');
            }
          },
        },
      ]
    );
  };


  const getAddressIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'home':
        return 'home';
      case 'work':
        return 'briefcase';
      case 'other':
        return 'map-marker';
      default:
        return 'map-marker';
    }
  };


  // Calculate bottom padding including safe area
  const bottomPadding = Platform.OS === 'ios' 
    ? 100 + insets.bottom 
    : 100 + Math.max(insets.bottom, 0);


  const renderAddressCard = (address, index) => {
    const isDefault = address.isDefault === 1;


    return (
      <Animatable.View
        key={address.id}
        animation="fadeInUp"
        duration={600}
        delay={index * 100}
        style={styles.addressCard}
      >
        <View style={styles.cardLeft}>
          <View style={styles.iconWrapper}>
            <Icon
              name={getAddressIcon(address.addressType)}
              size={24}
              color={COLORS.textPrimary}
            />
          </View>
          <View style={styles.addressInfo}>
            <View style={styles.addressHeader}>
              <Text style={styles.addressTitle}>
                {address.addressType.charAt(0).toUpperCase() + address.addressType.slice(1)}
              </Text>
              {isDefault && (
                <View style={styles.defaultBadge}>
                  <Icon name="star" size={12} color={COLORS.gradientStart} />
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
            </View>
            <Text style={styles.addressText}>{address.fullAddress}</Text>
          </View>
        </View>


        <View style={styles.cardActions}>
          {!isDefault && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleSetDefault(address.id)}
              activeOpacity={0.7}
            >
              <Icon name="star-outline" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEdit(address)}
            activeOpacity={0.7}
          >
            <Icon name="pencil" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDelete(address.id)}
            activeOpacity={0.7}
          >
            <Icon name="delete" size={20} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </Animatable.View>
    );
  };


  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <CustomScreenHeader title="Saved Addresses" showBackButton={true} />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.gradientStart} />
        </View>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomScreenHeader
        title="Saved Addresses"
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
        {addresses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="map-marker-off" size={80} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No addresses saved</Text>
            <Text style={styles.emptySubText}>Add your first address to get started</Text>
          </View>
        ) : (
          <>
            {/* Group by address type */}
            {addressTypes.map((type) => {
              const typeAddresses = addresses.filter(
                (addr) => addr.addressType.toLowerCase() === type
              );
              if (typeAddresses.length === 0) return null;


              return (
                <View key={type} style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                  {typeAddresses.map((address, index) => renderAddressCard(address, index))}
                </View>
              );
            })}
          </>
        )}
      </ScrollView>


      {/* Add New Address Button */}
      <View
        style={[
          styles.bottomButton,
          {
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        <TouchableOpacity onPress={handleAddNew} activeOpacity={0.8}>
          <View style={styles.addButton}>
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addGradient}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.addButtonText}>Add New Address</Text>
              </View>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </View>


      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editMode ? 'Edit Address' : 'Add New Address'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>


            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Address Type Dropdown */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Address Type</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowDropdown(!showDropdown)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dropdownText}>
                    {currentAddress.addressType.charAt(0).toUpperCase() +
                      currentAddress.addressType.slice(1)}
                  </Text>
                  <Icon
                    name={showDropdown ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>


                {showDropdown && (
                  <View style={styles.dropdownList}>
                    {addressTypes.map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setCurrentAddress({ ...currentAddress, addressType: type });
                          setShowDropdown(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.dropdownItemText}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>


              {/* Full Address */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Full Address</Text>
                <TextInput
                  style={styles.textInput}
                  value={currentAddress.fullAddress}
                  onChangeText={(text) =>
                    setCurrentAddress({ ...currentAddress, fullAddress: text })
                  }
                  placeholder="Enter your full address"
                  placeholderTextColor={COLORS.textSecondary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>


              {/* Set as Default */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() =>
                  setCurrentAddress({
                    ...currentAddress,
                    isDefault: !currentAddress.isDefault,
                  })
                }
                activeOpacity={0.7}
              >
                <View style={styles.checkbox}>
                  {currentAddress.isDefault && (
                    <Icon name="check" size={16} color={COLORS.gradientStart} />
                  )}
                </View>
                <Text style={styles.checkboxText}>Set as default address</Text>
              </TouchableOpacity>
            </ScrollView>


            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>


              <TouchableOpacity onPress={handleSaveAddress} activeOpacity={0.8}>
                <View style={styles.saveModalButton}>
                  <LinearGradient
                    colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.saveModalGradient}
                  >
                    <View style={styles.buttonContent}>
                      <Text style={styles.saveModalButtonText}>
                        {editMode ? 'Update' : 'Save'}
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};


export default SavedAddresses;


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
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    flexGrow: 1,
  },


  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginTop: 100,
  },
  emptyText: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
  },
  emptySubText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },


  // Section
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },


  // Address Card
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#262626',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  cardLeft: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  addressInfo: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginRight: SPACING.xs,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(71, 220, 136, 0.1)',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
  },
  defaultText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.gradientStart,
    marginLeft: 2,
  },
  addressText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
  },
  cardActions: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
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
  addButton: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  addGradient: {
    width: '100%',
  },
  buttonContent: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.background,
  },


  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
  },


  // Form
  formGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#262626',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  dropdownText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textPrimary,
  },
  dropdownList: {
    backgroundColor: '#3A3A3A',
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.xs,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  dropdownItemText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textPrimary,
  },
  textInput: {
    backgroundColor: '#262626',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textPrimary,
    minHeight: 100,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.gradientStart,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  checkboxText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textPrimary,
  },


  // Modal Actions
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#3A3A3A',
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
  },
  saveModalButton: {
    flex: 1,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  saveModalGradient: {
    width: '100%',
  },
  saveModalButtonText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.background,
  },
});
