// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
import { CustomLoader } from '../components/common';
import CustomHomeHeader from '../components/common/CustomHomeHeader';
import CarouselComponent from '../components/home/CarouselComponent';
import CategoriesSection from '../components/home/CategoriesSection';
import { COLORS, SPACING } from '../utils';
import categoryApi from '../services/categoryApi.js';

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState([]);

  const getAllCategory = async() => {
    try {
      setLoading(true);
      const response = await categoryApi.getCategories();
      console.log("response of category", response);
      if (response && response.data) {
        console.log("categories", response.data);
        setCategories(response.data);
      }
    } catch (error) {
      console.log("error while getting categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    getAllCategory();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleSearchPress = (searchText) => {
    navigation.navigate('Services', { searchQuery: searchText });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHomeHeader 
        onSearchPress={handleSearchPress}
        onNotificationPress={() => navigation.navigate('NotificationScreen')}
        onProfilePress={() => navigation.navigate('Profile')}
      />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={COLORS.textPrimary}
            colors={[COLORS.gradientStart]}
          />
        }
      >
        <CarouselComponent />
        
        <CategoriesSection 
          categories={categories}
          navigation={navigation}
        />

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <CustomLoader visible={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 90,
  },
  bottomSpacing: {
    height: SPACING.xl,
  },
});

export default HomeScreen;