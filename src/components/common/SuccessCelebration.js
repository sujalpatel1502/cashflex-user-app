// components/common/SuccessCelebration.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Easing,
} from 'react-native';
import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZE,
  SPACING,
  BORDER_RADIUS,
} from '../../utils';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONFETTI_COUNT = 80;

const CONFETTI_COLORS = [
  '#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1',
  '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#52BE80', '#F1948A',
  '#FF9F43', '#54A0FF', '#FD79A8', '#00CEC9',
  COLORS.gradientStart,
];

const SHAPES = ['circle', 'square', 'rect'];

// Generate confetti data once (stable across renders)
const confettiData = Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
  id: i,
  x: Math.random() * SCREEN_WIDTH,
  color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
  shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
  size: Math.random() * 10 + 6,
  delay: Math.random() * 700,
  duration: Math.random() * 1500 + 2200,
  swingAmplitude: (Math.random() - 0.5) * 140,
  rotation: Math.random() * 720 - 360,
}));

// ─── Single confetti piece ────────────────────────────────────────────────────
const ConfettiPiece = ({ piece, trigger }) => {
  const translateY = useRef(new Animated.Value(-40)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!trigger) return;

    // Reset before each run
    translateY.setValue(-40);
    translateX.setValue(0);
    rotate.setValue(0);
    opacity.setValue(0);

    Animated.parallel([
      // Fade in quickly
      Animated.sequence([
        Animated.delay(piece.delay),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 80,
          useNativeDriver: true,
        }),
      ]),
      // Fall down
      Animated.sequence([
        Animated.delay(piece.delay),
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT + 60,
          duration: piece.duration,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      // Swing sideways
      Animated.sequence([
        Animated.delay(piece.delay),
        Animated.timing(translateX, {
          toValue: piece.swingAmplitude,
          duration: piece.duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
      // Spin
      Animated.sequence([
        Animated.delay(piece.delay),
        Animated.timing(rotate, {
          toValue: 1,
          duration: piece.duration,
          useNativeDriver: true,
        }),
      ]),
      // Fade out near the bottom
      Animated.sequence([
        Animated.delay(piece.delay + piece.duration - 450),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [trigger]);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${piece.rotation}deg`],
  });

  const shapeStyle =
    piece.shape === 'circle'
      ? { borderRadius: piece.size / 2 }
      : piece.shape === 'rect'
      ? { width: piece.size * 2.2, height: piece.size * 0.55, borderRadius: 2 }
      : { borderRadius: 2 };

  return (
    <Animated.View
      style={[
        styles.confettiPiece,
        {
          left: piece.x,
          width: piece.size,
          height: piece.size,
          backgroundColor: piece.color,
          opacity,
          transform: [
            { translateY },
            { translateX },
            { rotate: rotateInterpolate },
          ],
        },
        shapeStyle,
      ]}
    />
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const SuccessCelebration = ({ visible, onDismiss, title, message }) => {
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const cardScale    = useRef(new Animated.Value(0)).current;
  const checkScale   = useRef(new Animated.Value(0)).current;
  const pulseAnim    = useRef(new Animated.Value(1)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const msgOpacity   = useRef(new Animated.Value(0)).current;
  const btnOpacity   = useRef(new Animated.Value(0)).current;
  const pulseLoop    = useRef(null);

  useEffect(() => {
    if (visible) {
      // ── Reset ──
      overlayOpacity.setValue(0);
      cardScale.setValue(0);
      checkScale.setValue(0);
      pulseAnim.setValue(1);
      titleOpacity.setValue(0);
      msgOpacity.setValue(0);
      btnOpacity.setValue(0);
      if (pulseLoop.current) {
        pulseLoop.current.stop();
      }

      // ── Step 1: fade overlay + spring card ──
      Animated.sequence([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          tension: 65,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // ── Step 2: spring check icon ──
      setTimeout(() => {
        Animated.spring(checkScale, {
          toValue: 1,
          tension: 90,
          friction: 5,
          useNativeDriver: true,
        }).start(() => {
          // ── Step 3: gentle pulse loop ──
          pulseLoop.current = Animated.loop(
            Animated.sequence([
              Animated.timing(pulseAnim, {
                toValue: 1.14,
                duration: 750,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 750,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
            ])
          );
          pulseLoop.current.start();
        });
      }, 320);

      // ── Step 4: stagger text + button ──
      setTimeout(() => {
        Animated.stagger(140, [
          Animated.timing(titleOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
          Animated.timing(msgOpacity,   { toValue: 1, duration: 380, useNativeDriver: true }),
          Animated.timing(btnOpacity,   { toValue: 1, duration: 380, useNativeDriver: true }),
        ]).start();
      }, 620);
    } else {
      if (pulseLoop.current) {
        pulseLoop.current.stop();
      }
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
      {/* ── Confetti rain ── */}
      <View style={styles.confettiContainer} pointerEvents="none">
        {confettiData.map((piece) => (
          <ConfettiPiece key={piece.id} piece={piece} trigger={visible} />
        ))}
      </View>

      {/* ── Success card ── */}
      <Animated.View style={[styles.card, { transform: [{ scale: cardScale }] }]}>

        {/* Glow rings + check */}
        <Animated.View style={[styles.glowOuter, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.glowInner}>
            <Animated.View style={{ transform: [{ scale: checkScale }] }}>
              <View style={styles.checkCircle}>
                <Text style={styles.checkMark}>✓</Text>
              </View>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
          {title || '🎉 Sale Confirmed!'}
        </Animated.Text>

        {/* Message */}
        <Animated.Text style={[styles.message, { opacity: msgOpacity }]}>
          {message ||
            'Your device sale has been confirmed.\nWe will contact you shortly for pickup.'}
        </Animated.Text>

        {/* Button */}
        <Animated.View style={[styles.btnWrapper, { opacity: btnOpacity }]}>
          <TouchableOpacity style={styles.button} onPress={onDismiss} activeOpacity={0.82}>
            <Text style={styles.buttonText}>Awesome!</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },

  // Confetti
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  confettiPiece: {
    position: 'absolute',
    top: 0,
  },

  // Card
  card: {
    backgroundColor: '#1C1C1C',
    borderRadius: 28,
    paddingVertical: 38,
    paddingHorizontal: 28,
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.83,
    zIndex: 1001,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    shadowColor: COLORS.gradientStart,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 24,
  },

  // Icon glow
  glowOuter: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: 'rgba(71, 220, 136, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },
  glowInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(71, 220, 136, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: COLORS.gradientStart,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.gradientStart,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 14,
    elevation: 12,
  },
  checkMark: {
    fontSize: 32,
    color: '#0A0A0A',
    fontWeight: '900',
    lineHeight: 36,
  },

  // Text
  title: {
    fontSize: 22,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },

  // Button
  btnWrapper: {
    width: '100%',
  },
  button: {
    backgroundColor: COLORS.gradientStart,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: 15,
    alignItems: 'center',
    width: '100%',
    shadowColor: COLORS.gradientStart,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
  buttonText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: '#0A0A0A',
  },
});

export default SuccessCelebration;