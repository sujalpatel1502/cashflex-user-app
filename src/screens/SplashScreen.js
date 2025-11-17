import React, { useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  StatusBar, 
  Animated, 
  Dimensions,
  Easing,
  Image,
  Platform 
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch } from 'react-redux';
import { loginSuccess, skipLogin } from '../redux/authSlice';
import { Storage, StorageKeys } from '../utils/storage';
import { COLORS } from '../utils';
import NewLogo from '../assets/images/cc.png';
import logoGif from '../assets/animations/CashFlex.gif';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  
  // Animation values
  const logoPosition = useRef(new Animated.Value(0)).current; // 0 = center, 1 = left
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const gifOpacity = useRef(new Animated.Value(0)).current;
  const gifScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    startAnimation();
    setTimeout(() => {
      checkAuthStatus();
    }, 4000);
  }, []);

  const startAnimation = () => {
    // Step 1: Fade in logo at center
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 800,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      // Step 2: Wait a bit, then move logo to left
      setTimeout(() => {
        Animated.parallel([
          // Move logo to left
          Animated.timing(logoPosition, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          // Fade out logo
          Animated.timing(logoOpacity, {
            toValue: 0,
            duration: 600,
            delay: 400,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Step 3: Show GIF in center with scale animation
          Animated.parallel([
            Animated.timing(gifOpacity, {
              toValue: 1,
              duration: 600,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.spring(gifScale, {
              toValue: 1,
              tension: 50,
              friction: 7,
              useNativeDriver: true,
            }),
          ]).start();
        });
      }, 1000);
    });
  };

  const checkAuthStatus = async () => {
    try {
      const isLoggedIn = await Storage.get(StorageKeys.IS_LOGGED_IN);
      const isSkipped = await Storage.get(StorageKeys.SKIP_LOGIN);
      const userData = await Storage.get(StorageKeys.USER_DATA);

      if (isLoggedIn && userData) {
        dispatch(loginSuccess(userData));
        navigation.replace('MainTab');
      } else if (isSkipped) {
        dispatch(skipLogin());
        navigation.replace('MainTab');
      } else {
        navigation.replace('Welcome');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      navigation.replace('Auth');
    }
  };

  // Calculate logo position interpolation
  const logoTranslateX = logoPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -screenWidth / 2 + 60], // Move to left edge
  });

  // Render GIF based on platform
  const renderGif = () => {
    const gifStyle = [
      styles.gif,
      {
        opacity: gifOpacity,
        transform: [{ scale: gifScale }],
      }
    ];

    if (Platform.OS === 'android') {
      // Use FastImage for Android
      return (
        <Animated.View style={gifStyle}>
          <FastImage
            source={logoGif}
            style={styles.gifImage}
            resizeMode={FastImage.resizeMode.contain}
          />
        </Animated.View>
      );
    } else {
      // Use regular Image for iOS
      return (
        <Animated.Image
          source={logoGif}
          style={[styles.gifImage, gifStyle]}
          resizeMode="contain"
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Static Logo - moves from center to left then fades out */}
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ translateX: logoTranslateX }],
          }
        ]}
      >
        <Image 
          source={NewLogo} 
          style={styles.logo} 
          resizeMode="contain" 
        />
      </Animated.View>

      {/* GIF - appears in center after logo moves */}
      <View style={styles.gifContainer}>
        {renderGif()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  gifContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gif: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gifImage: {
    width: 250,
    height: 250,
  },
});

export default SplashScreen;