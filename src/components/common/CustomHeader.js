// components/common/CustomHomeHeader.js
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Platform,
  SafeAreaView
} from 'react-native';
import { useSelector } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../utils';

const CustomHomeHeader = ({ onSearchPress, onNotificationPress, onProfilePress }) => {
  const { user, isLoggedIn } = useSelector(state => state.auth);

  const handleSearchPress = () => {
    if (onSearchPress) {
      onSearchPress('');
    }
  };

  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={COLORS.background}
        translucent={false}
      />
      
      <SafeAreaView style={styles.safeAreaTop}>
        <View style={styles.headerContainer}>
          {/* Top Row - Greeting and Icons */}
          <Animatable.View animation="fadeInDown" duration={800} style={styles.topRow}>
            <View style={styles.greetingSection}>
              <Text style={styles.greetingText}>
                Hello, user!
              </Text>
              <View style={styles.locationContainer}>
                <Icon name="map-marker" size={14} color={COLORS.textSecondary} />
                <Text style={styles.locationText}>
                  Ahmedabad, Gujarat
                </Text>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionButton} onPress={onProfilePress}>
                <Icon name="heart-outline" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton} onPress={onNotificationPress}>
                <Icon name="bell-outline" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
          </Animatable.View>

          {/* Search Bar */}
          <Animatable.View animation="fadeInUp" duration={800} delay={200} style={styles.searchContainer}>
            <TouchableOpacity 
              style={styles.searchBar} 
              onPress={handleSearchPress}
            >
              <Icon name="magnify" size={22} color={COLORS.textSecondary} style={styles.searchIcon} />
              <Text style={styles.searchPlaceholder}>
                Search...
              </Text>
              <TouchableOpacity style={styles.imageSearchButton}>
                <Icon name="image-outline" size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </TouchableOpacity>
          </Animatable.View>
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
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  greetingSection: {
    flex: 1,
  },
  greetingText: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: SPACING.md,
    padding: SPACING.sm,
  },
  searchContainer: {
    marginTop: SPACING.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
  },
  imageSearchButton: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.backgroundLight,
  },
});

export default CustomHomeHeader;
