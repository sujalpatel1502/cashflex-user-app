// screens/HelpAndSupport.js
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

const HelpAndSupport = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('FAQs');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const tabs = ['FAQs', 'Help Center', 'Feedback'];

  const faqs = [
    {
      question: 'How do I list an item for sale?',
      answer: 'To list an item, go to the Sell tab, select your device category, and follow the evaluation process.',
    },
    {
      question: 'What are the fees for selling?',
      answer: 'We charge a small service fee of 5% on successful sales. The fee is deducted from your final payout.',
    },
    {
      question: 'How do I get paid?',
      answer: 'Once your device is picked up and verified, payment is processed within 24-48 hours via UPI or bank transfer.',
    },
    {
      question: 'How do I contact support?',
      answer: 'You can contact support via email at support@cashflex.com or call us at +91 1234567890.',
    },
  ];

  const handleSubmitFeedback = () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a rating before submitting');
      return;
    }
    if (!feedback.trim()) {
      Alert.alert('Feedback Required', 'Please enter your feedback');
      return;
    }

    Alert.alert('Success', 'Thank you for your feedback!');
    setRating(0);
    setFeedback('');
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const renderFAQs = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.contentTitle}>Frequently Asked Questions</Text>
      {faqs.map((faq, index) => (
        <Animatable.View
          key={index}
          animation="fadeInUp"
          duration={600}
          delay={index * 100}
        >
          <TouchableOpacity
            style={styles.faqCard}
            onPress={() => toggleFaq(index)}
            activeOpacity={0.8}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Icon
                name={expandedFaq === index ? 'chevron-up' : 'chevron-down'}
                size={24}
                color={COLORS.textSecondary}
              />
            </View>
            {expandedFaq === index && (
              <Animatable.View animation="fadeInDown" duration={300}>
                <View style={styles.faqAnswerContainer}>
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                </View>
              </Animatable.View>
            )}
          </TouchableOpacity>
        </Animatable.View>
      ))}
    </View>
  );

  const renderHelpCenter = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.contentTitle}>Contact Information</Text>

      <Animatable.View animation="fadeInUp" duration={600} delay={200}>
        <View style={styles.contactCard}>
          <View style={styles.contactIconWrapper}>
            <Icon name="map-marker" size={24} color={COLORS.gradientStart} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Address</Text>
            <Text style={styles.contactValue}>
              S.G Highway, Gota, Ahmedabad{'\n'}Gujarat, India - 380061
            </Text>
          </View>
        </View>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={600} delay={400}>
        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => Linking.openURL('tel:+911234567890')}
          activeOpacity={0.7}
        >
          <View style={styles.contactIconWrapper}>
            <Icon name="phone" size={24} color={COLORS.gradientStart} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Phone</Text>
            <Text style={styles.contactValue}>+91 1234567890</Text>
          </View>
          <Icon name="chevron-right" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={600} delay={600}>
        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => Linking.openURL('mailto:support@cashflex.com')}
          activeOpacity={0.7}
        >
          <View style={styles.contactIconWrapper}>
            <Icon name="email" size={24} color={COLORS.gradientStart} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>support@cashflex.com</Text>
          </View>
          <Icon name="chevron-right" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={600} delay={800}>
        <View style={styles.contactCard}>
          <View style={styles.contactIconWrapper}>
            <Icon name="clock" size={24} color={COLORS.gradientStart} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Working Hours</Text>
            <Text style={styles.contactValue}>
              Monday - Saturday: 9:00 AM - 6:00 PM{'\n'}Sunday: Closed
            </Text>
          </View>
        </View>
      </Animatable.View>
    </View>
  );

  const renderFeedback = () => (
    <View style={styles.contentContainer}>
      <Animatable.View animation="fadeInUp" duration={600} delay={200}>
        <Text style={styles.feedbackTitle}>How was your experience?</Text>
        <Text style={styles.feedbackSubtitle}>Your feedback helps us improv</Text>

        {/* Rating Stars */}
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              activeOpacity={0.7}
            >
              <Icon
                name={star <= rating ? 'star' : 'star-outline'}
                size={40}
                color={star <= rating ? '#FFA500' : COLORS.textSecondary}
                style={styles.starIcon}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Feedback Input */}
        <View style={styles.feedbackInputContainer}>
          <TextInput
            style={styles.feedbackInput}
            value={feedback}
            onChangeText={setFeedback}
            placeholder="Leave a comment...."
            placeholderTextColor={COLORS.textSecondary}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity onPress={handleSubmitFeedback} activeOpacity={0.8}>
          <View style={styles.submitButton}>
            <LinearGradient
              colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitGradient}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.submitButtonText}>Submit feedback</Text>
              </View>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomScreenHeader
        title="Help & Support"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'FAQs' && renderFAQs()}
        {activeTab === 'Help Center' && renderHelpCenter()}
        {activeTab === 'Feedback' && renderFeedback()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpAndSupport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {},
  tabText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.textPrimary,
    fontFamily: FONT_FAMILY.bold,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.gradientStart,
  },

  // Content
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
  },
  contentTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },

  // FAQs - EXPANDABLE
  faqCard: {
    backgroundColor: '#262626',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textPrimary,
  },
  faqAnswerContainer: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  faqAnswer: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  // Help Center
  contactCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#262626',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  contactIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(71, 220, 136, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },

  // Feedback
  feedbackTitle: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  feedbackSubtitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#262626',
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  starIcon: {
    marginHorizontal: 4,
  },
  feedbackInputContainer: {
    backgroundColor: '#3A3A3A',
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xl,
  },
  feedbackInput: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textPrimary,
    padding: SPACING.md,
    minHeight: 150,
  },
  submitButton: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  submitGradient: {
    width: '100%',
  },
  buttonContent: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.background,
  },
});
