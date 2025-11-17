// screens/NotificationScreen.js
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZE,
  SPACING,
  BORDER_RADIUS,
} from '../utils';
import { CustomScreenHeader } from '../components/common';
import Bulb from '../assets/images/bulb.png';
import Sell from '../assets/images/sell_1.png';
import { useNavigation } from '@react-navigation/native';

const NotificationScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const notifications = [
    {
      id: 1,
      icon: Sell,
      title: 'Time to sell your old phone?',
      time: 'Now',
      isNew: true,
    },
    {
      id: 2,
      icon: Bulb,
      title: 'Tips for successful selling: optimize your product descriptions.',
      time: '8:22 AM',
      isNew: true,
    },
    {
      id: 3,
      icon: Sell,
      title: 'Time to sell your old smartwatch?',
      time: 'Yesterday, 7:35 PM',
      isNew: false,
    },
  ];

  const NotificationCard = ({ item, index, section }) => (
    <Animatable.View
      animation="fadeInUp"
      duration={800}
      delay={200 + index * 100}
    >
      <TouchableOpacity
        style={styles.notificationCard}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Image source={item.icon} style={styles.icon} resizeMode="contain" />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );

  const newNotifications = notifications.filter(n => n.isNew);
  const earlierNotifications = notifications.filter(n => !n.isNew);

  const handleBack=()=>{
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomScreenHeader title="Notifications" showBackButton={true} onBackPress={handleBack}/>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 }
        ]}
      >
        {/* NEW Section */}
        {newNotifications.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>NEW</Text>
            {newNotifications.map((item, index) => (
              <NotificationCard
                key={item.id}
                item={item}
                index={index}
                section="new"
              />
            ))}
          </>
        )}

        {/* EARLIER Section */}
        {earlierNotifications.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>EARLIER</Text>
            {earlierNotifications.map((item, index) => (
              <NotificationCard
                key={item.id}
                item={item}
                index={index}
                section="earlier"
              />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationScreen;

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

  // Section Title
  sectionTitle: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textSecondary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
    letterSpacing: 0.5,
  },

  // Notification Card
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#3A3A3A',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },

  // Icon Container
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(71, 220, 136, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  icon: {
    width: 32,
    height: 32,
  },

  // Content
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  time: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
  },
});
