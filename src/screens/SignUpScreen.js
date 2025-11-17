// screens/auth/SignUpScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
  ScrollView,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '../utils';
import authApi from '../services/authApi';
import CustomToast from '../components/common/CustomToast';

const { height: screenHeight } = Dimensions.get('window');

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const scrollViewRef = useRef(null);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handlePasswordFocus = () => {
    setTimeout(() => {
      passwordInputRef.current?.measure((fx, fy, width, height, px, py) => {
        const scrollPosition = py + height - (screenHeight - 250);
        scrollViewRef.current?.scrollTo({
          y: scrollPosition > 0 ? scrollPosition : 0,
          animated: true,
        });
      });
    }, 300);
  };

  const handleSignUp = async () => {
    // Validation
    if (!firstName || !lastName || !email || !phone || !address || !city || !pincode || !password || !confirmPassword) {
      showToast('Please fill all fields', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email', 'error');
      return;
    }

    // Phone validation
    if (phone.length !== 10) {
      showToast('Please enter a valid 10-digit phone number', 'error');
      return;
    }

    // Pincode validation
    if (pincode.length !== 6) {
      showToast('Please enter a valid 6-digit pincode', 'error');
      return;
    }

    // Password validation
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email: email.toLowerCase().trim(),
      };

      const response = await authApi.VerifyNewEmail(payload);

      if (response.success) {
        showToast(response.msg || 'Verification code sent!', 'success');

        // Navigate to OTP screen with all user data
        setTimeout(() => {
          navigation.navigate('OTPVerification', {
            email: email.toLowerCase().trim(),
            phone,
            isSignUp: true,
            userData: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              email: email.toLowerCase().trim(),
              contactNumber: phone,
              address: address.trim(),
              city: city.trim(),
              pincode: pincode,
              password: password,
              confirmpassword: confirmPassword,
            },
          });
        }, 1000);
      } else {
        showToast(response.msg || 'Failed to send verification code', 'error');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    showToast('Google authentication will be implemented', 'info');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Custom Toast */}
      <CustomToast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />

      {/* Back Button Section */}
      <View style={styles.topSection}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContainer}>
        <LinearGradient
          colors={['#47DC88', '#37D9B4', '#27D4E4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          angle={89.3}
          style={styles.gradientContainer}
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={true}
          >
            <Animatable.View animation="slideInUp" duration={800} delay={200}>
              <View style={styles.contentPadding}>
                <Text style={styles.title}>Create Your Account</Text>
                <Text style={styles.subtitle}>
                  "Create your account today,{'\n'}
                  And unlock a world of trusted tech deals."
                </Text>

                {/* First Name & Last Name Row */}
                <View style={styles.inputRow}>
                  <View style={styles.inputContainerHalf}>
                    <TextInput
                      style={styles.input}
                      placeholder="First Name"
                      placeholderTextColor="rgba(255, 255, 255, 0.7)"
                      value={firstName}
                      onChangeText={setFirstName}
                      editable={!loading}
                    />
                  </View>
                  <View style={styles.inputContainerHalf}>
                    <TextInput
                      style={styles.input}
                      placeholder="Last Name"
                      placeholderTextColor="rgba(255, 255, 255, 0.7)"
                      value={lastName}
                      onChangeText={setLastName}
                      editable={!loading}
                    />
                  </View>
                </View>

                {/* Email & Phone Row */}
                <View style={styles.inputRow}>
                  <View style={styles.inputContainerHalf}>
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor="rgba(255, 255, 255, 0.7)"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={!loading}
                    />
                  </View>
                  <View style={styles.inputContainerHalf}>
                    <TextInput
                      style={styles.input}
                      placeholder="Mobile"
                      placeholderTextColor="rgba(255, 255, 255, 0.7)"
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                      maxLength={10}
                      editable={!loading}
                    />
                  </View>
                </View>

                {/* City & Pincode Row */}
                <View style={styles.inputRow}>
                  <View style={styles.inputContainerHalf}>
                    <TextInput
                      style={styles.input}
                      placeholder="City"
                      placeholderTextColor="rgba(255, 255, 255, 0.7)"
                      value={city}
                      onChangeText={setCity}
                      editable={!loading}
                    />
                  </View>
                  <View style={styles.inputContainerHalf}>
                    <TextInput
                      style={styles.input}
                      placeholder="Pincode"
                      placeholderTextColor="rgba(255, 255, 255, 0.7)"
                      value={pincode}
                      onChangeText={setPincode}
                      keyboardType="number-pad"
                      maxLength={6}
                      editable={!loading}
                    />
                  </View>
                </View>

                {/* Address Input - Full Width */}
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Address"
                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                    value={address}
                    onChangeText={setAddress}
                    editable={!loading}
                  />
                </View>

                {/* Password & Confirm Password Row */}
                <View style={styles.inputRow}>
                  <View style={styles.inputContainerHalf}>
                    <TextInput
                      ref={passwordInputRef}
                      style={[styles.input, styles.passwordInput]}
                      placeholder="Password"
                      placeholderTextColor="rgba(255, 255, 255, 0.7)"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      onFocus={handlePasswordFocus}
                      editable={!loading}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Icon
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color="#FFFFFF"
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputContainerHalf}>
                    <TextInput
                      style={[styles.input, styles.passwordInput]}
                      placeholder="Confirm Password"
                      placeholderTextColor="rgba(255, 255, 255, 0.7)"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      editable={!loading}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Icon
                        name={showConfirmPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color="#FFFFFF"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Sign Up Button */}
                <TouchableOpacity
                  style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
                  onPress={handleSignUp}
                  activeOpacity={0.8}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={COLORS.background} size="small" />
                  ) : (
                    <Text style={styles.signUpButtonText}>Sign up</Text>
                  )}
                </TouchableOpacity>

                {/* Divider */}


                {/* Sign In Link */}
                <View style={styles.signInRow}>
                  <Text style={styles.signInText}>Already have an account? </Text>
                  <TouchableOpacity 
                    onPress={() => navigation.navigate('SignIn')}
                    disabled={loading}
                  >
                    <Text style={styles.signInLink}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animatable.View>

            {/* Extra bottom padding for keyboard */}
            {keyboardVisible && <View style={{ height: 250 }} />}
          </ScrollView>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topSection: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textPrimary,
    marginLeft: SPACING.xs,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  gradientContainer: {
    maxHeight: screenHeight * 0.82,
    borderTopLeftRadius: 41,
    borderTopRightRadius: 41,
  },
  scrollContent: {
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  contentPadding: {
    paddingHorizontal: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.background,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: 'rgba(0, 0, 0, 0.7)',
    marginBottom: SPACING.lg,
    lineHeight: 20,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  inputContainerHalf: {
    position: 'relative',
    flex: 1,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: SPACING.md,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  signUpButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  signUpButtonDisabled: {
    opacity: 0.7,
  },
  signUpButtonText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.background,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  dividerText: {
    marginHorizontal: SPACING.sm,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.background,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  signInText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.background,
  },
  signInLink: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.background,
    textDecorationLine: 'underline',
  },
});
