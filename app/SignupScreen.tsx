import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { supabase } from './supabase';

const NEON_GREEN = '#34D399';
const BRIGHT_NEON = '#A7F3D0';
const BACKGROUND_DARK = '#000000';

const SignupScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    const cleanUsername = username.trim();

    if (!cleanUsername || !cleanEmail || !cleanPassword) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    if (cleanPassword !== rePassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // 1. Sign up (Account create karein)
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
        options: {
          data: { username: cleanUsername }
        }
      });

      if (error) {
        Alert.alert("Registration Failed", error.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        // 2. Profile create karein
        await supabase.from("profiles").insert({
          id: data.user.id,
          email: cleanEmail,
          username: cleanUsername
        });

        // *** CRITICAL FIX ***
        // Register ke foran baad session kill karein taake 'Auto-Login' na ho
        // Aur user Login Screen par manually login kare.
        await supabase.auth.signOut(); 

        Alert.alert("Success", "Account created successfully! Please Login.");
        router.replace('/LoginScreen');
      }

    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[BACKGROUND_DARK, '#081A12']} style={styles.container}>
      
      <Text style={styles.title}>Register</Text>
      <Text style={styles.sub}>Create account to login manually</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#9CA3AF"
        value={username}
        onChangeText={setUsername}
      />

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

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#9CA3AF"
        secureTextEntry
        value={rePassword}
        onChangeText={setRePassword}
      />

      <TouchableOpacity 
        style={styles.registerButton} 
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.registerText}>
          {loading ? "Creating..." : "Register"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/LoginScreen')} style={{ marginTop: 20 }}>
        <Text style={styles.backText}>Already have an account? Login</Text>
      </TouchableOpacity>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 36, fontWeight: '900', color: NEON_GREEN, marginBottom: 8 },
  sub: { fontSize: 16, color: BRIGHT_NEON, marginBottom: 30 },
  input: { width: '90%', backgroundColor: '#1F2937', color: '#FFFFFF', padding: 15, borderRadius: 12, fontSize: 18, marginBottom: 15, borderWidth: 1, borderColor: NEON_GREEN },
  registerButton: { width: '90%', backgroundColor: NEON_GREEN, borderRadius: 12, paddingVertical: 18, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  registerText: { fontSize: 22, fontWeight: '800', color: BACKGROUND_DARK },
  backText: { color: NEON_GREEN, fontSize: 16, fontWeight: '600' }
});

export default SignupScreen;