// screens/QuestionnaireScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZE,
  SPACING,
  BORDER_RADIUS,
} from '../utils';
import { CustomScreenHeader } from '../components/common';
import QuestionareApi from '../services/questionareApi';
import axios from 'axios';
import Config from 'react-native-config';


const QuestionnaireScreen = ({ route }) => {
  const navigation = useNavigation();
  const { productDetails, selectedVariant, model, brand, category } = route.params;
  const insets = useSafeAreaInsets();


  const [loading, setLoading] = useState(true);
  const [questionnaireData, setQuestionnaireData] = useState(null);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [calculating, setCalculating] = useState(false);


  // Get valid screens (with questions)
  const validScreens = questionnaireData?.questionnaire?.screens?.filter(
    screen => screen.questions && screen.questions.length > 0
  ) || [];


  const currentScreen = validScreens[currentScreenIndex];
  const isLastScreen = currentScreenIndex === validScreens.length - 1;
  const progress = ((currentScreenIndex + 1) / validScreens.length) * 100;


  useEffect(() => {
    fetchQuestionnaire();
  }, []);


  const fetchQuestionnaire = async () => {
    try {
      setLoading(true);
      const response = await QuestionareApi.getQuestionareById(model.id);
      console.log('Questionnaire response:', response);
      
      if (response && response.success) {
        setQuestionnaireData(response);
      }
    } catch (error) {
      console.error('Error fetching questionnaire:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleOptionSelect = (question, option) => {
    const screenId = currentScreen.Screen_Id;
    const questionId = question.Question_Id;
    const optionId = option.Option_Id;


    if (question.Type === 'Radio') {
      // Remove any existing response for this question
      const filteredResponses = responses.filter(
        r => !(r.screenId === screenId && r.questionId === questionId)
      );
      setResponses([...filteredResponses, { screenId, questionId, optionId }]);
    } else if (question.Type === 'CheckBox') {
      // Toggle checkbox
      const existingIndex = responses.findIndex(
        r => r.screenId === screenId && r.questionId === questionId && r.optionId === optionId
      );
      
      if (existingIndex > -1) {
        // Remove if already selected
        const newResponses = [...responses];
        newResponses.splice(existingIndex, 1);
        setResponses(newResponses);
      } else {
        // Add new selection
        setResponses([...responses, { screenId, questionId, optionId }]);
      }
    }
  };


  const isOptionSelected = (question, option) => {
    return responses.some(
      r =>
        r.screenId === currentScreen.Screen_Id &&
        r.questionId === question.Question_Id &&
        r.optionId === option.Option_Id
    );
  };


  const canProceed = () => {
    if (!currentScreen) return false;


    const requiredQuestions = currentScreen.questions.filter(q => q.isRequired === 1);
    
    for (const question of requiredQuestions) {
      const hasResponse = responses.some(
        r => r.screenId === currentScreen.Screen_Id && r.questionId === question.Question_Id
      );
      if (!hasResponse) return false;
    }
    
    return true;
  };


  const handleNext = () => {
    if (isLastScreen) {
      calculateFinalPrice();
    } else {
      setCurrentScreenIndex(currentScreenIndex + 1);
    }
  };


  const handleBack = () => {
    if (currentScreenIndex > 0) {
      setCurrentScreenIndex(currentScreenIndex - 1);
    } else {
      navigation.goBack();
    }
  };


  const calculateFinalPrice = async () => {
    try {
      setCalculating(true);


      const payload = {
        selectedProduct: {
          product_id: productDetails.product_id,
          product_name: productDetails.product_name,
          brand_name: productDetails.brand_name,
          category_name: productDetails.category_name,
          product_image: productDetails.product_image,
          unique_specifications: productDetails.unique_specifications,
          leadPrice: productDetails.leadPrice,
          variant: {
            variant_id: selectedVariant.variant_id,
            variant_name: selectedVariant.variant_name,
            variant_price: selectedVariant.variant_price,
            specification: selectedVariant.specification,
          },
        },
        response: responses,
      };


      console.log('Payload:', JSON.stringify(payload, null, 2));


      const response = await axios.post(
        `${Config.API_URL}/pricerangewiseoptiondeduction/calculatePrice`,
        payload
      );


      console.log('Final price response:', response.data);


      if (response.data && response.data.success) {
        navigation.navigate('FinalPrice', {
          ...route.params,
          finalPrice: response.data.product_price,
          responses: responses,
        });
      }
    } catch (error) {
      console.error('Error calculating price:', error);
    } finally {
      setCalculating(false);
    }
  };


  // Calculate bottom padding including safe area
  const bottomPadding = Platform.OS === 'ios' 
    ? 100 + insets.bottom 
    : 100 + Math.max(insets.bottom, 0);


  const renderQuestion = (question, index) => {
    return (
      <Animatable.View
        key={question.Question_Id}
        animation="fadeInUp"
        duration={600}
        delay={index * 100}
        style={styles.questionContainer}
      >
        {question.Question_Name && (
          <View style={styles.questionHeader}>
            <Text style={styles.questionText}>{question.Question_Name}</Text>
            {question.isRequired === 1 && (
              <Text style={styles.requiredTag}>Required</Text>
            )}
          </View>
        )}


        <View style={styles.optionsContainer}>
          {question.options.map((option, optIndex) => {
            const selected = isOptionSelected(question, option);
            
            return (
              <TouchableOpacity
                key={option.Option_Id}
                style={[
                  styles.optionCard,
                  selected && styles.optionCardSelected,
                ]}
                onPress={() => handleOptionSelect(question, option)}
                activeOpacity={0.7}
              >
                {option.Option_Image && (
                  <Image
                    source={{ uri: option.Option_Image }}
                    style={styles.optionImage}
                    resizeMode="contain"
                  />
                )}
                
                <View style={styles.optionContent}>
                  <View style={styles.optionTextContainer}>
                    <Text style={[styles.optionName, selected && styles.optionNameSelected]}>
                      {option.Option_Name}
                    </Text>
                    {option.Option_Short_Description && (
                      <Text style={styles.optionDescription}>
                        {option.Option_Short_Description}
                      </Text>
                    )}
                  </View>


                  <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                    {selected && (
                      <Icon name="check" size={18} color={COLORS.background} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animatable.View>
    );
  };


  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <CustomScreenHeader
          title="Questions"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.gradientStart} />
          <Text style={styles.loaderText}>Loading questions...</Text>
        </View>
      </SafeAreaView>
    );
  }


  if (!currentScreen) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <CustomScreenHeader
          title="Questions"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loaderContainer}>
          <Text style={styles.loaderText}>No questions available</Text>
        </View>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomScreenHeader
        title="Answer Questions"
        showBackButton={true}
        onBackPress={handleBack}
      />


      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animatable.View
            animation="fadeIn"
            style={[styles.progressFill, { width: `${progress}%` }]}
          />
        </View>
        <Text style={styles.progressText}>
          {currentScreenIndex + 1} of {validScreens.length}
        </Text>
      </View>


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding },
        ]}
      >
        {/* Screen Title */}
        {currentScreen.Title && (
          <Animatable.View animation="fadeIn" duration={800}>
            <Text style={styles.screenTitle}>{currentScreen.Title}</Text>
          </Animatable.View>
        )}


        {/* Screen Description */}
        {currentScreen.Description && (
          <Animatable.View animation="fadeIn" duration={800} delay={200}>
            <Text style={styles.screenDescription}>{currentScreen.Description}</Text>
          </Animatable.View>
        )}


        {/* Questions */}
        {currentScreen.questions.map((question, index) =>
          renderQuestion(question, index)
        )}
      </ScrollView>


      {/* Bottom Button */}
      <Animatable.View
        animation="fadeInUp"
        duration={600}
        style={[
          styles.bottomButtonContainer,
          {
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.8}
          disabled={!canProceed() || calculating}
        >
          <View style={styles.buttonWrapper}>
            <LinearGradient
              colors={
                canProceed() && !calculating
                  ? [COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]
                  : ['#4A4A4A', '#3A3A3A']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <View style={styles.buttonContent}>
                {calculating ? (
                  <>
                    <ActivityIndicator size="small" color={COLORS.background} />
                    <Text style={[styles.buttonText, { marginLeft: 8 }]}>
                      Calculating...
                    </Text>
                  </>
                ) : (
                  <Text style={styles.buttonText}>
                    {isLastScreen ? 'Get Final Price' : 'Continue'}
                  </Text>
                )}
              </View>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    </SafeAreaView>
  );
};


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
    marginTop: SPACING.sm,
  },
  
  // Progress Bar
  progressContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#3A3A3A',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.gradientStart,
    borderRadius: 3,
  },
  progressText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },


  // Content
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    flexGrow: 1,
  },
  screenTitle: {
    fontSize: FONT_SIZE.xxl,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  screenDescription: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },


  // Question
  questionContainer: {
    marginBottom: SPACING.xl,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  questionText: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  requiredTag: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.gradientStart,
    marginLeft: SPACING.sm,
  },


  // Options
  optionsContainer: {
    gap: SPACING.sm,
  },
  optionCard: {
    backgroundColor: '#262626',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: COLORS.gradientStart,
    backgroundColor: 'rgba(71, 220, 136, 0.1)',
  },
  optionImage: {
    width: '100%',
    height: 120,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.sm,
    backgroundColor: '#3A3A3A',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionTextContainer: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  optionName: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  optionNameSelected: {
    color: COLORS.gradientStart,
  },
  optionDescription: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.gradientStart,
    borderColor: COLORS.gradientStart,
  },


  // Bottom Button
  bottomButtonContainer: {
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
  buttonWrapper: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  gradientButton: {
    width: '100%',
  },
  buttonContent: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.background,
  },
});


export default QuestionnaireScreen;
