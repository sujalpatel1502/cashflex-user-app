// navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../screens';
import TabNavigator from './TabNavigator';
import CategoryDetails from '../screens/CategoryDetails';
import BrandDetails from '../screens/BrandDetails';
import ModelDetails from '../screens/ModelDetails';
import QuestionnaireScreen from '../screens/QuestionnaireScreen';
import FinalPriceScreen from '../screens/FinalPriceScreen';
import PickupAddressScreen from '../screens/PickupAddressScreen';
import ConfirmSaleScreen from '../screens/ConfirmSaleScreen';
import OrderDetails from '../screens/OrderDetails';
import EditProfile from '../screens/EditProfile';
import SavedAddresses from '../screens/SavedAddresses';
import ReferAndEarn from '../screens/ReferAndEarn';
import HelpAndSupport from '../screens/HelpAndSupport';

// Auth Screens
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';
import NotificationScreen from '../screens/NotificationScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        
        {/* Auth Flow */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
        
        {/* Main App */}
        <Stack.Screen name="MainTab" component={TabNavigator} />
        <Stack.Screen name="CategoryDetails" component={CategoryDetails} />
        <Stack.Screen name="BrandDetails" component={BrandDetails} />
        <Stack.Screen name="ModelDetails" component={ModelDetails} />
        <Stack.Screen name="QuestionnaireScreen" component={QuestionnaireScreen} />
        <Stack.Screen name="FinalPrice" component={FinalPriceScreen} />
        <Stack.Screen name="OrderDetails" component={OrderDetails} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="SavedAddresses" component={SavedAddresses} />
        <Stack.Screen name="ReferAndEarn" component={ReferAndEarn} />
        <Stack.Screen name="PickupAddress" component={PickupAddressScreen} />
        <Stack.Screen name="ConfirmSale" component={ConfirmSaleScreen} />
        <Stack.Screen name="HelpAndSupport" component={HelpAndSupport} />
        <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
