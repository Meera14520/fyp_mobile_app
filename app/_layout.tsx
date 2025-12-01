import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from './AuthProvider';

// Woh screens jo sirf LOGGED OUT users ke liye hain (Guest Screens)
const GUEST_SCREENS = ['index', 'auth', 'LoginScreen', 'SignupScreen', 'register'];

function InitialLayout() {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const routerReady = !isLoading;
  const isAuthenticated = !!session;

  useEffect(() => {
    if (!routerReady) return;

    const currentSegment = segments[0];
    
    // Check karein ke kya user abhi Guest Screen par hai?
    // (!currentSegment ka matlab hai ke user root '/' par hai, jo ke index hai)
    const isGuestScreen = !currentSegment || GUEST_SCREENS.includes(currentSegment);

    // 1. Agar user Logged In hai aur Guest Screen (Welcome/Login) par hai
    // Action: Dashboard par bhej dein
    if (isAuthenticated && isGuestScreen) {
      router.replace('/(tabs)/dashboard');
      return;
    }

    // 2. Agar user Logged Out hai aur Protected Screen (Dashboard/AI Gen) par hai
    // Action: Welcome screen par bhej dein
    // Note: Protected Screen = Jo Guest Screen nahi hai
    if (!isAuthenticated && !isGuestScreen) {
      router.replace('/');
      return;
    }

    // 3. Agar user Logged In hai aur AI Gen/Editor par hai -> KUCH NA KAREIN (Allow Access)

  }, [isAuthenticated, segments, routerReady]);

  if (isLoading) {
    return null; 
  }

  return (
    <Stack>
        {/* --- Public/Guest Screens --- */}
        <Stack.Screen name="index" options={{ headerShown: false, title: 'Welcome' }} />
        <Stack.Screen name="auth" options={{ headerShown: false, title: 'Auth Choice' }} />
        <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
        <Stack.Screen name="SignupScreen" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} /> 
        
        {/* --- Protected Screens (In par ab logged-in user ja sakega) --- */}
      <Stack.Screen name="AIGeneratorScreen" options={{ headerShown: false }} />
<Stack.Screen name="editor" options={{ headerShown: false }} />
<Stack.Screen name="notes" options={{ headerShown: false }} />
<Stack.Screen name="print" options={{ headerShown: false }} />
<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

export const unstable_settings = {
  initialRouteName: 'index', 
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <InitialLayout />
          <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}