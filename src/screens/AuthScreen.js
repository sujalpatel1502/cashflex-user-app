import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { useDispatch } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomButton, CustomInput, CustomToast } from '../components/common';
import { loginSuccess, skipLogin } from '../redux/authSlice';
import { Storage, StorageKeys } from '../utils/storage';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '../utils';
import Logo from '../assets/images/Logo.png';
import Google from '../assets/images/Google.png';

const { height: screenHeight } = Dimensions.get('window');

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ visible: false, message: '', type: 'success' });
  };

  const handleAuth = async () => {
    if (!formData.email || !formData.password) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    if (!isLogin && (!formData.name || !formData.phone)) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const userData = {
        id: Date.now(),
        email: formData.email,
        name: formData.name || 'User',
        phone: formData.phone || '',
        loginMethod: 'email',
      };

      await Storage.set(StorageKeys.IS_LOGGED_IN, true);
      await Storage.set(StorageKeys.USER_DATA, userData);
      
      dispatch(loginSuccess(userData));
      showToast(`${isLogin ? 'Login' : 'Sign Up'} successful!`, 'success');
      
      setTimeout(() => {
        navigation.replace('MainTab');
      }, 1000);
    } catch (error) {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Simulate Google login
      const userData = {
        id: Date.now(),
        email: 'user@gmail.com',
        name: 'Google User',
        phone: '',
        loginMethod: 'google',
      };

      await Storage.set(StorageKeys.IS_LOGGED_IN, true);
      await Storage.set(StorageKeys.USER_DATA, userData);
      
      dispatch(loginSuccess(userData));
      showToast('Google login successful!', 'success');
      
      setTimeout(() => {
        navigation.replace('MainTab');
      }, 1000);
    } catch (error) {
      showToast('Google login failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    try {
      await Storage.set(StorageKeys.SKIP_LOGIN, true);
      dispatch(skipLogin());
      showToast('Welcome! You can login anytime.', 'info');
      setTimeout(() => {
        navigation.replace('MainTab');
      }, 800);
    } catch (error) {
      showToast('Something went wrong. Please try again.', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Skip Button - Top Right */}
      <Animatable.View animation="fadeInRight" duration={1000} delay={500} style={styles.skipContainer}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.8}>
          <Text style={styles.skipText}>Skip</Text>
          <Icon name="arrow-right" size={18} color={COLORS.gradientStart} />
        </TouchableOpacity>
      </Animatable.View>

      <KeyboardAvoidingView 
        style={styles.keyboardContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
        >
          {/* Logo Section */}
          <Animatable.View animation="bounceIn" duration={1200} style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logoBackground}>
                <Image source={Logo} style={styles.logo} resizeMode="contain" />
              </View>
            </View>
            <Animatable.Text 
              animation="fadeInUp" 
              delay={800}
              style={styles.welcomeText}
            >
              Welcome to Cashflex
            </Animatable.Text>
            <Animatable.Text 
              animation="fadeInUp" 
              delay={1000}
              style={styles.subtitle}
            >
              Buy & Sell Refurbished Electronics
            </Animatable.Text>
          </Animatable.View>

          {/* Auth Form */}
          <Animatable.View animation="slideInUp" duration={1000} delay={300} style={styles.formSection}>
            {/* Tab Selector */}
            <View style={styles.tabContainer}>
              <View style={styles.tabSelector}>
                <TouchableOpacity
                  style={[styles.tab, isLogin && styles.activeTab]}
                  onPress={() => setIsLogin(true)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabText, isLogin && styles.activeTabText]}>
                    Login
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, !isLogin && styles.activeTab]}
                  onPress={() => setIsLogin(false)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Form Fields */}
            <View style={styles.form}>
              <Animatable.View 
                animation={isLogin ? "fadeIn" : "slideInRight"} 
                duration={500}
                key={isLogin ? 'login' : 'signup'}
              >
                {!isLogin && (
                  <CustomInput
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChangeText={(value) => handleInputChange('name', value)}
                    leftIcon="account"
                  />
                )}

                <CustomInput
                  label="Email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  leftIcon="email"
                  autoCapitalize="none"
                />

                {!isLogin && (
                  <CustomInput
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChangeText={(value) => handleInputChange('phone', value)}
                    keyboardType="phone-pad"
                    leftIcon="phone"
                  />
                )}

                <CustomInput
                  label="Password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry
                  leftIcon="lock"
                />

                {/* Forgot Password for Login */}
                {isLogin && (
                  <TouchableOpacity style={styles.forgotPassword} activeOpacity={0.7}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>
                )}
              </Animatable.View>

              {/* Auth Button */}
              <CustomButton
                title={isLogin ? 'Login' : 'Create Account'}
                onPress={handleAuth}
                style={styles.authButton}
                gradient
                disabled={loading}
              />

              {/* Divider - REDUCED SPACING */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google Login - REDUCED SPACING */}
              <TouchableOpacity 
                style={styles.googleButton} 
                onPress={handleGoogleLogin}
                activeOpacity={0.8}
                disabled={loading}
              >
                <Image source={Google} style={styles.googleIcon} />
                <Text style={styles.googleButtonText}>
                  Google
                </Text>
              </TouchableOpacity>

              {/* Terms and Privacy */}
              {!isLogin && (
                <Animatable.View animation="fadeInUp" delay={600} style={styles.termsContainer}>
                  <Text style={styles.termsText}>
                    By signing up, you agree to our{' '}
                    <Text style={styles.termsLink}>Terms of Service</Text>
                    {' '}and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                  </Text>
                </Animatable.View>
              )}
            </View>
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  skipContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 35,
    right: SPACING.lg,
    zIndex: 1000,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: `${COLORS.gradientStart}10`,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: `${COLORS.gradientStart}30`,
  },
  skipText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.gradientStart,
    marginRight: SPACING.xs,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg, 
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: SPACING.lg, 
  },
  logoContainer: {
    marginBottom: SPACING.md, 
  },
  logoBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.gradientEnd,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.gradientStart,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: 70,
    height: 70,
  },
  welcomeText: {
    fontSize: FONT_SIZE.xxl,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  formSection: {
    flex: 1,
  },
  tabContainer: {
    marginBottom: SPACING.lg, 
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
  },
  activeTab: {
    backgroundColor: COLORS.gradientStart,
    shadowColor: COLORS.gradientStart,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.textWhite,
  },
  form: {
    flex: 1,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.md, 
    marginTop: -SPACING.xs,
  },
  forgotPasswordText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.gradientStart,
  },
  authButton: {
    // marginTop: SPACING.xs, 
    // marginBottom: SPACING.xs, 
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textLight,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: SPACING.md, // REDUCED from SPACING.lg
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: SPACING.sm,
  },
  googleButtonText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textPrimary,
  },
  termsContainer: {
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.md, // REDUCED from SPACING.lg
  },
  termsText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.gradientStart,
    fontFamily: FONT_FAMILY.medium,
  }
});

export default AuthScreen;
