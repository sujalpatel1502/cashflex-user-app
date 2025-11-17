import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { CustomCard, CustomButton } from '../components/common';
import CustomScreenHeader from '../components/common/CustomScreenHeader';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING, BORDER_RADIUS } from '../utils';

const { width: screenWidth } = Dimensions.get('window');

const ServicesScreen = ({ navigation }) => {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      id: 1,
      title: 'Sell Your Device',
      subtitle: 'Get instant cash for your old device',
      description: 'Sell your smartphone, laptop, tablet or any other device and get instant cash with doorstep pickup service.',
      icon: 'cash-multiple',
      color: COLORS.success,
      gradient: ['#4CAF50', '#45a049'],
      features: ['Instant Price Quote', 'Free Doorstep Pickup', 'Instant Payment', '32-Point Quality Check'],
    },
    {
      id: 2,
      title: 'Buy Refurbished',
      subtitle: 'Quality assured refurbished devices',
      description: 'Buy certified refurbished devices with warranty and quality assurance at unbeatable prices.',
      icon: 'shopping',
      color: COLORS.gradientStart,
      gradient: [COLORS.gradientStart, COLORS.gradientEnd],
      features: ['6-Month Warranty', '32-Point Quality Check', 'COD Available', 'Easy Returns'],
    },
    {
      id: 3,
      title: 'Repair Service',
      subtitle: 'Doorstep repair service',
      description: 'Professional repair service for your devices with genuine parts and expert technicians.',
      icon: 'tools',
      color: COLORS.warning,
      gradient: ['#FF9800', '#F57C00'],
      features: ['Doorstep Service', 'Genuine Parts', 'Expert Technicians', '90-Day Warranty'],
    },
    {
      id: 4,
      title: 'Device Exchange',
      subtitle: 'Exchange old for new',
      description: 'Exchange your old device and get the best value while upgrading to a newer model.',
      icon: 'swap-horizontal',
      color: COLORS.info,
      gradient: ['#2196F3', '#1976D2'],
      features: ['Best Exchange Value', 'Instant Upgrade', 'Quality Check', 'Hassle-Free Process'],
    },
  ];

  const howItWorks = [
    { 
      step: 1, 
      title: 'Select Service', 
      description: 'Choose the service you need',
      icon: 'cursor-pointer'
    },
    { 
      step: 2, 
      title: 'Get Quote', 
      description: 'Get instant price quote',
      icon: 'calculator'
    },
    { 
      step: 3, 
      title: 'Schedule Pickup', 
      description: 'Book doorstep service',
      icon: 'truck'
    },
    { 
      step: 4, 
      title: 'Get Paid', 
      description: 'Receive instant payment',
      icon: 'credit-card'
    },
  ];

  const handleServiceSelect = (serviceId) => {
    setSelectedService(selectedService === serviceId ? null : serviceId);
  };

  const handleGetStarted = (service) => {
    console.log(`Starting ${service.title}`);
  };

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <CustomScreenHeader 
        title="Our Services"
        subtitle="Choose what works best for you"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Services Grid */}
        <Animatable.View animation="fadeInUp" duration={800} style={styles.servicesSection}>
          <FlatGrid
            itemDimension={150}
            data={services}
            style={styles.servicesGrid}
            spacing={SPACING.sm}
            renderItem={({ item }) => (
              <CustomCard 
                style={[
                  styles.serviceCard, 
                  selectedService === item.id && styles.selectedCard
                ]} 
                onPress={() => handleServiceSelect(item.id)}
              >
                <View style={[styles.serviceIcon, { backgroundColor: `${item.color}20` }]}>
                  <Icon name={item.icon} size={32} color={item.color} />
                </View>
                <Text style={styles.serviceTitle}>{item.title}</Text>
                <Text style={styles.serviceSubtitle}>{item.subtitle}</Text>
                
                {selectedService === item.id && (
                  <View style={styles.selectedIndicator}>
                    <Icon name="check-circle" size={20} color={COLORS.success} />
                  </View>
                )}
              </CustomCard>
            )}
          />
        </Animatable.View>

        {/* Service Details */}
        {selectedService && (
          <Animatable.View animation="fadeInUp" duration={500} style={styles.serviceDetails}>
            {services
              .filter(service => service.id === selectedService)
              .map(service => (
                <CustomCard key={service.id} style={styles.detailCard}>
                  <View style={styles.detailHeader}>
                    <View style={[styles.detailIcon, { backgroundColor: `${service.color}20` }]}>
                      <Icon name={service.icon} size={24} color={service.color} />
                    </View>
                    <View style={styles.detailInfo}>
                      <Text style={styles.detailTitle}>{service.title}</Text>
                      <Text style={styles.detailDescription}>{service.description}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.featuresTitle}>Key Features:</Text>
                  {service.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <Icon name="check-circle" size={16} color={COLORS.success} />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                  
                  <CustomButton
                    title="Get Started"
                    style={[styles.actionButton, { backgroundColor: service.color }]}
                    onPress={() => handleGetStarted(service)}
                  />
                </CustomCard>
              ))}
          </Animatable.View>
        )}

        {/* How It Works */}
        <Animatable.View animation="fadeInUp" duration={800} delay={400} style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          {howItWorks.map((item, index) => (
            <CustomCard key={item.step} style={styles.stepCard}>
              <View style={styles.stepContent}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{item.step}</Text>
                </View>
                <View style={styles.stepInfo}>
                  <Text style={styles.stepTitle}>{item.title}</Text>
                  <Text style={styles.stepDescription}>{item.description}</Text>
                </View>
                <View style={styles.stepIcon}>
                  <Icon name={item.icon} size={20} color={COLORS.gradientStart} />
                </View>
              </View>
              {/* {index < howItWorks.length - 1 && <View style={styles.stepConnector} />} */}
            </CustomCard>
          ))}
        </Animatable.View>

        {/* CTA Section */}
        <Animatable.View animation="fadeInUp" duration={800} delay={600} style={styles.ctaSection}>
          <CustomCard style={styles.ctaCard}>
            <View style={styles.ctaHeader}>
              <Icon name="rocket-launch" size={32} color={COLORS.gradientStart} />
              <Text style={styles.ctaTitle}>Ready to get started?</Text>
            </View>
            <Text style={styles.ctaSubtitle}>Join thousands of satisfied customers</Text>
            <View style={styles.ctaButtons}>
              <CustomButton
                title="Sell Your Device"
                style={[styles.ctaButton, { backgroundColor: COLORS.success }]}
                onPress={() => handleGetStarted(services[0])}
              />
              <CustomButton
                title="Buy Refurbished"
                style={[styles.ctaButton, { backgroundColor: COLORS.gradientStart }]}
                onPress={() => handleGetStarted(services[1])}
              />
            </View>
          </CustomCard>
        </Animatable.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  content: {
    flex: 1,
  },
  servicesSection: {
    padding: SPACING.md,
  },
  servicesGrid: {
    marginBottom: SPACING.md,
  },
  serviceCard: {
    alignItems: 'center',
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    position: 'relative',
  },
  selectedCard: {
    borderColor: COLORS.gradientStart,
    backgroundColor: `${COLORS.gradientStart}05`,
    elevation: 6,
    shadowColor: COLORS.gradientStart,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  serviceIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  serviceTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  serviceSubtitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  selectedIndicator: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
  },
  serviceDetails: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  detailCard: {
    padding: SPACING.lg,
  },
  detailHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  detailIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  detailInfo: {
    flex: 1,
  },
  detailTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  detailDescription: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  featuresTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  featureText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  actionButton: {
    marginTop: SPACING.md,
  },
  section: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  stepCard: {
    marginBottom: SPACING.sm,
    position: 'relative',
  },
  stepContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gradientStart,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  stepNumberText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textWhite,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  stepDescription: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
  },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${COLORS.gradientStart}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepConnector: {
    position: 'absolute',
    left: 39,
    top: 60,
    width: 2,
    height: 30,
    backgroundColor: COLORS.borderLight,
  },
  ctaSection: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  ctaCard: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.backgroundLight,
  },
  ctaHeader: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  ctaTitle: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  ctaButtons: {
    width: '100%',
  },
  ctaButton: {
    marginBottom: SPACING.sm,
  },
  bottomSpacing: {
    height: SPACING.xl,
  },
});

export default ServicesScreen;
