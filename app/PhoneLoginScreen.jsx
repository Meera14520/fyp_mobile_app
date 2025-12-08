// PhoneLoginScreen.jsx (Ensure this file is in the 'app/' directory)
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { supabase } from './supabase';

const NEON_GREEN = '#34D399';
const BRIGHT_NEON = '#A7F3D0';
const BACKGROUND_DARK = '#000000';

const PhoneLoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. Send OTP
  const handleSendOtp = async () => {
    const cleanNumber = phoneNumber.trim();

    if (!cleanNumber.startsWith('+') || cleanNumber.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number with country code (e.g., +923001234567).");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: cleanNumber,
      });

      if (error) {
        Alert.alert("OTP Error", error.message);
      } else {
        Alert.alert("Success", "Verification code sent! Check your phone.");
        setIsOtpSent(true);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify the OTP and sign in
  const handleVerifyOtp = async () => {
    const cleanNumber = phoneNumber.trim();
    const cleanOtp = otp.trim();

    if (!cleanNumber || !cleanOtp) {
      Alert.alert("Error", "Please enter phone number and the code.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: cleanNumber,
        token: cleanOtp,
        type: 'sms',
      });

      if (error) {
        Alert.alert("Verification Failed", "Invalid or expired code.");
      } else {
        
        // --- CRITICAL: Ensure profile is created for new users ---
        if (data.user?.id) {
            const { data: profile, error: profileCheckError } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', data.user.id)
              .maybeSingle();

            if (!profile && !profileCheckError) {
                 await supabase
                  .from('profiles')
                  .insert([
                    // Username set temporarily
                    { id: data.user.id, username: `User-${data.user.id.substring(0, 4)}`, mobile_no: cleanNumber } 
                  ]);
            }
        }

        // Verification successful - Redirect to Dashboard
        router.replace("/(tabs)/dashboard"); // <-- Redirects to Dashboard
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong during verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[BACKGROUND_DARK, '#081A12']} style={styles.container}>
      
      <Text style={styles.title}>Phone Login (OTP)</Text>
      <Text style={styles.sub}>Enter your number to receive a verification code</Text>

      {/* Phone Number Input */}
      <TextInput
        style={styles.input}
        placeholder="Phone Number (e.g., +92300...)"
        placeholderTextColor="#9CA3AF"
        keyboardType="phone-pad"
        autoCapitalize="none"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        editable={!isOtpSent} 
      />

      {/* OTP Input (Conditionally rendered) */}
      {isOtpSent && (
        <TextInput
          style={styles.input}
          placeholder="Enter 6-digit Code"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          secureTextEntry
          value={otp}
          onChangeText={setOtp}
          maxLength={6}
        />
      )}

      {/* Action Button */}
      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={isOtpSent ? handleVerifyOtp : handleSendOtp} 
        disabled={loading}
      >
        <Ionicons 
            name={isOtpSent ? "checkmark-done-outline" : "send-outline"} 
            size={28} 
            color="#FFFFFF" 
        />
        <Text style={styles.loginText}>
          {loading 
            ? "Processing..." 
            : isOtpSent 
                ? "Verify Code" 
                : "Send Code"
          }
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/LoginScreen')} style={{ marginTop: 20 }}>
        <Text style={styles.backText}>Else, Login with Email/Username?</Text>
      </TouchableOpacity>
      
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 38, fontWeight: '900', color: NEON_GREEN, marginBottom: 8 },
  sub: { fontSize: 16, color: BRIGHT_NEON, marginBottom: 30 },
  input: { width: '90%', backgroundColor: '#1F2937', color: '#FFFFFF', padding: 15, borderRadius: 12, fontSize: 18, marginBottom: 15, borderWidth: 1, borderColor: NEON_GREEN },
  loginButton: { width: '90%', backgroundColor: NEON_GREEN, borderRadius: 12, paddingVertical: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, gap: 10 },
  loginText: { fontSize: 22, fontWeight: '800', color: BACKGROUND_DARK },
  backText: { color: NEON_GREEN, fontSize: 16, fontWeight: '600' }
});

export default PhoneLoginScreen;