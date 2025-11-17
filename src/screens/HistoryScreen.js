// screens/HistoryScreen.js
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZE,
  SPACING,
  BORDER_RADIUS,
  Storage,
  StorageKeys,
} from '../utils';
import { CustomScreenHeader } from '../components/common';
import ordersApi from '../services/ordersApi';

const HistoryScreen = () => {
  const navigation = useNavigation();
  
  const [userEmail, setUserEmail] = useState(''); // Use state instead of variable
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load user email
  useFocusEffect(
    React.useCallback(() => {
      const logUserData = async () => {
        const userData = await Storage.get(StorageKeys.USER_DATA);
        console.log('=== USER DATA in history ===');
        console.log('User:', userData);
        if (userData) {
          setUserEmail(userData.email); // Set state
        }
      };
      
      logUserData();
    }, [])
  );

  const getAllOrders = async () => {
    if (!userEmail) {
      console.log('No user email available yet');
      return;
    }

    try {
      setLoading(true);
      const response = await ordersApi.getAllOrders(userEmail);
      console.log('response of orders', response);
      if (response && response.orders) {
        console.log('orders-=-=-=-=-', response.orders);
        setOrders(response.orders);
      }
    } catch (error) {
      console.log('error while getting orders', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getAllOrders();
    setRefreshing(false);
  };

  // Fetch orders when userEmail changes
  useEffect(() => {
    if (userEmail) {
      getAllOrders();
    }
  }, [userEmail]);

  const getStatusInfo = (stage) => {
    switch (stage) {
      case 1:
        return {
          text: 'Pending',
          color: '#FFA500',
          bgColor: 'rgba(255, 165, 0, 0.15)',
        };
      case 2:
        return {
          text: 'Pick-up',
          color: '#9C27B0',
          bgColor: 'rgba(156, 39, 176, 0.15)',
        };
      case 3:
        return {
          text: 'Completed',
          color: COLORS.gradientStart,
          bgColor: 'rgba(71, 220, 136, 0.15)',
        };
      default:
        return {
          text: 'Unknown',
          color: COLORS.textSecondary,
          bgColor: 'rgba(255, 255, 255, 0.1)',
        };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleOrderPress = (order) => {
    navigation.navigate('OrderDetails', { order });
  };

  const renderOrderCard = ({ item, index }) => {
    const statusInfo = getStatusInfo(item.latestStage);

    return (
      <Animatable.View
        animation="fadeInUp"
        duration={600}
        delay={index * 100}
        style={styles.cardWrapper}
      >
        <TouchableOpacity
          style={styles.orderCard}
          onPress={() => handleOrderPress(item)}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <View style={styles.productNameContainer}>
              <Text style={styles.productName} numberOfLines={1}>
                {item.ProductName}
              </Text>
              <Text style={styles.categoryName}>{item.CategoryName}</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleOrderPress(item)}
              style={styles.detailsButton} 
              activeOpacity={0.7}
            >
              <Text style={styles.detailsButtonText}>Details</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status:</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusInfo.bgColor },
              ]}
            >
              <Text style={[styles.statusText, { color: statusInfo.color }]}>
                {statusInfo.text}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomScreenHeader title="Sales" showBackButton={true} />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.gradientStart} />
          <Text style={styles.loaderText}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomScreenHeader title="Sales" showBackButton={false} />

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon
            name="package-variant-closed"
            size={80}
            color={COLORS.textSecondary}
          />
          <Text style={styles.emptyText}>No orders yet</Text>
          <Text style={styles.emptySubText}>
            Your order history will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.Response_Id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.gradientStart}
              colors={[COLORS.gradientStart]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  listContent: {
    padding: SPACING.md,
  },
  cardWrapper: {
    marginBottom: SPACING.md,
  },
  orderCard: {
    backgroundColor: '#262626',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  productNameContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
  productName: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
  },
  categoryName: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  detailsButton: {
    backgroundColor: '#3A3A3A',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  detailsButtonText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.textPrimary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    marginRight: SPACING.sm,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.xs,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.bold,
    textTransform: 'capitalize',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
  },
  emptySubText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});
