// screens/OrderDetails.js
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Linking,
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
import Order from '../assets/images/Order.png';
import Pickup from '../assets/images/Pickupp.png';
import Ready from '../assets/images/Ready.png';


const OrderDetails = ({ route }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { order } = route.params;


  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };


  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };


  // Get current stage details
  const getCurrentStageInfo = () => {
    const stage = order.latestStage;
    const latestHistory = order.trackingHistory[order.trackingHistory.length - 1];
    
    switch (stage) {
      case 1:
        return {
          title: 'Order placed',
          date: latestHistory?.stage_date || order.Created_At,
          icon: Order,
        };
      case 2:
        return {
          title: 'Ready for pickup',
          date: latestHistory?.stage_date || order.Created_At,
          icon: Ready,
        };
      case 3:
        return {
          title: 'Pickup completed',
          date: latestHistory?.stage_date || order.Created_At,
          icon: Pickup,
        };
      default:
        return {
          title: 'Order placed',
          date: order.Created_At,
          icon: Order,
        };
    }
  };


  const currentStage = getCurrentStageInfo();


  // Handle contact buyer
  const handleContactBuyer = () => {
    const phoneNumber = '1234567890';
    Linking.openURL(`tel:${phoneNumber}`);
  };


  // Handle update status
  const handleUpdateStatus = () => {
    console.log('Update status clicked');
  };


  // Calculate bottom padding including safe area
  const bottomPadding = Platform.OS === 'ios' 
    ? 100 + insets.bottom 
    : 100 + Math.max(insets.bottom, 0);


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomScreenHeader
        title="Order Details"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding },
        ]}
      >
        {/* Current Status Card */}
        <Animatable.View animation="fadeInUp" duration={800} delay={200}>
          <View style={styles.currentStatusCard}>
            <View style={styles.statusIconWrapper}>
              <Image source={currentStage.icon} style={styles.statusIcon} resizeMode="contain" />
            </View>
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>{currentStage.title}</Text>
              <Text style={styles.statusDate}>
                Pickup by: {formatDate(currentStage.date)}, {formatTime(currentStage.date)}
              </Text>
            </View>
          </View>
        </Animatable.View>


        {/* Timeline */}
        <Animatable.View animation="fadeInUp" duration={800} delay={400}>
          <View style={styles.timeline}>
            {/* Order Placed */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[styles.timelineIconWrapper, styles.activeTimeline]}>
                  <Image source={Order} style={styles.timelineIcon} resizeMode="contain" />
                </View>
                {order.latestStage >= 1 && (
                  <View style={[styles.timelineLine, order.latestStage >= 2 && styles.activeTimelineLine]} />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Order placed</Text>
                <Text style={styles.timelineDate}>
                  {formatDate(order.Created_At)}
                </Text>
              </View>
            </View>


            {/* Ready for Pickup */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[
                  styles.timelineIconWrapper,
                  order.latestStage >= 2 && styles.activeTimeline
                ]}>
                  <Image source={Ready} style={styles.timelineIcon} resizeMode="contain" />
                </View>
                {order.latestStage >= 2 && (
                  <View style={[styles.timelineLine, order.latestStage >= 3 && styles.activeTimelineLine]} />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Ready for pickup</Text>
                <Text style={styles.timelineDate}>
                  {order.trackingHistory[1] ? formatDate(order.trackingHistory[1].stage_date) : 'Oct 11, 2025'}
                </Text>
              </View>
            </View>


            {/* Pickup Completed */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[
                  styles.timelineIconWrapper,
                  order.latestStage >= 3 && styles.activeTimeline
                ]}>
                  <Icon name="check" size={24} color={order.latestStage >= 3 ? COLORS.background : COLORS.textSecondary} />
                </View>
                {order.latestStage >= 3 && (
                  <View style={[styles.timelineLine, styles.activeTimelineLine]} />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Pickup complated</Text>
                <Text style={styles.timelineDate}>
                  {order.trackingHistory[2] ? formatDate(order.trackingHistory[2].stage_date) : 'Oct 12, 2025'}
                </Text>
              </View>
            </View>


            {/* Payment Received */}
            <View style={[styles.timelineItem, styles.lastTimelineItem]}>
              <View style={styles.timelineLeft}>
                <View style={[
                  styles.timelineIconWrapper,
                  order.latestStage >= 3 && styles.activeTimeline
                ]}>
                  <Icon name="credit-card" size={24} color={order.latestStage >= 3 ? COLORS.background : COLORS.textSecondary} />
                </View>
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>payment received</Text>
                <Text style={styles.timelineDate}>Method : UPI payment</Text>
              </View>
            </View>
          </View>
        </Animatable.View>


        {/* Buyer Section */}
        <Animatable.View animation="fadeInUp" duration={800} delay={600}>
          <Text style={styles.sectionTitle}>Buyer</Text>
          <View style={styles.buyerCard}>
            <View style={styles.buyerRow}>
              <View style={styles.avatarWrapper}>
                <Icon name="account-circle" size={50} color={COLORS.textSecondary} />
              </View>
              <View style={styles.buyerInfo}>
                <Text style={styles.buyerName}>{order.UserName || 'Tinkal Hirani'}</Text>
                <Text style={styles.buyerSince}>Buyer since 2005</Text>
              </View>
            </View>


            <View style={styles.locationRow}>
              <Icon name="map-marker" size={24} color={COLORS.textPrimary} />
              <View style={styles.locationInfo}>
                <Text style={styles.locationTitle}>Pickup location</Text>
                <Text style={styles.locationAddress}>{order.Address || 'S.g highway, Gota, Ahemdabad'}</Text>
              </View>
            </View>
          </View>
        </Animatable.View>


        {/* Order Summary */}
        <Animatable.View animation="fadeInUp" duration={800} delay={800}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Icon name="file-document-outline" size={24} color={COLORS.textPrimary} />
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryLabel}>Order #{order.Response_Id}</Text>
                <Text style={styles.summaryDate}>Placed on {formatDate(order.Created_At)}</Text>
              </View>
            </View>


            <View style={styles.summaryRow}>
              <Icon name="package-variant" size={24} color={COLORS.textPrimary} />
              <View style={styles.summaryInfo}>
                <Text style={styles.productName}>{order.ProductName}</Text>
                <Text style={styles.productPrice}>₹{parseFloat(order.EvaluatePrice).toLocaleString('en-IN')} /-</Text>
              </View>
            </View>


            <View style={styles.divider} />


            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>₹ {parseFloat(order.EvaluatePrice).toLocaleString('en-IN')} /-</Text>
            </View>
          </View>
        </Animatable.View>
      </ScrollView>


      {/* Bottom Buttons */}
      <View style={[
        styles.bottomButtons,
        {
          paddingBottom: Math.max(insets.bottom, 16),
        },
      ]}>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={handleContactBuyer}
          activeOpacity={0.8}
        >
          <Text style={styles.contactButtonText}>Contact buyer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


export default OrderDetails;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    flexGrow: 1,
  },


  // Current Status Card - SMALLER
  currentStatusCard: {
    flexDirection: 'row',
    backgroundColor: '#262626',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  statusIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.gradientStart,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  statusIcon: {
    width: 26,
    height: 26,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  statusDate: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
  },


  // Timeline - COMPACT WITH CONNECTED LINES
  timeline: {
    marginBottom: SPACING.lg,
    paddingLeft: SPACING.xs,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 0,
    minHeight: 70,
  },
  lastTimelineItem: {
    marginBottom: 0,
    minHeight: 60,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: SPACING.md,
    width: 50,
  },
  timelineIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3A3A3A',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  activeTimeline: {
    backgroundColor: COLORS.gradientStart,
  },
  timelineIcon: {
    width: 24,
    height: 24,
  },
  timelineLine: {
    position: 'absolute',
    width: 3,
    top: 50,
    bottom: -20,
    left: 23.5,
    backgroundColor: '#3A3A3A',
    zIndex: 1,
  },
  activeTimelineLine: {
    backgroundColor: COLORS.gradientStart,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: SPACING.sm,
  },
  timelineTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.textPrimary,
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  timelineDate: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
  },


  // Section Title
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    marginTop: SPACING.md,
  },


  // Buyer Card - SMALLER
  buyerCard: {
    backgroundColor: '#262626',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  buyerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarWrapper: {
    marginRight: SPACING.md,
  },
  buyerInfo: {
    flex: 1,
  },
  buyerName: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  buyerSince: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  locationTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
  },


  // Summary Card - SMALLER
  summaryCard: {
    backgroundColor: '#262626',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  summaryInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  summaryLabel: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  summaryDate: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
  },
  productName: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  productPrice: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: SPACING.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
  },
  totalAmount: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.gradientStart,
  },


  // Bottom Buttons
  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  updateButton: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  updateGradient: {
    width: '100%',
  },
  buttonContent: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.background,
  },
  contactButton: {
    backgroundColor: '#3A3A3A',
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.77,
    borderColor: '#6EB5B5',
  },
  contactButtonText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
  },
});
