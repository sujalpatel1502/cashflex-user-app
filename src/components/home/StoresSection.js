// components/home/StoresSection.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SPACING } from '../../utils';

const { width: screenWidth } = Dimensions.get('window');

const StoresSection = () => {
  const [pincode, setPincode] = useState('');

  // Dummy store data
  const stores = [
    {
      id: '1',
      city: 'MUMBAI',
      name: 'CashFlex Mobile Phone Offline Store Parel Mumbai',
      address: 'Shop no.2, Ground Floor, Khatri Mansion Building Dr Babasaheb Ambedkar Road, Dr, Dr RK Shirodkar Marg',
      timings: '10:00 AM - 09:00 PM',
      rating: '4.5',
    },
    {
      id: '2',
      city: 'DELHI',
      name: 'CashFlex Mobile Store Connaught Place',
      address: 'Block A, Inner Circle, Connaught Place, New Delhi',
      timings: '10:00 AM - 09:00 PM',
      rating: '4.7',
    },
    {
      id: '3',
      city: 'BANGALORE',
      name: 'CashFlex Electronics Hub Koramangala',
      address: '3rd Block, Koramangala, 80 Feet Road, Bangalore',
      timings: '09:30 AM - 09:30 PM',
      rating: '4.6',
    },
  ];

  const handlePincodeSearch = () => {
    if (pincode.trim()) {
      console.log('Searching stores for pincode:', pincode);
      // Add your pincode search logic here
    }
  };

  const StoreCard = ({ store }) => (
    <View style={styles.storeCard}>
      <View style={styles.cityBadge}>
        <Text style={styles.cityText}>{store.city}</Text>
      </View>
      
      <Text style={styles.storeName}>{store.name}</Text>
      
      <View style={styles.storeDetails}>
        <View style={styles.detailRow}>
          <Icon name="location-on" size={16} color={COLORS.textSecondary} />
          <Text style={styles.addressText} numberOfLines={2}>
            {store.address}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="access-time" size={16} color={COLORS.textSecondary} />
          <Text style={styles.timingText}>Timings: {store.timings}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.viewDetailsButton}>
        <Text style={styles.viewDetailsText}>View Details</Text>
        <Icon name="arrow-forward" size={16} color={COLORS.gradientStart} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Our Exclusive Stores.</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all stores</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Icon name="location-on" size={20} color={COLORS.gradientStart} />
            </View>
            <View>
              <Text style={styles.statNumber}>200+</Text>
              <Text style={styles.statLabel}>Experience Centres</Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Icon name="star" size={20} color={COLORS.warning} />
            </View>
            <View>
              <Text style={styles.statNumber}>4.5+</Text>
              <Text style={styles.statLabel}>Star Ratings</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter Pincode"
            placeholderTextColor={COLORS.textLight}
            value={pincode}
            onChangeText={setPincode}
            keyboardType="numeric"
            maxLength={6}
          />
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={handlePincodeSearch}
          >
            <Icon name="arrow-forward" size={20} color={COLORS.textWhite} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={stores}
        renderItem={({ item }) => <StoreCard store={item} />}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storesList}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundLight,
    paddingVertical: SPACING.lg,
  },
  header: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.gradientStart,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  searchSection: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingLeft: SPACING.md,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.textPrimary,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storesList: {
    paddingHorizontal: SPACING.md,
  },
  storeCard: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: SPACING.md,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cityBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.textPrimary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: SPACING.sm,
  },
  cityText: {
    color: COLORS.textWhite,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    lineHeight: 24,
  },
  storeDetails: {
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
    lineHeight: 20,
  },
  timingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
    lineHeight: 20,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gradientStart,
    marginRight: SPACING.xs,
  },
  separator: {
    height: SPACING.md,
  },
});

export default StoresSection;