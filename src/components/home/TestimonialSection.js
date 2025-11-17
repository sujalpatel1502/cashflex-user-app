// components/home/TestimonialSection.js
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING } from '../../utils';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const testimonialData = [
  {
    id: 1,
    name: 'Blake Star',
    position: 'COO, blackstar.com',
    rating: 5,
    text: 'Sold my old iPhone through Cashify and got the best price in the market. Quick pickup and instant payment!',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    gradientColors: [COLORS.gradientStart, COLORS.info],
  },
  {
    id: 2,
    name: 'Azure Wilson',
    position: 'CEO, techcorp.io',
    rating: 5,
    text: 'Amazing experience with Cashify! Got my phone repaired professionally with genuine parts and warranty.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    gradientColors: [COLORS.info, COLORS.gradientEnd],
  },
  {
    id: 3,
    name: 'Marcus Johnson',
    position: 'CTO, innovate.co',
    rating: 5,
    text: 'Best platform to sell gadgets! Transparent pricing, doorstep pickup, and immediate payment. Highly recommended!',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    gradientColors: [COLORS.gradientMid, COLORS.gradientStart],
  },
  {
    id: 4,
    name: 'Sarah Chen',
    position: 'Designer, creative.studio',
    rating: 5,
    text: 'Cashify made selling my laptop so easy! Fair valuation, smooth process, and excellent customer support.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    gradientColors: [COLORS.gradientStart, COLORS.gradientMid],
  },
  {
    id: 5,
    name: 'David Rodriguez',
    position: 'Manager, business.pro',
    rating: 5,
    text: 'Outstanding service! Got my phone screen replaced with quality parts. Professional team and affordable pricing.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    gradientColors: [COLORS.gradientEnd, COLORS.info],
  },
];

const TestimonialCard = ({ testimonial, isActive }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Text key={index} style={[styles.star, { color: index < rating ? '#FFD700' : COLORS.borderLight }]}>
        ★
      </Text>
    ));
  };

  return (
    <View style={[styles.testimonialCard, isActive && styles.activeCard]}>
      {/* Glass morphism background */}
      <View style={styles.glassBackground} />
      
      {/* Profile section with gradient */}
      <View style={[styles.profileSection, { 
        backgroundColor: testimonial.gradientColors[0] 
      }]}>
        <Image source={{ uri: testimonial.image }} style={styles.profileImage} />
        <TouchableOpacity style={styles.expandButton}>
          <Text style={styles.expandIcon}>↗</Text>
        </TouchableOpacity>
      </View>
      
      {/* Content section */}
      <View style={styles.contentSection}>
        {/* Stars */}
        <View style={styles.starsContainer}>
          {renderStars(testimonial.rating)}
        </View>
        
        {/* Testimonial text */}
        <Text style={styles.testimonialText} numberOfLines={3}>
          {testimonial.text}
        </Text>
        
        {/* Name */}
        <Text style={styles.userName}>{testimonial.name}</Text>
        <Text style={styles.userPosition}>{testimonial.position}</Text>
      </View>
    </View>
  );
};

const TestimonialSection = () => {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardWidth = 220;
  const cardSpacing = 12;

  useEffect(() => {
    let scrollInterval;
    
    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        setCurrentIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % testimonialData.length;
          scrollToIndex(nextIndex);
          return nextIndex;
        });
      }, 4000);
    };

    const timer = setTimeout(startAutoScroll, 3000);

    return () => {
      clearTimeout(timer);
      if (scrollInterval) {
        clearInterval(scrollInterval);
      }
    };
  }, []);

  const scrollToIndex = (index) => {
    if (scrollViewRef.current) {
      const scrollX = index * (cardWidth + cardSpacing);
      scrollViewRef.current.scrollTo({
        x: scrollX,
        animated: true,
      });
    }
  };

  const goToPrevious = () => {
    const prevIndex = currentIndex === 0 ? testimonialData.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    scrollToIndex(prevIndex);
  };

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % testimonialData.length;
    setCurrentIndex(nextIndex);
    scrollToIndex(nextIndex);
  };

  const handleScroll = (event) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / (cardWidth + cardSpacing));
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Testimonials</Text>
        <View style={styles.titleRow}>
          <Text style={styles.sectionSubtitle}>What our{'\n'}customers say</Text>
          <Text style={styles.description}>
            Join thousands of satisfied customers{'\n'}who trust Cashify for selling and{'\n'}repairing their devices
          </Text>
        </View>
      </View>

      {/* Navigation buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity style={styles.navButton} onPress={goToPrevious}>
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={goToNext}>
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Cards ScrollView */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        decelerationRate="fast"
        snapToInterval={cardWidth + cardSpacing}
        snapToAlignment="start"
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {testimonialData.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            isActive={index === currentIndex}
          />
        ))}
      </ScrollView>

      {/* Indicators */}
      <View style={styles.indicatorContainer}>
        {testimonialData.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.indicator,
              index === currentIndex && styles.activeIndicator
            ]}
            onPress={() => {
              setCurrentIndex(index);
              scrollToIndex(index);
            }}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
    backgroundColor: 'transparent',
    height: screenHeight * 0.7, // 70% of screen height
  },
  header: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    height: '25%', // 25% of container height
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gradientStart,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flex: 1,
  },
  sectionSubtitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textPrimary,
    lineHeight: 32,
    flex: 1,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginLeft: 16,
    flex: 1,
    marginTop: 2,
  },
  navigationContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    gap: 10,
    height: '12%', // 12% of container height
    alignItems: 'center',
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  navButtonText: {
    fontSize: 20,
    color: COLORS.textPrimary,
    fontWeight: '400',
  },
  scrollView: {
    height: '53%', // 53% of container height for cards
    marginBottom: SPACING.sm,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  testimonialCard: {
    width: 220,
    height: '95%',
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  activeCard: {
    transform: [{ scale: 1.03 }],
  },
  glassBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  profileSection: {
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: COLORS.textWhite,
  },
  expandButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandIcon: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: 'bold',
  },
  contentSection: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  star: {
    fontSize: 14,
    marginHorizontal: 1,
  },
  testimonialText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
  },
  userPosition: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    height: '10%', // 10% of container height
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    marginHorizontal: 3,
    opacity: 0.6,
  },
  activeIndicator: {
    backgroundColor: COLORS.gradientStart,
    opacity: 1,
    transform: [{ scale: 1.3 }],
  },
});

export default TestimonialSection;