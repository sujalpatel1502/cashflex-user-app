// components/common/CustomHomeHeader.js
import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Platform,
  SafeAreaView,
  Image
} from 'react-native';
import { useSelector } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS, Storage, StorageKeys } from '../../utils';
import { useFocusEffect } from '@react-navigation/native';

// Gradient Text Component
const GradientText = ({ children, style }) => {
  return (
    <MaskedView
      maskElement={
        <Text style={[style, { backgroundColor: 'transparent' }]}>
          {children}
        </Text>
      }
    >
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[style, { opacity: 0 }]}>{children}</Text>
      </LinearGradient>
    </MaskedView>
  );
};

const CustomHomeHeader = ({ onSearchPress, onNotificationPress, onProfilePress }) => {
  const { user, isLoggedIn } = useSelector(state => state.auth);
  const [userName, setUserName] = React.useState('User');
useFocusEffect(
  React.useCallback(() => {
    const logUserData = async () => {
      const isLoggedIn = await Storage.get(StorageKeys.IS_LOGGED_IN);
      const userData = await Storage.get(StorageKeys.USER_DATA);
      if (userData && userData.first_name) {
        setUserName(userData.first_name);
      }
      
      console.log('=== USER DATA ===');
      console.log('Logged In:', isLoggedIn);
      console.log('User:', userData);
    };
    
    logUserData();
  }, [])
);

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
          {/* Top Row - Profile, Greeting and Icons */}
          <Animatable.View animation="fadeInDown" duration={800} style={styles.topRow}>
            {/* Profile Image with Gradient Border */}
            <View style={styles.profileSection}>
              <LinearGradient
                colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.profileGradientBorder}
              >
                <TouchableOpacity 
                  style={styles.profileImageContainer}
                  onPress={onProfilePress}
                  activeOpacity={0.8}
                >
                  <Image 
                    source={require('../../assets/images/user-placeholder.jpg')} 
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </LinearGradient>
              
              <View style={styles.greetingSection}>
                <GradientText style={styles.greetingText}>
                  {`Hello, ${userName}!`}
                </GradientText>
                <View style={styles.locationContainer}>
                  <Icon name="map-marker" size={12} color={COLORS.textSecondary} />
                  <Text style={styles.locationText}>
                    Ahmedabad, Gujarat
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={onProfilePress}
                activeOpacity={0.7}
              >
                <View style={styles.iconCircle}>
                  <Icon name="heart-outline" size={22} color={COLORS.textPrimary} />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={onNotificationPress}
                activeOpacity={0.7}
              >
                <View style={styles.iconCircle}>
                  <Icon name="bell-outline" size={22} color={COLORS.textPrimary} />
                </View>
              </TouchableOpacity>
            </View>
          </Animatable.View>

          {/* Search Bar - Smaller and More Circular */}
          <Animatable.View animation="fadeInUp" duration={800} delay={200} style={styles.searchContainer}>
            <TouchableOpacity 
              style={styles.searchBar} 
              onPress={handleSearchPress}
              activeOpacity={0.7}
            >
              <Icon name="magnify" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
              <Text style={styles.searchPlaceholder}>
                Search...
              </Text>
              <TouchableOpacity style={styles.imageSearchButton}>
                <Icon name="image-outline" size={18} color={COLORS.textPrimary} />
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
    paddingBottom: SPACING.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileGradientBorder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  greetingSection: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  greetingText: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONT_FAMILY.bold,
    marginBottom: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: SPACING.sm,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    marginTop: SPACING.xs,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 30,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 48,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
  },
  imageSearchButton: {
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.backgroundLight,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomHomeHeader;
