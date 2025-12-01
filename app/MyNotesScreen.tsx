// fileName: MyNotesScreen.tsx

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from './supabase';

const NEON_GREEN = '#34D399';
const BACKGROUND_DARK = '#000000';
const CARD_BG = '#111111';
const TEXT_LIGHT = '#E5E7EB';

export default function MyNotesScreen() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

 // --- FETCH NOTES FUNCTION ---
  const fetchNotes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        // FIX: Pehle updated_at se sort karein. Latest edited note sabse upar aayega.
        .order('updated_at', { ascending: false, nullsFirst: false }) 
        // Agar updated_at NULL hai to created_at use karein (purane notes ke liye)
        .order('created_at', { ascending: false }); 

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.log('Error fetching notes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  // --- AUTO REFRESH WHEN SCREEN IS FOCUSED ---
  useFocusEffect(
    useCallback(() => {
      fetchNotes(); 
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotes();
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.noteCard} 
      onPress={() => router.push({
        pathname: '/NoteDetailScreen',
        params: { 
          id: item.id, 
          title: item.title, 
          // FIX: DO NOT PASS STALE CONTENT. Detail Screen will fetch fresh.
          date: item.created_at,
          updated_at: item.updated_at 
        }
      })}
    >
      <View style={styles.iconBox}>
        <Ionicons name="document-text-outline" size={24} color={NEON_GREEN} />
      </View>
      <View style={styles.noteInfo}>
        <Text style={styles.noteTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.noteDate}>
          {/* Show updated date if available, otherwise show created date */}
          {item.updated_at ? `Updated: ${new Date(item.updated_at).toLocaleDateString()}` : `Created: ${new Date(item.created_at).toLocaleDateString()}`}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={[BACKGROUND_DARK, '#061a12']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={NEON_GREEN} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Saved Notes</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={NEON_GREEN} />
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={NEON_GREEN} />}
          ListEmptyComponent={
            <Text style={{color: '#666', textAlign: 'center', marginTop: 50}}>No notes found.</Text>
          }
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: NEON_GREEN },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 20, paddingBottom: 50 },
  noteCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: CARD_BG, padding: 15, borderRadius: 15, marginBottom: 12, borderWidth: 1, borderColor: '#222' },
  iconBox: { width: 45, height: 45, borderRadius: 12, backgroundColor: 'rgba(52, 211, 153, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  noteInfo: { flex: 1 },
  noteTitle: { fontSize: 16, fontWeight: 'bold', color: TEXT_LIGHT, marginBottom: 4 },
  noteDate: { fontSize: 12, color: '#888' },
});