// screens/auth/SignInScreen.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
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
import { useDispatch } from 'react-redux';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '../utils';
import { Storage, StorageKeys } from '../utils/storage';
import { loginSuccess } from '../redux/authSlice';
import authApi from '../services/authApi';
import CustomToast from '../components/common/CustomToast';

const { height: screenHeight } = Dimensions.get('window');

const SignInScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

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

  const handleSignIn = async () => {
    // Validation
    if (!email || !password) {
      showToast('Please fill all fields', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email', 'error');
      return;
    }

    // Password validation
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email: email.toLowerCase().trim(),
        password: password,
      };

      const response = await authApi.Login(payload);

      if (response.success) {
        const userData = response.data;
        
        // Store user data in local storage
        await Storage.set(StorageKeys.IS_LOGGED_IN, true);
        await Storage.set(StorageKeys.USER_DATA, userData);
        
        // Dispatch login success to Redux
        dispatch(loginSuccess(userData));

        // Show success toast
        showToast('Login successful!', 'success');

        // Navigate to MainTab after a short delay
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTab' }],
          });
        }, 1000);
      } else {
        showToast(response.msg || 'Login failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
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

      {/* Main Content with Keyboard Handling */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <LinearGradient
          colors={['#47DC88', '#37D9B4', '#27D4E4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          angle={89.3}
          style={[
            styles.gradientContainer,
            keyboardVisible && styles.gradientContainerKeyboard
          ]}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <Animatable.View animation="slideInUp" duration={800} delay={200} style={styles.content}>
              <View style={styles.contentPadding}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>
                  "Empowering smarter exchanges,{'\n'}
                  Because every device deserves a second chance."
                </Text>

                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter email"
                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                  />
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Password"
                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
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

                {/* Remember Me & Forgot Password */}
                <View style={styles.rememberRow}>
                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => setRememberMe(!rememberMe)}
                    activeOpacity={0.7}
                    disabled={loading}
                  >
                    <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                      {rememberMe && <Icon name="check" size={14} color="#FFFFFF" />}
                    </View>
                    <Text style={styles.rememberText}>Remember me</Text>
                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={0.7} disabled={loading}>
                    <Text style={styles.forgotText}>Forgot password?</Text>
                  </TouchableOpacity>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                  style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                  onPress={handleSignIn}
                  activeOpacity={0.8}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={COLORS.background} size="small" />
                  ) : (
                    <Text style={styles.loginButtonText}>Log in</Text>
                  )}
                </TouchableOpacity>

                {/* Sign Up Link */}
                <View style={styles.signUpRow}>
                  <Text style={styles.signUpText}>Don't have an account? </Text>
                  <TouchableOpacity 
                    onPress={() => navigation.navigate('SignUp')}
                    disabled={loading}
                  >
                    <Text style={styles.signUpLink}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animatable.View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;

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
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  gradientContainer: {
    maxHeight: screenHeight * 0.82,
    borderTopLeftRadius: 41,
    borderTopRightRadius: 41,
  },
  gradientContainerKeyboard: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  content: {
    flex: 1,
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
  inputContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
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
  rememberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.background,
    marginRight: SPACING.xs,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: COLORS.background,
  },
  rememberText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.background,
  },
  forgotText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.background,
  },
  loginButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.background,
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  signUpText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.background,
  },
  signUpLink: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.background,
    textDecorationLine: 'underline',
  },
});
