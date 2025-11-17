// screens/auth/OTPVerificationScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '../utils';
import authApi from '../services/authApi';
import CustomToast from '../components/common/CustomToast';

const OTPVerificationScreen = ({ navigation, route }) => {
  const { email, phone, isSignUp, userData } = route.params || {};
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = async () => {
    if (timer > 0) return;

    setLoading(true);
    try {
      const payload = { email };
      const response = await authApi.VerifyNewEmail(payload);

      if (response.success) {
        setTimer(60);
        showToast('OTP has been resent to your email', 'success');
      } else {
        showToast(response.msg || 'Failed to resend OTP', 'error');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      showToast('Please enter complete OTP', 'error');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp && userData) {
        // Sign up flow - create user with OTP
        const payload = {
          ...userData,
          otp: otpCode,
        };

        console.log('Creating user with payload:', payload);

        const response = await authApi.AddUser(payload);

        if (response.success) {
          showToast('Account created successfully!', 'success');
          
          // Navigate to SignIn after a short delay
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'SignIn' }],
            });
          }, 1500);
        } else {
          showToast(response.msg || 'Failed to create account. Please check your OTP.', 'error');
        }
      } else {
        // Login flow (if needed in future)
        showToast('OTP verified successfully!', 'success');
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
          });
        }, 1500);
      }
    } catch (error) {
      console.error('Verification error:', error);
      showToast('Verification failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
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

      {/* Decorative Curves - Top Right */}
      <View style={styles.curvesTopRight}>
        <View style={[styles.curve, styles.curve1]} />
        <View style={[styles.curve, styles.curve2]} />
        <View style={[styles.curve, styles.curve3]} />
        <View style={[styles.curve, styles.curve4]} />
        <View style={[styles.curve, styles.curve5]} />
        <View style={[styles.curve, styles.curve6]} />
        <View style={[styles.curve, styles.curve7]} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Title */}
          <Animatable.View animation="fadeInDown" duration={800} delay={200}>
            <Text style={styles.title}>OTP Verification</Text>
          </Animatable.View>

          {/* Description */}
          <Animatable.View animation="fadeInUp" duration={800} delay={400}>
            <Text style={styles.description}>
              Please Enter The 6 Digit Code Sent To{'\n'}
              {email}
            </Text>
          </Animatable.View>

          {/* OTP Input - 6 digits */}
          <Animatable.View animation="fadeInUp" duration={800} delay={600} style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <View
                key={index}
                style={[
                  styles.otpBox,
                  digit && styles.otpBoxFilled,
                ]}
              >
                <TextInput
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  editable={!loading}
                />
              </View>
            ))}
          </Animatable.View>

          {/* Resend Code */}
          <Animatable.View animation="fadeInUp" duration={800} delay={800}>
            <TouchableOpacity
              onPress={handleResendCode}
              disabled={timer > 0 || loading}
              activeOpacity={0.7}
            >
              <Text style={[styles.resendText, timer === 0 && !loading && styles.resendActive]}>
                {timer > 0 ? `Resend Code (${timer}s)` : 'Resend Code'}
              </Text>
            </TouchableOpacity>
          </Animatable.View>

          {/* Verify Button */}
          <Animatable.View animation="fadeInUp" duration={800} delay={1000} style={styles.buttonContainer}>
            <TouchableOpacity 
              onPress={handleVerify} 
              activeOpacity={0.8}
              disabled={loading}
            >
              <View style={styles.verifyButton}>
                <LinearGradient
                  colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.verifyGradient}
                >
                  <View style={styles.verifyContent}>
                    {loading ? (
                      <ActivityIndicator color={COLORS.background} size="small" />
                    ) : (
                      <Text style={styles.verifyButtonText}>Verify</Text>
                    )}
                  </View>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </ScrollView>

      {/* Decorative Curves - Bottom Left */}
      <View style={styles.curvesBottomLeft}>
        <View style={[styles.curve, styles.curve1]} />
        <View style={[styles.curve, styles.curve2]} />
        <View style={[styles.curve, styles.curve3]} />
        <View style={[styles.curve, styles.curve4]} />
        <View style={[styles.curve, styles.curve5]} />
        <View style={[styles.curve, styles.curve6]} />
        <View style={[styles.curve, styles.curve7]} />
      </View>
    </SafeAreaView>
  );
};

export default OTPVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xxl,
  },
  
  // Top Right Curves
  curvesTopRight: {
    position: 'absolute',
    top: -130,
    right: -130,
    width: 300,
    height: 300,
  },
  
  // Bottom Left Curves
  curvesBottomLeft: {
    position: 'absolute',
    bottom: -130,
    left: -130,
    width: 300,
    height: 300,
  },
  
  curve: {
    position: 'absolute',
    borderRadius: 250,
    borderWidth: 5,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  
  curve1: {
    width: 140,
    height: 140,
    top: 110,
    left: 110,
  },
  
  curve2: {
    width: 170,
    height: 170,
    top: 95,
    left: 95,
  },
  
  curve3: {
    width: 200,
    height: 200,
    top: 80,
    left: 80,
  },
  
  curve4: {
    width: 230,
    height: 230,
    top: 65,
    left: 65,
  },
  
  curve5: {
    width: 260,
    height: 260,
    top: 50,
    left: 50,
  },
  
  curve6: {
    width: 290,
    height: 290,
    top: 35,
    left: 35,
  },
  
  curve7: {
    width: 320,
    height: 320,
    top: 20,
    left: 20,
  },
  
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  backText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textPrimary,
    marginLeft: SPACING.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
    minHeight: 600,
  },
  title: {
    fontSize: 40,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.gradientStart,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: SPACING.xl,
    paddingHorizontal: 0,
  },
  otpBox: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#27D4E4',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#37D9B4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 13,
    elevation: 8,
  },
  otpBoxFilled: {
    backgroundColor: '#FFFFFF',
    borderColor: '#27D4E4',
  },
  otpInput: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.background,
    textAlign: 'center',
    width: '100%',
  },
  resendText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    textDecorationLine: 'underline',
  },
  resendActive: {
    color: COLORS.gradientStart,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  
  // Verify Button
  verifyButton: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  verifyGradient: {
    width: '100%',
  },
  verifyContent: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButtonText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.background,
  },
});
