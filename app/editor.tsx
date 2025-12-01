import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router'; // Import useFocusEffect
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from './supabase';

const NEON_GREEN = '#34D399';
const BACKGROUND_DARK = '#000000';
const CARD_BG = '#111111';

export default function EditorScreen() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- AUTO REFRESH LOGIC ---
 // --- AUTO REFRESH LOGIC (REVERTED SORTING) ---
  useFocusEffect(
    useCallback(() => {
      const fetchNotes = async () => {
        // Fetch the current user
        const { data: { user } = {} } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('notes')
            .select('*')
            .eq('user_id', user.id)
            // REVERTED: Back to the original sorting which works fine with your schema
            .order('created_at', { ascending: false }); 
          setNotes(data || []);
        }
        setLoading(false);
      };
      
      fetchNotes();
    }, [])
  );
  return (
    <LinearGradient colors={[BACKGROUND_DARK, '#051e15']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={NEON_GREEN} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Smart Editor</Text>
        <Ionicons name="create-outline" size={24} color={NEON_GREEN} />
      </View>

      <Text style={styles.subHeader}>Select a note to edit with AI</Text>

      {loading ? (
        <ActivityIndicator size="large" color={NEON_GREEN} style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{paddingBottom: 50}}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card}
              onPress={() => router.push({
                pathname: '/EditorWorkspaceScreen',
                params: { id: item.id, title: item.title, content: item.content }
              })}
            >
              <View style={styles.iconBox}>
                <Ionicons name="document-text" size={24} color={NEON_GREEN} />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.noteTitle}>{item.title}</Text>
                <Text style={styles.noteDate}>Tap to open in editor</Text>
              </View>
              <Ionicons name="arrow-forward-circle" size={28} color="#444" />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={{color: '#666', textAlign: 'center', marginTop: 50}}>No notes found.</Text>
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
  iconBox: { width: 45, height: 45, backgroundColor: 'rgba(52, 211, 153, 0.1)', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  noteTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  noteDate: { color: '#666', fontSize: 12, marginTop: 2 },
});