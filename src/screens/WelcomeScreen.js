// screens/auth/WelcomeScreen.js
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '../utils';

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Decorative Curves - Top Right - Multiple Thin Circles (Half Visible) */}
      <View style={styles.curvesTopRight}>
        <View style={[styles.curve, styles.curve1]} />
        <View style={[styles.curve, styles.curve2]} />
        <View style={[styles.curve, styles.curve3]} />
        <View style={[styles.curve, styles.curve4]} />
        <View style={[styles.curve, styles.curve5]} />
        <View style={[styles.curve, styles.curve6]} />
        <View style={[styles.curve, styles.curve7]} />
        
      </View>
      
      <View style={styles.content}>
        {/* Welcome Text with Gradient */}
        <Animatable.View animation="fadeInDown" duration={1000} delay={300}>
          <MaskedView
            maskElement={
              <Text style={styles.welcomeTitleMask}>Welcome</Text>
            }
          >
            <LinearGradient
              colors={['#47DC88', '#37D9B4', '#27D4E4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              angle={89.3}
            >
              <Text style={[styles.welcomeTitleMask, { opacity: 0 }]}>Welcome</Text>
            </LinearGradient>
          </MaskedView>
          
          <Text style={styles.welcomeSubtitle}>Hi there!!</Text>
          <Text style={styles.welcomeDescription}>
            "Welcome to CashFlex -{'\n'}
            Your trusted marketplace for electronics."
          </Text>
        </Animatable.View>

        {/* Buttons */}
        <Animatable.View animation="fadeInUp" duration={1000} delay={600} style={styles.buttonsContainer}>
          {/* Create Account Button - White with Cyan Glow */}
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            activeOpacity={0.8}
          >
            <View style={styles.createAccountButton}>
              <Text style={styles.createAccountText}>Create Account</Text>
            </View>
          </TouchableOpacity>

          {/* Login Button - Transparent with Border and Glow */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('SignIn')}
            activeOpacity={0.8}
          >
            <Text style={styles.loginText}>Log in</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>

      {/* Decorative Curves - Bottom Left - Multiple Thin Circles (Half Visible) */}
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

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Top Right Curves - More circles, thinner borders, half visible
  curvesTopRight: {
    position: 'absolute',
    top: -130,
    right: -130,
    width: 300,
    height: 300,
  },
  
  // Bottom Left Curves - More circles, thinner borders, half visible
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
  
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  
  // Gradient Welcome Title
  welcomeTitleMask: {
    fontSize: 48,
    fontFamily: FONT_FAMILY.bold,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  
  welcomeSubtitle: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  
  welcomeDescription: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  
  buttonsContainer: {
    width: '100%',
    marginTop: SPACING.xl,
  },
  
  // Create Account Button - White with Cyan Glow Shadow
  createAccountButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    // iOS Shadow
    shadowColor: '#549899',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    // Android Shadow
    elevation: 12,
  },
  
  createAccountText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.background,
  },
  
  // Login Button - Transparent with Border and Cyan Glow
  loginButton: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 2,
    borderColor: COLORS.gradientStart,
    backgroundColor: 'transparent',
    // iOS Shadow
    shadowColor: '#549899',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    // Android Shadow
    // elevation: 12,
  },
  
  loginText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
  },
});
