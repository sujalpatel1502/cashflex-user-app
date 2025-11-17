// screens/EditProfile.js
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Platform,
  Alert,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
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
import authApi from '../services/authApi';
import CustomToast from '../components/common/CustomToast';

const EditProfile = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const [user, setUser] = useState({
    id: null,
    first_name: '',
    last_name: '',
    contactNumber: '',
    email: '',
    pincode: '',
    avatar: null,
  });

  const [loading, setLoading] = useState(false);

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    const getUserData = async () => {
      const userData = await Storage.get(StorageKeys.USER_DATA);
      if (userData) {
        console.log("userData in edit profile", userData);
        setUser({
          id: userData.id || null,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          contactNumber: userData.contactNumber?.toString() || '',
          email: userData.email || '',
          pincode: userData.pincode?.toString() || '',
          avatar: userData.avatar || null,
        });
      }
    };
    
    getUserData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  // Request Camera Permission for Both Platforms
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission to take photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      const result = await check(PERMISSIONS.IOS.CAMERA);
      if (result === RESULTS.GRANTED) {
        return true;
      } else if (result === RESULTS.DENIED) {
        const requestResult = await request(PERMISSIONS.IOS.CAMERA);
        return requestResult === RESULTS.GRANTED;
      }
      return false;
    }
  };

  // Request Gallery Permission
  const requestGalleryPermission = async () => {
    if (Platform.OS === 'android') {
      const androidVersion = Platform.Version;
      const permission = androidVersion >= 33 
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

      try {
        const granted = await PermissionsAndroid.request(permission, {
          title: 'Gallery Permission',
          message: 'App needs gallery permission to select photos',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        });
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      const result = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (result === RESULTS.GRANTED) {
        return true;
      } else if (result === RESULTS.DENIED) {
        const requestResult = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        return requestResult === RESULTS.GRANTED;
      }
      return false;
    }
  };

  // Handle Camera/Gallery Selection
  const handleImagePicker = () => {
    Alert.alert(
      'Select Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: handleTakePhoto,
        },
        {
          text: 'Choose from Gallery',
          onPress: handleChoosePhoto,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  // Take Photo with Camera
  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      showToast('Camera permission is required to take photos', 'error');
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: true,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorMessage);
        showToast('Failed to open camera', 'error');
      } else if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri;
        setUser({ ...user, avatar: imageUri });
      }
    });
  };

  // Choose Photo from Gallery
  const handleChoosePhoto = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      showToast('Gallery permission is required to select photos', 'error');
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        showToast('Failed to open gallery', 'error');
      } else if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri;
        setUser({ ...user, avatar: imageUri });
      }
    });
  };

  // Handle Save Changes
  const handleSaveChanges = async () => {
    // Validation
    if (!user.first_name || !user.last_name || !user.email || !user.contactNumber || !user.pincode) {
      showToast('Please fill all fields', 'error');
      return;
    }

    // Phone validation
    if (user.contactNumber.length !== 10) {
      showToast('Please enter a valid 10-digit phone number', 'error');
      return;
    }

    // Pincode validation
    if (user.pincode.length !== 6) {
      showToast('Please enter a valid 6-digit pincode', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      showToast('Please enter a valid email', 'error');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        id: user.id,
        first_name: user.first_name.trim(),
        last_name: user.last_name.trim(),
        email: user.email.toLowerCase().trim(),
        contactNumber: parseInt(user.contactNumber),
        pincode: parseInt(user.pincode),
      };

      console.log('Updating user with payload:', payload);

      const response = await authApi.UpdateUser(user.id, payload);

      if (response.success) {
        // Update local storage
        const updatedUserData = {
          ...user,
          contactNumber: parseInt(user.contactNumber),
          pincode: parseInt(user.pincode),
        };
        await Storage.set(StorageKeys.USER_DATA, updatedUserData);

        showToast('Profile updated successfully!', 'success');
        
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      } else {
        showToast(response.msg || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Calculate bottom padding including safe area
  const bottomPadding = Platform.OS === 'ios' 
    ? 100 + insets.bottom 
    : 100 + Math.max(insets.bottom, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Custom Toast */}
      <CustomToast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />

      <CustomScreenHeader
        title="Edit Profile"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding }
        ]}
      >
        {/* Profile Photo */}
        <Animatable.View animation="fadeInDown" duration={800} delay={200}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Icon name="account" size={60} color={COLORS.textPrimary} />
                </View>
              )}
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={handleImagePicker}
                activeOpacity={0.8}
              >
                <Icon name="camera" size={20} color={COLORS.background} />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>
              {user.first_name} {user.last_name}
            </Text>
          </View>
        </Animatable.View>

        {/* Form Fields */}
        <Animatable.View animation="fadeInUp" duration={800} delay={400}>
          {/* First Name Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>First Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={user.first_name}
                onChangeText={(text) => setUser({ ...user, first_name: text })}
                placeholder="Enter your first name"
                placeholderTextColor={COLORS.textSecondary}
                editable={!loading}
              />
            </View>
          </View>

          {/* Last Name Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Last Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={user.last_name}
                onChangeText={(text) => setUser({ ...user, last_name: text })}
                placeholder="Enter your last name"
                placeholderTextColor={COLORS.textSecondary}
                editable={!loading}
              />
            </View>
          </View>

          {/* Email Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={user.email}
                onChangeText={(text) => setUser({ ...user, email: text })}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>
          </View>

          {/* Phone Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={user.contactNumber}
                onChangeText={(text) => setUser({ ...user, contactNumber: text })}
                placeholder="Enter your phone number"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="phone-pad"
                maxLength={10}
                editable={!loading}
              />
            </View>
          </View>

          {/* Pincode Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Pincode</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={user.pincode}
                onChangeText={(text) => setUser({ ...user, pincode: text })}
                placeholder="Enter your pincode"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="number-pad"
                maxLength={6}
                editable={!loading}
              />
            </View>
          </View>
        </Animatable.View>
      </ScrollView>

      {/* Save Button */}
      <View style={[
        styles.bottomButton,
        {
          paddingBottom: Math.max(insets.bottom, 16),
        }
      ]}>
        <TouchableOpacity onPress={handleSaveChanges} activeOpacity={0.8} disabled={loading}>
          <View style={styles.saveButton}>
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveGradient}
            >
              <View style={styles.buttonContent}>
                {loading ? (
                  <ActivityIndicator color={COLORS.background} size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Change</Text>
                )}
              </View>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    flexGrow: 1,
  },

  // Avatar Section
  avatarSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3A3A3A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.gradientStart,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.gradientStart,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  userName: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },

  // Form Fields
  formGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    backgroundColor: '#262626',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
  },
  input: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.md,
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
  saveButton: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  saveGradient: {
    width: '100%',
  },
  buttonContent: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.background,
  },
});
