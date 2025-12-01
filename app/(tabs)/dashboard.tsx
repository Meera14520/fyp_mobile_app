import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Agar supabase file root app directory mein hai to './supabase' path sahi hai.
import { supabase } from '../supabase';

// --- Theme Colors ---
const NEON_GREEN = '#34D399';
const BRIGHT_NEON = '#A7F3D0';
const BACKGROUND_DARK = '#000000';
const CARD_BG = '#111111'; 

// Note: Agar aapne file 'app/(tabs)/index.tsx' mein move ki hai, to yahan 'Dashboard' ki jagah 'export default function Page() {' use karein
const Dashboard = () => {
  const [username, setUsername] = useState('Student');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Redirect to Login if no session
        router.replace('/LoginScreen');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        if (profile && profile.username) {
          setUsername(profile.username);
        } else {
          setUsername(user.email?.split('@')[0] || 'Student');
        }
      }
    } catch (e) {
      console.log("Session Error:", e);
      router.replace('/LoginScreen');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace('/LoginScreen');
        }
      }
    ]);
  };
  
  const handleProfilePress = () => {
      // Create a profile-settings.tsx screen in app/ to handle this
      router.push('/profile-settings' as any); 
  };


  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={NEON_GREEN} />
      </View>
    );
  }

  return (
    <LinearGradient colors={[BACKGROUND_DARK, '#051e15']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* --- TOP HEADER (Profile and Logout Icons) --- */}
        <View style={styles.header}>
            <View>
                <Text style={styles.greeting}>Welcome Back!</Text>
                <Text style={styles.usernameText}>{username} 👋</Text>
            </View>
            
            <View style={styles.iconGroup}>
                {/* 1. PROFILE ICON */}
                <TouchableOpacity 
                    style={styles.iconButton} 
                    onPress={handleProfilePress}
                >
                    <Ionicons name="person-circle-outline" size={28} color={NEON_GREEN} />
                </TouchableOpacity>

                {/* 2. Logout ICON */}
                <TouchableOpacity 
                    style={styles.iconButton} 
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={26} color={NEON_GREEN} />
                </TouchableOpacity>
            </View>
        </View>

        {/* --- BIG HERO CARD (Progress) --- */}
        <LinearGradient 
            colors={[NEON_GREEN, '#059669']} 
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 1 }} 
            style={styles.heroCard}
        >
            <View style={styles.heroHeader}>
                <Text style={styles.heroLabel}>Weekly Progress</Text>
                <View style={styles.heroIconBadge}>
                  <Ionicons name="trending-up" size={20} color="#000" />
                </View>
            </View>
            
            <Text style={styles.heroValue}>85% Goal</Text>
            <Text style={styles.heroSubText}>Achieved this week</Text>

            <View style={styles.graphContainer}>
                <View style={styles.graphLineBase} />
                <View style={[styles.graphLineActive, {width: '85%'}]} /> 
                <View style={[styles.graphDot, {left: '83%'}]} />
            </View>
            
            <View style={styles.statRow}>
               <Text style={styles.statText}>+12 Study Hours</Text>
               <Text style={styles.statText}>5 Tasks Done</Text>
            </View>
        </LinearGradient>

        {/* --- FEATURES GRID (4 Buttons) --- */}
        <Text style={styles.sectionTitle}>Dashboard Tools</Text>
        
        <View style={styles.gridContainer}>
            {/* 1. Print */}
            <TouchableOpacity style={styles.gridCard} onPress={() => router.push('/print' as any)}>
                <View style={[styles.iconBg, { backgroundColor: 'rgba(52, 211, 153, 0.15)' }]}>
                    <Ionicons name="print" size={28} color={NEON_GREEN} />
                </View>
                <Text style={styles.gridTitle}>Print</Text>
                <Text style={styles.gridSub}>Notes & PDFs</Text>
            </TouchableOpacity>

            {/* 2. AI Generator */}
            <TouchableOpacity style={styles.gridCard} onPress={() => router.push('/AIGeneratorScreen' as any)}>
                <View style={[styles.iconBg, { backgroundColor: 'rgba(167, 243, 208, 0.15)' }]}>
                    <Ionicons name="flash" size={28} color={BRIGHT_NEON} />
                </View>
                <Text style={styles.gridTitle}>AI Gen</Text>
                <Text style={styles.gridSub}>Smart Content</Text>
            </TouchableOpacity>

            {/* 3. Editor */}
            <TouchableOpacity style={styles.gridCard} onPress={() => router.push('/editor' as any)}>
                <View style={[styles.iconBg, { backgroundColor: 'rgba(52, 211, 153, 0.15)' }]}>
                    <Ionicons name="create" size={28} color={NEON_GREEN} />
                </View>
                <Text style={styles.gridTitle}>Editor</Text>
                <Text style={styles.gridSub}>Write & Edit</Text>
            </TouchableOpacity>

            {/* 4. My Notes */}
            <TouchableOpacity style={styles.gridCard} onPress={() => router.push('/MyNotesScreen' as any)}>
                <View style={[styles.iconBg, { backgroundColor: 'rgba(167, 243, 208, 0.15)' }]}>
                    <Ionicons name="book" size={28} color={BRIGHT_NEON} />
                </View>
                <Text style={styles.gridTitle}>My Notes</Text>
                <Text style={styles.gridSub}>Saved Files</Text>
            </TouchableOpacity>
        </View>

        {/* --- RECENT ACTIVITY --- */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.listCard}>
            <View style={styles.listItem}>
                <View style={styles.listIconBox}>
                    <Ionicons name="document-text" size={22} color="#FFF" />
                </View>
                <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text style={styles.listMainText}>Chemistry_Notes.pdf</Text>
                    <Text style={styles.listSubText}>Printed • 2 hours ago</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
        </View>

      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: BACKGROUND_DARK,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  greeting: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  usernameText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  iconGroup: {
      flexDirection: 'row',
      gap: 10,
  },
  iconButton: {
    backgroundColor: '#1F2937',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#333',
  },
  
  // Hero Card
  heroCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 30,
    shadowColor: NEON_GREEN,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  heroLabel: {
    color: '#064E3B',
    fontWeight: '700',
    fontSize: 16,
    opacity: 0.8,
  },
  heroIconBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 6,
    borderRadius: 50,
  },
  heroValue: {
    fontSize: 38,
    fontWeight: '900',
    color: '#000',
  },
  heroSubText: {
    color: '#064E3B',
    fontSize: 14,
    marginBottom: 20,
    fontWeight: '600',
  },
  // Graph Visualization
  graphContainer: {
    height: 30,
    justifyContent: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  graphLineBase: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: '100%',
    borderRadius: 2,
    position: 'absolute',
  },
  graphLineActive: {
    height: 4,
    backgroundColor: '#000',
    borderRadius: 2,
    position: 'absolute',
  },
  graphDot: {
    width: 16,
    height: 16,
    backgroundColor: '#FFF',
    borderRadius: 99,
    position: 'absolute',
    borderWidth: 3,
    borderColor: '#000',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 10,
    borderRadius: 12,
  },
  statText: {
    color: '#022c22',
    fontWeight: '700',
    fontSize: 12,
  },

  // Grid Section
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E5E7EB',
    marginBottom: 15,
    marginLeft: 5,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  gridCard: {
    width: '47%',
    backgroundColor: CARD_BG,
    padding: 16,
    borderRadius: 22,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#222',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  iconBg: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  gridSub: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // List Item
  listCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 5,
    borderWidth: 1,
    borderColor: '#222',
    marginBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  listIconBox: {
    width: 42,
    height: 42,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  listMainText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 2,
  },
  listSubText: {
    color: '#6B7280',
    fontSize: 12,
  },
});

export default Dashboard;