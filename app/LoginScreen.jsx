import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react'; // useEffect import kiya
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { supabase } from './supabase';

const NEON_GREEN = '#34D399';
const BRIGHT_NEON = '#A7F3D0';
const BACKGROUND_DARK = '#000000';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // *** CRITICAL FIX ***
  // Jab bhi Login Screen khule, purana session kill kar do.
  // Is se "Auto Jump" wala masla khatam ho jayega.
  useEffect(() => {
    const clearSession = async () => {
      await supabase.auth.signOut();
    };
    clearSession();
  }, []);

  const handleLogin = async () => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      // Sirf yahan user sign in hoga
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword
      });

      if (error) {
        Alert.alert("Login Failed", "Invalid Email or Password");
        setLoading(false);
        return;
      }

      // Login successful - Ab Dashboard par bhejo
      router.replace("/(tabs)/dashboard");

    } catch (err) {
      Alert.alert("Error", "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[BACKGROUND_DARK, '#081A12']} style={styles.container}>
      
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.sub}>Please Login to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#9CA3AF"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#9CA3AF"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        <Ionicons name="log-in-outline" size={28} color="#FFFFFF" />
        <Text style={styles.loginText}>{loading ? "Logging in..." : "Login"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/SignupScreen')} style={{ marginTop: 20 }}>
        <Text style={styles.backText}>Need an account? Register Here</Text>
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

export default LoginScreen;