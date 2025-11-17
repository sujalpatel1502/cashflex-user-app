// screens/ReferAndEarn.js
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Clipboard,
  Share,
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
import Refer from '../assets/images/Refrerr.png';

const ReferAndEarn = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const [referralCode] = useState('FRIEND23');

  // Copy referral code to clipboard
  const handleCopyCode = () => {
    Clipboard.setString(referralCode);
    Alert.alert('Copied!', 'Referral code copied to clipboard');
  };

  // Share via SMS
  const handleInviteSMS = async () => {
    const message = `Hey! Use my referral code ${referralCode} when you make your first purchase on CashFlex and we'll both get rewards! Download: https://cashflex.app`;
    
    try {
      await Share.share({
        message,
        title: 'Invite Friends to CashFlex',
      });
    } catch (error) {
      console.log('Error sharing via SMS:', error);
    }
  };

  // Share via Email
  const handleInviteEmail = async () => {
    const subject = 'Join CashFlex and Get Rewards!';
    const body = `Hey!\n\nI'm using CashFlex to sell my old gadgets and I think you'd love it too!\n\nUse my referral code ${referralCode} when you make your first purchase and we'll both get rewards!\n\nDownload the app here: https://cashflex.app\n\nHappy selling!`;
    
    try {
      await Share.share({
        message: body,
        title: subject,
      });
    } catch (error) {
      console.log('Error sharing via Email:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomScreenHeader
        title="Refer & Earn"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 }
        ]}
      >
        {/* Header Image */}
        <Animatable.View animation="fadeInDown" duration={800} delay={200}>
          <View style={styles.imageContainer}>
            <Image source={Refer} style={styles.referImage} resizeMode="contain" />
          </View>
        </Animatable.View>

        {/* Title & Description */}
        <Animatable.View animation="fadeInUp" duration={800} delay={400}>
          <Text style={styles.title}>Invite your friends and earn rewards</Text>
          <Text style={styles.description}>
            Share your referral code with friends and family. When they make their first purchase, you'll both receive a reward.
          </Text>
        </Animatable.View>

        {/* Referral Code Card */}
        <Animatable.View animation="fadeInUp" duration={800} delay={600}>
          <Text style={styles.sectionTitle}>Your Referral Code</Text>
          <View style={styles.codeCard}>
            <Text style={styles.codeText}>{referralCode}</Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={handleCopyCode}
              activeOpacity={0.7}
            >
              <Icon name="content-copy" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
        </Animatable.View>

        {/* Invite Buttons - IN SAME ROW */}
        <Animatable.View animation="fadeInUp" duration={800} delay={800}>
          <Text style={styles.sectionTitle}>Invite Friends</Text>
          <View style={styles.inviteButtonsRow}>
            {/* Invite via SMS */}
            <TouchableOpacity onPress={handleInviteSMS} activeOpacity={0.8} style={styles.inviteButtonWrapper}>
              <View style={styles.inviteButton}>
                <LinearGradient
                  colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.inviteGradient}
                >
                  <View style={styles.buttonContent}>
                    <Text style={styles.inviteButtonText}>Invite via SMS</Text>
                  </View>
                </LinearGradient>
              </View>
            </TouchableOpacity>

            {/* Invite via Email */}
            <TouchableOpacity onPress={handleInviteEmail} activeOpacity={0.8} style={styles.inviteButtonWrapper}>
              <View style={styles.inviteButtonSecondary}>
                <Text style={styles.inviteButtonSecondaryText}>Invite via Email</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReferAndEarn;

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

  // Image
  imageContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  referImage: {
    width: '100%',
    height: 250,
  },

  // Title & Description
  title: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.xl,
  },

  // Section Title
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },

  // Referral Code Card - SMALLER
  codeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#262626',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  codeText: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    letterSpacing: 2,
  },
  copyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Invite Buttons - IN SAME ROW
  inviteButtonsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  inviteButtonWrapper: {
    flex: 1,
  },
  inviteButton: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  inviteGradient: {
    width: '100%',
  },
  buttonContent: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteButtonText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.background,
  },
  inviteButtonSecondary: {
    backgroundColor: '#3A3A3A',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteButtonSecondaryText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
  },
});
