// components/home/CarouselComponent.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { COLORS, SPACING, SCREEN_WIDTH } from '../../utils';
import banner1 from '../../assets/images/baner1.png';
import banner2 from '../../assets/images/baner2.png';
import banner3 from '../../assets/images/baner3.png';
import banner4 from '../../assets/images/baner4.png';
import banner5 from '../../assets/images/baner5.png';


const CarouselComponent = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef(null);
  const autoScrollTimer = useRef(null);

  const CAROUSEL_MARGIN = 16;
  const CAROUSEL_ITEM_SPACING = 16;
  const CAROUSEL_WIDTH = SCREEN_WIDTH - (CAROUSEL_MARGIN * 2) + CAROUSEL_ITEM_SPACING;

  const carouselImages = [
    { id: 1, image: banner1, title: 'Sell Your Old Phone', subtitle: 'Get Best Prices Instantly', bgColor: COLORS.gradientStart },
    { id: 2, image: banner2, title: 'Buy Refurbished Devices', subtitle: 'Quality Assured Products', bgColor: COLORS.success },
    { id: 3, image: banner3, title: 'Gaming Laptops', subtitle: 'Performance Meets Value', bgColor: COLORS.info },
    { id: 4, image: banner4, title: 'Premium Tablets', subtitle: 'Work & Entertainment', bgColor: COLORS.warning },
    { id: 5, image: banner5, title: 'Premium Tablets', subtitle: 'Work & Entertainment', bgColor: COLORS.warning },
  ];

  useEffect(() => {
    startAutoScroll();
    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [activeSlide]);

  const startAutoScroll = () => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
    }
    
    autoScrollTimer.current = setInterval(() => {
      setActiveSlide(current => {
        const nextSlide = current === carouselImages.length - 1 ? 0 : current + 1;
        scrollToSlide(nextSlide);
        return nextSlide;
      });
    }, 5000);
  };

  const scrollToSlide = (slideIndex) => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        x: slideIndex * CAROUSEL_WIDTH,
        animated: true,
      });
    }
  };

  const handleManualScroll = ({ nativeEvent }) => {
    const slide = Math.ceil(nativeEvent.contentOffset.x / CAROUSEL_WIDTH);
    if (slide !== activeSlide && slide >= 0 && slide < carouselImages.length) {
      setActiveSlide(slide);
    }
  };

  const renderCarouselItem = (item, index) => {
    return (
      <View key={item.id} style={styles.carouselItem}>
        <View style={styles.carouselCard}>
          <Image 
            source={item.image} 
            style={styles.carouselImage}
            resizeMode="cover"
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.carouselWrapper}>
      <Animatable.View animation="fadeIn" duration={1000} style={styles.carouselContainer}>
        <ScrollView
          ref={carouselRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleManualScroll}
          onScrollBeginDrag={() => {
            if (autoScrollTimer.current) {
              clearInterval(autoScrollTimer.current);
            }
          }}
          onScrollEndDrag={startAutoScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={CAROUSEL_WIDTH}
          snapToAlignment="start"
          contentContainerStyle={styles.carouselScrollContainer}
        >
          {carouselImages.map((item, index) => renderCarouselItem(item, index))}
        </ScrollView>
        
        <View style={styles.indicatorContainer}>
          {carouselImages.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.indicator,
                { 
                  backgroundColor: index === activeSlide ? COLORS.gradientStart : COLORS.gradientStart + '40',
                  width: index === activeSlide ? 20 : 6,
                }
              ]}
              onPress={() => {
                setActiveSlide(index);
                scrollToSlide(index);
              }}
            />
          ))}
        </View>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselWrapper: {
    width: SCREEN_WIDTH,
    height: 200,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  carouselContainer: {
    width: SCREEN_WIDTH,
    height: 180,
    position: 'relative',
  },
  carouselScrollContainer: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  carouselItem: {
    width: SCREEN_WIDTH - 32,
    height: 150,
    marginRight: 16,
    paddingHorizontal: 0,
  },
  carouselCard: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.background,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: SPACING.sm,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  indicator: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default CarouselComponent;
