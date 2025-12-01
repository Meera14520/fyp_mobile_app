// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';

// Apne custom components ko zaroor import karein (paths check kar lein)
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';

// --- Theme Colors ---
const NEON_GREEN = '#34D399'; // Active (Selected) icon ka color
const BLACK_ICON = '#1F2937'; // Inactive (Unselected) icon ka color
const WHITE_BG = '#FFFFFF';   // Tab Bar ka background color

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // 1. ACTIVE ICON COLOR: Selected icon neon green hoga
        tabBarActiveTintColor: NEON_GREEN, 
        
        // 2. INACTIVE ICON COLOR: Unselected icon dark grey hoga
        tabBarInactiveTintColor: BLACK_ICON, 

        tabBarStyle: {
            // 3. BACKGROUND COLOR: White background
            backgroundColor: WHITE_BG, 
            borderTopColor: '#E5E7EB', // Halki grey border line
            borderTopWidth: 1, 
            height: 80, 
            paddingBottom: 15,
            paddingTop: 10,
        },
        headerShown: false, 
        tabBarButton: HapticTab,
      }}>
      
      {/* 1. DASHBOARD Tab: Ye 'app/(tabs)/dashboard.tsx' ko load karega */}
      <Tabs.Screen
        name="dashboard" 
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      
      {/* 2. CREDIT Tab: Ye 'app/(tabs)/credit.tsx' ko load karega */}
      <Tabs.Screen
        name="credit" 
        options={{
          title: 'Credit',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="creditcard.fill" color={color} />, 
        }}
      />

      {/* 3. ABOUT Tab: Ye 'app/(tabs)/about.tsx' ko load karega */}
      <Tabs.Screen
        name="about" 
        options={{
          title: 'About',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="info.circle.fill" color={color} />,
        }}
      />
      
      {/* 4. EXPLORE Tab (Agar aapka 'explore' page exist karta hai) */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      
    </Tabs>
  );
}