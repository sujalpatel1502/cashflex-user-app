// screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZE,
  SPACING,
  BORDER_RADIUS,
} from '../utils';
import { Storage, StorageKeys } from '../utils/storage';
import { logout } from '../redux/authSlice';
import { CustomScreenHeader } from '../components/common';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();


  const [user, setUser] = useState({
    name: 'User',
    username: '@tuser11',
    avatar: null,
  });


useFocusEffect(
    React.useCallback(() => {
      const loadUserData = async () => {
        const userData = await Storage.get(StorageKeys.USER_DATA);
        if (userData) {
          console.log("userData in profile screen", userData);
          setUser({
            name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'User',
            username: `@${userData.first_name?.toLowerCase() || 'user'}`,
            avatar: userData.avatar || null,
          });
        }
      };
      
      loadUserData();
    }, [])
  );

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleMyOrders = () => {
    navigation.navigate('History');
  };

  const handleSavedAddresses = () => {
    navigation.navigate('SavedAddresses');
  };

  const handleReferEarn = () => {
    navigation.navigate('ReferAndEarn');
  };

  const handleFAQs = () => {
    navigation.navigate('HelpAndSupport');
  };

  const handleChatSupport = () => {
    navigation.navigate('HelpAndSupport');
  };

  const handleCallSupport = () => {
    navigation.navigate('HelpAndSupport');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear storage
              await Storage.remove(StorageKeys.IS_LOGGED_IN);
              await Storage.remove(StorageKeys.USER_DATA);
              await Storage.remove(StorageKeys.AUTH_TOKEN);
              
              // Dispatch logout action
              dispatch(logout());
              
              // Navigate to auth screens
              navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const MenuItem = ({ icon, title, subtitle, onPress, showArrow = true }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuLeft}>
        <View style={styles.menuIcon}>
          <Icon name={icon} size={24} color={COLORS.textPrimary} />
        </View>
        <View style={styles.menuText}>
          <Text style={styles.menuTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && (
        <Icon name="chevron-right" size={24} color={COLORS.textPrimary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomScreenHeader title="My Profile" showBackButton={false} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 }
        ]}
      >
        {/* Profile Header - Horizontal Layout with Background */}
        <Animatable.View animation="fadeInDown" duration={800} delay={200}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Icon name="account" size={40} color={COLORS.textPrimary} />
                </View>
              )}
              <TouchableOpacity style={styles.cameraButton} activeOpacity={0.8}>
                <Icon name="camera" size={14} color={COLORS.background} />
              </TouchableOpacity>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              {/* <Text style={styles.userHandle}>{user.username}</Text> */}

              <TouchableOpacity onPress={handleEditProfile} activeOpacity={0.8}>
                <View style={styles.editButton}>
                  <LinearGradient
                    colors={['rgba(71, 220, 136, 0.55)', 'rgba(55, 217, 180, 0.55)', 'rgba(39, 212, 228, 0.55)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    angle={89.3}
                    style={styles.editGradient}
                  >
                    <View style={styles.editButtonContent}>
                      <Text style={styles.editButtonText}>Edit Profile</Text>
                    </View>
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Animatable.View>

        {/* Quick Actions */}
        <Animatable.View animation="fadeInUp" duration={800} delay={400}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.menuSection}>
            <MenuItem
              icon="tag-outline"
              title="My Sell Orders"
              subtitle="Track sales & manage listing"
              onPress={handleMyOrders}
            />
            <MenuItem
              icon="map-marker-outline"
              title="Saved Addresses"
              subtitle="Manage shipping addresses"
              onPress={handleSavedAddresses}
            />
            <MenuItem
              icon="account-group-outline"
              title="Refer & Earn"
              subtitle="Invite friends & earn rewards"
              onPress={handleReferEarn}
            />
          </View>
        </Animatable.View>

        {/* Help & Support */}
        <Animatable.View animation="fadeInUp" duration={800} delay={800}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          <View style={styles.menuSection}>
            <MenuItem
              icon="help-circle-outline"
              title="FAQs"
              onPress={handleFAQs}
            />
            <MenuItem
              icon="chat-outline"
              title="Feedback & Support"
              onPress={handleChatSupport}
            />
            <MenuItem
              icon="phone-outline"
              title="Call Support"
              onPress={handleCallSupport}
            />
          </View>
        </Animatable.View>

        {/* Logout Button */}
        <Animatable.View animation="fadeInUp" duration={800} delay={1000}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Icon name="logout" size={20} color="#DC2626" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    flexGrow: 1,
  },

  // Profile Header - HORIZONTAL LAYOUT WITH BACKGROUND & CENTERED
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#26262680',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: SPACING.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.gradientStart,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: SPACING.md,
  },
  userName: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  userHandle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  editButton: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    marginTop: SPACING.sm,
  },
  editGradient: {
    width: '100%',
  },
  editButtonContent: {
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  editButtonText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.textPrimary,
  },

  // Section Title
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
  },

  // Menu Section
  menuSection: {
    backgroundColor: '#262626',
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
  },

  // Logout Button
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF45403B',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: '#FFFFFF5C',
    marginTop: SPACING.lg,
  },
  logoutText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.semiBold,
    color: '#DC2626',
    marginLeft: SPACING.xs,
  },
});
