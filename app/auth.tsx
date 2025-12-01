import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const NEON_GREEN = '#34D399';
const BRIGHT_NEON = '#A7F3D0';
const BACKGROUND_DARK = '#000000';
const BACKGROUND_MID = '#061F14';

const AuthScreen = () => {
  return (
    <LinearGradient colors={[BACKGROUND_MID, BACKGROUND_DARK]} style={styles.container}>
      
      {/* Icon/Logo area */}
      <View style={styles.iconContainer}>
        <Ionicons name="school-outline" size={80} color={NEON_GREEN} />
      </View>

      <Text style={styles.title}>AI Study Station</Text>
      <Text style={styles.subtitle}>Start your learning journey today</Text>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push('/LoginScreen')}
      >
        <Text style={styles.loginButtonText}>Login</Text>
        <Ionicons name="log-in-outline" size={24} color={BACKGROUND_DARK} style={{marginLeft: 10}} />
      </TouchableOpacity>

      {/* Register Button */}
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => router.push('/SignupScreen')}
      >
        <Text style={styles.registerButtonText}>Create Account</Text>
        <Ionicons name="person-add-outline" size={24} color={NEON_GREEN} style={{marginLeft: 10}} />
      </TouchableOpacity>

      <Text style={styles.footerText}>Powered by AI Technology</Text>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
    shadowColor: NEON_GREEN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 10,
    letterSpacing: 1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: BRIGHT_NEON,
    marginBottom: 60,
    textAlign: 'center',
    opacity: 0.8,
  },
  loginButton: {
    width: '85%',
    backgroundColor: NEON_GREEN,
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    shadowColor: NEON_GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  loginButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: BACKGROUND_DARK,
    letterSpacing: 1,
  },
  registerButton: {
    width: '85%',
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: NEON_GREEN,
    flexDirection: 'row',
  },
  registerButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: NEON_GREEN,
    letterSpacing: 1,
  },
  footerText: {
    position: 'absolute',
    bottom: 40,
    color: '#666',
    fontSize: 12,
  },
});

export default AuthScreen;