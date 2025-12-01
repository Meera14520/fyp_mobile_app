import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

// --- Color Palette ---
const NEON_GREEN = '#34D399';
const BRIGHT_NEON = '#A7F3D0';
const DARK_SUBTITLE = '#10B981';
const BACKGROUND_DARK = '#000000';
const BACKGROUND_MID = '#061F14';
const RING_COLOR = NEON_GREEN;

// --- Components ---

function AnimatedRing() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 9000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.ringContainer, animatedStyle]}>
      <View style={[styles.ring, { width: 160, height: 160, opacity: 0.25 }]} />
      <View style={[styles.ring, { width: 120, height: 120, opacity: 0.5, top: 20, left: 20 }]} />
      <View style={[styles.ring, { width: 190, height: 190, opacity: 0.15, top: -15, left: -15 }]} />
    </Animated.View>
  );
}

type TypingEffectProps = {
  text: string;
  delay?: number;
  duration?: number;
  style?: any;
};

function TypingEffect({ text, delay = 0, duration = 1500, style }: TypingEffectProps) {
  const textOpacity = useSharedValue(0);
  useEffect(() => {
    textOpacity.value = withDelay(delay, withTiming(1, { duration: 800 }));
  }, []);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: textOpacity.value }));
  return <Animated.Text style={[style, animatedStyle]}>{text}</Animated.Text>;
}

export default function WelcomeScreen() {
  const textOpacity = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    textOpacity.value = withDelay(500, withTiming(1, { duration: 1000 }));
    pulse.value = withRepeat(
      withTiming(1.05, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const welcomeTextStyle = useAnimatedStyle(() => ({ opacity: textOpacity.value }));
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  // --- ACTION: Go to Auth Screen ---
  const handlePress = () => {
    router.push('/auth');
  };

  return (
    <LinearGradient colors={[BACKGROUND_MID, BACKGROUND_DARK]} style={styles.container}>
      <Animated.Text style={[styles.contextText, welcomeTextStyle]}>
        Your AI-Powered Study Hub
      </Animated.Text>

      <View style={styles.ringWrapper}>
        <AnimatedRing />
      </View>

      <View style={styles.mainTextWrapper}>
        <TypingEffect text="Welcome to" delay={400} duration={900} style={styles.subtitleText} />
        <View style={{ alignItems: 'center' }}>
          <TypingEffect text="AI STUDY" delay={1200} style={styles.mainPromptTop} />
          <TypingEffect text="STATION" delay={2000} style={styles.mainPromptBottom} />
        </View>
      </View>

      <Animated.View style={[styles.buttonAbsoluteContainer, pulseStyle]}> 
        <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
          <LinearGradient
            colors={[NEON_GREEN, '#16A34A']}
            style={styles.beginButton}
          >
            <Text style={styles.beginButtonText}>Tap to Begin</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 80, alignItems: 'center', backgroundColor: BACKGROUND_DARK },
  contextText: { fontSize: 18, color: DARK_SUBTITLE, textAlign: 'center', marginBottom: 10, letterSpacing: 2, fontWeight: '600' },
  mainTextWrapper: { position: 'absolute', top: '38%', alignItems: 'center' },
  subtitleText: { fontSize: 28, color: BRIGHT_NEON, marginBottom: 5, letterSpacing: 1.5 },
  mainPromptTop: { fontSize: 55, fontWeight: '900', color: '#FFFFFF', letterSpacing: 3 },
  mainPromptBottom: { fontSize: 60, fontWeight: '900', color: NEON_GREEN, letterSpacing: 6, textShadowColor: NEON_GREEN, textShadowRadius: 10 },
  buttonAbsoluteContainer: { position: 'absolute', bottom: 100 },
  beginButton: { paddingVertical: 16, paddingHorizontal: 60, borderRadius: 35, shadowColor: NEON_GREEN, shadowOpacity: 1, shadowRadius: 15, elevation: 15 },
  beginButtonText: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1.5 },
  ringWrapper: { position: 'absolute', top: '30%', justifyContent: 'center', alignItems: 'center' },
  ringContainer: { justifyContent: 'center', alignItems: 'center' },
  ring: { position: 'absolute', borderRadius: 999, borderWidth: 2, borderColor: RING_COLOR, shadowColor: RING_COLOR, shadowOpacity: 1, shadowRadius: 10 },
});