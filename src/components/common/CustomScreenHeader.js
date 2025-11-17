// components/common/CustomScreenHeader.js
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Platform,
  SafeAreaView,
  StatusBar
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING } from '../../utils';

const CustomScreenHeader = ({ 
  title, 
  subtitle, 
  showBackButton = false, 
  onBackPress,
}) => {
  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={COLORS.background}
        translucent={false}
      />
      
      <SafeAreaView style={styles.safeAreaTop}>
        <View style={styles.headerContainer}>
          <Animatable.View animation="fadeInDown" duration={800} style={styles.headerContent}>
            <View style={styles.headerRow}>
              {/* Left Side - Back Button */}
              {showBackButton && (
                <TouchableOpacity 
                  style={styles.backButton} 
                  onPress={onBackPress}
                  activeOpacity={0.7}
                >
                  <Icon name="arrow-left" size={28} color={COLORS.textWhite} />
                </TouchableOpacity>
              )}
              
              {/* Center - Title */}
              <View style={[styles.titleContainer, !showBackButton && styles.titleContainerFull]}>
                <Text style={styles.headerTitle}>{title}</Text>
                {subtitle && (
                  <Text style={styles.headerSubtitle}>{subtitle}</Text>
                )}
              </View>
              
              {/* Right Side - Placeholder for balance */}
              {showBackButton && <View style={styles.placeholder} />}
            </View>
          </Animatable.View>
          
          {/* Bottom White Line */}
          <View style={styles.bottomBorder} />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeAreaTop: {
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    backgroundColor: COLORS.background,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  headerContent: {
    paddingHorizontal: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainerFull: {
    paddingHorizontal: 0,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textWhite,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  bottomBorder: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: SPACING.sm,
  },
});

export default CustomScreenHeader;
