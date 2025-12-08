// fileName: ProfileScreen.tsx (Final Type Fix Applied)

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
// 🚨 FIX 1: ComponentProps type ko React se import kiya
import React, { ComponentProps, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from './AuthProvider';
import { supabase } from './supabase';

const NEON_GREEN = '#34D399';
const BRIGHT_NEON = '#A7F3D0';
const BACKGROUND_DARK = '#000000';
const CARD_BG = '#1A1A1A';
const FIELD_BG = '#2A2A2A';

// 🚨 FIX 2: Ionicons ke name prop ka correct type derive kiya
type IoniconsName = ComponentProps<typeof Ionicons>['name'];


const ProfileScreen = () => {
  const { user, signOut } = useAuth(); 
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); 
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // Profile data states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  
  // ------------------------------------
  // A. Fetch User Data
  // ------------------------------------
  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) {
        setLoading(false);
        return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`username, mobile_no`) 
        .eq('id', user.id)
        .single(); 

      if (error && error.code !== 'PGRST116') { 
        Alert.alert("Fetch Error", error.message);
      } else if (data) {
        setUsername(data.username || user.email?.split('@')[0] || 'User');
        setEmail(user.email || '');
        setMobileNo(data.mobile_no || 'N/A');
      } else {
        setUsername(user.email?.split('@')[0] || 'User');
        setEmail(user.email || '');
        setMobileNo('N/A');
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not load profile data.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------
  // B. Update User Data
  // ------------------------------------
  const handleUpdate = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    
    setUpdateLoading(true);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: username.trim(),
          mobile_no: mobileNo.trim(),
        })
        .eq('id', user.id)
        .select() 
        .maybeSingle();

      if (profileError) {
        Alert.alert("Update Failed", profileError.message);
      } else {
        Alert.alert("Success", "Profile information updated successfully!");
        setIsEditing(false); 
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred during update.");
    } finally {
      setUpdateLoading(false);
    }
  };

  // ------------------------------------
  // C. Delete Account
  // ------------------------------------
  const handleDeleteAccount = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: confirmDelete }
      ]
    );
  };

  const confirmDelete = async () => {
    setUpdateLoading(true);
    try {
      const { error: deleteUserError } = await supabase.rpc('delete_user');

      if (deleteUserError) {
        throw new Error(deleteUserError.message || "Deletion failed. Check Supabase 'delete_user' function.");
      }

      await signOut();
      Alert.alert("Account Deleted", "Your account has been permanently removed.");
      router.replace('/'); 

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      Alert.alert("Deletion Error", `Could not delete account. ${errorMessage}`);
    } finally {
      setUpdateLoading(false);
    }
  };


  if (loading) {
    return (
      <LinearGradient colors={[BACKGROUND_DARK, '#081A12']} style={styles.container}>
        <ActivityIndicator size="large" color={NEON_GREEN} />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </LinearGradient>
    );
  }

  // --- Profile Detail Card Component ---
  // 🚨 FIX 3: Correct type 'IoniconsName' used here
  const DetailCard = ({ icon, label, value }: { icon: IoniconsName; label: string; value: string }) => (
    <View style={styles.detailCard}>
        <Ionicons name={icon} size={24} color={NEON_GREEN} style={{ marginRight: 15 }} />
        <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue} numberOfLines={1}>{value}</Text>
        </View>
    </View>
  );

  return (
    <LinearGradient colors={[BACKGROUND_DARK, '#081A12']} style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back-outline" size={30} color={NEON_GREEN} />
            </TouchableOpacity>
            <Text style={styles.title}>Account Settings</Text>
        </View>
        
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Ionicons name="person-circle-outline" size={100} color={NEON_GREEN} style={styles.icon} />
        <Text style={styles.displayName}>{username}</Text>
        
        {/* --- View Mode / Edit Mode Switch --- */}
        <View style={styles.dataContainer}>
            
            {/* VIEW MODE: Details are displayed in beautiful cards */}
            {!isEditing && (
                <>
                    <DetailCard icon="person-outline" label="Username" value={username} />
                    <DetailCard icon="mail-outline" label="Email Address" value={email} />
                    <DetailCard icon="call-outline" label="Mobile Number" value={mobileNo} />
                    
                    {/* Note: Email ko yahan change nahi kiya ja sakta for security reasons */}
                    <Text style={styles.noteText}>Email address cannot be changed from here.</Text>
                </>
            )}

            {/* EDIT MODE: Text Inputs are displayed for updating */}
            {isEditing && (
                <View style={styles.editForm}>
                    <Text style={styles.editLabel}>Update Username</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="New Username"
                        placeholderTextColor="#9CA3AF"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />

                    <Text style={styles.editLabel}>Update Mobile Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Mobile Number (e.g., +92300...)"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="phone-pad"
                        value={mobileNo === 'N/A' ? '' : mobileNo} 
                        onChangeText={setMobileNo}
                    />
                </View>
            )}
        </View>
        
        {/* --- Update Button --- */}
        <TouchableOpacity 
            style={styles.updateButton} 
            onPress={handleUpdate}
            disabled={updateLoading}
        >
            <Ionicons 
                name={isEditing ? "save-outline" : "create-outline"} 
                size={22} 
                color={BACKGROUND_DARK} 
            />
            <Text style={styles.updateText}>
                {updateLoading 
                    ? "Processing..." 
                    : isEditing 
                        ? "Save Changes" 
                        : "Update Information" 
                }
            </Text>
        </TouchableOpacity>
        
        {/* --- Cancel Button (only in Edit Mode) --- */}
        {isEditing && (
            <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => { setIsEditing(false); fetchProfile(); }} 
            >
                <Text style={styles.cancelText}>Cancel Edit</Text>
            </TouchableOpacity>
        )}


        {/* --- Delete Account Section --- */}
        <View style={styles.deleteContainer}>
          <Text style={styles.deleteTitle}>Danger Zone</Text>
          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={handleDeleteAccount}
            disabled={updateLoading}
          >
            <Ionicons name="skull-outline" size={24} color="#FFF" />
            <Text style={styles.deleteText}>Delete My Account Permanently</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  backButton: {
    position: 'absolute',
    left: 20,
  },
  scrollContent: { alignItems: 'center', paddingVertical: 20, paddingHorizontal: 20 },
  loadingText: { color: NEON_GREEN, marginTop: 15, fontSize: 18 },
  title: { fontSize: 24, fontWeight: 'bold', color: NEON_GREEN, textAlign: 'center' },
  icon: { marginBottom: 15, opacity: 0.8 },
  displayName: { fontSize: 28, fontWeight: '700', color: '#FFFFFF', marginBottom: 30 },
  
  dataContainer: { width: '100%', maxWidth: 400, marginBottom: 20 },
  
  // View Mode Styles
  detailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    padding: 20,
    borderRadius: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderColor: NEON_GREEN,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: BRIGHT_NEON,
    fontWeight: '500',
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 2,
  },
  noteText: {
    color: '#9CA3AF', 
    fontSize: 12, 
    textAlign: 'center', 
    marginTop: 10,
  },

  // Edit Mode Styles
  editForm: {
    width: '100%',
    padding: 10,
    backgroundColor: CARD_BG,
    borderRadius: 15,
  },
  editLabel: { 
    fontSize: 16, 
    color: NEON_GREEN, 
    marginTop: 15, 
    marginBottom: 5, 
    fontWeight: '600' 
  },
  input: { 
    width: '100%', 
    backgroundColor: FIELD_BG, 
    color: '#FFFFFF', 
    padding: 15, 
    borderRadius: 10, 
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: '#444' 
  },
  
  // Buttons
  updateButton: { 
    width: '100%', 
    maxWidth: 400,
    backgroundColor: NEON_GREEN, 
    borderRadius: 12, 
    paddingVertical: 15, 
    alignItems: 'center', 
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
    shadowColor: NEON_GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  updateText: { fontSize: 18, fontWeight: '800', color: BACKGROUND_DARK },
  
  cancelButton: {
    width: '100%',
    maxWidth: 400,
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: BRIGHT_NEON,
    fontSize: 16,
    fontWeight: '600',
  },

  // Delete Section
  deleteContainer: { width: '100%', maxWidth: 400, marginTop: 50, padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#FF4D4D' },
  deleteTitle: { fontSize: 18, fontWeight: '700', color: '#FF4D4D', marginBottom: 15, textAlign: 'center' },
  deleteButton: { 
    backgroundColor: '#FF4D4D', 
    borderRadius: 10, 
    paddingVertical: 15, 
    alignItems: 'center', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: 10
  },
  deleteText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' }
});

export default ProfileScreen;