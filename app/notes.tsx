// fileName: notes.tsx (My Notes List)

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from './supabase';

const NEON_GREEN = '#34D399';
const BACKGROUND_DARK = '#000000';
const CARD_BG = '#111111';

// Function to truncate content for preview
const getPreview = (content: string) => {
    if (!content) return "Empty note.";
    return content.replace(/[\r\n#*_]+/g, ' ').substring(0, 100) + '...';
};

export default function NotesScreen() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH NOTES LOGIC (Auto Refresh) ---
  useFocusEffect(
    useCallback(() => {
      const fetchNotes = async () => {
        setLoading(true);
        const { data: { user } = {} } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('notes')
            .select('id, title, content, created_at') // Fetch ID for updating
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }); 
          setNotes(data || []);
        }
        setLoading(false);
      };
      fetchNotes();
      return () => {}; // Cleanup function
    }, [])
  );

  // --- OPEN EDITOR FUNCTION ---
  const handleOpenNote = (item: any) => {
    // Navigate to the DEDICATED RICH EDITOR screen
    router.push({
      pathname: '/editor', // --- Target the Rich Editor (editor.tsx) ---
      params: { 
        id: item.id, // ID is crucial for the UPSERT (update/insert) logic
        initialTopic: item.title,
        content: item.content 
      }
    });
  };

  return (
    <LinearGradient colors={[BACKGROUND_DARK, '#051e15']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Saved Notes</Text>
      </View>
      <Text style={styles.subHeader}>Tap a note to open in the MS Word-like editor.</Text>

      {loading ? (
        <ActivityIndicator size="large" color={NEON_GREEN} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => handleOpenNote(item)}>
              <View style={styles.iconBox}>
                <Ionicons name="document-text" size={24} color={NEON_GREEN} />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.noteTitle}>{item.title}</Text>
                <Text style={styles.notePreview} numberOfLines={1}>{getPreview(item.content)}</Text>
              </View>
              <Ionicons name="arrow-forward-circle" size={28} color="#444" />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={{color: '#666', textAlign: 'center', marginTop: 50}}>No notes found. Generate some notes first!</Text>
          }
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: NEON_GREEN },
  subHeader: { color: '#888', marginBottom: 20, fontSize: 14 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: CARD_BG, padding: 15, marginBottom: 12, borderRadius: 12, borderWidth: 1, borderColor: '#222' },
  iconBox: { width: 45, height: 45, borderRadius: 8, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  noteTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  notePreview: { color: '#999', fontSize: 13, marginTop: 4 },
});