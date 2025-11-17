// navigation/TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Image, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { HomeScreen, ServicesScreen, ProfileScreen, SellScreen, HistoryScreen } from '../screens';
import { COLORS, FONT_SIZE } from '../utils';
import Home from '../assets/images/Home.png';
import Profile from '../assets/images/Profile.png';
import Sell from '../assets/images/Sell.png';
import Category from '../assets/images/Category.png';
import History from '../assets/images/History.png';

const Tab = createBottomTabNavigator();

// Custom Tab Bar Icon Component
const TabBarIcon = ({ focused, image }) => {
  if (focused) {
    return (
      <View style={styles.activeTabContainer}>
        <LinearGradient
          colors={[
            'rgba(71, 220, 136, 0.81)',
            'rgba(55, 217, 180, 0.81)',
            'rgba(39, 212, 228, 0.81)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.activeTabGradient}
        >
          <Image 
            source={image} 
            style={[styles.tabIcon, { tintColor: '#000000' }]} 
            resizeMode="contain"
          />
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.inactiveTab}>
      <Image 
        source={image} 
        style={[styles.tabIcon, { tintColor: COLORS.textSecondary }]} 
        resizeMode="contain"
      />
    </View>
  );
};

const TabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.textWhite,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: '#0000',
          height: Platform.OS === 'ios' ? 85 : 70 + insets.bottom,
          paddingTop: 6,
          paddingBottom: Platform.OS === 'ios' ? 20 : Math.max(insets.bottom, 8),
          paddingHorizontal: 8,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: FONT_SIZE.xs,
          fontWeight: '500',
          marginTop: 8,
          marginBottom: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
          justifyContent: 'center',
          alignItems: 'center',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} image={Home} />
          ),
        }}
      />
      {/* <Tab.Screen 
        name="Category" 
        component={ServicesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} image={Category} />
          ),
        }}
      /> */}
      <Tab.Screen 
        name="Sell" 
        component={SellScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} image={Sell} />
          ),
        }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} image={History} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} image={Profile} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  activeTabContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabGradient: {
    width: 44,
    height: 44,
    borderRadius: 12, 
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  inactiveTab: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    width: 22,
    height: 22,
  },
});

export default TabNavigator;