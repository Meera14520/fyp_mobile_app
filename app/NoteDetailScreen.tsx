// fileName: NoteDetailScreen.tsx

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'; // IMPORTANT: useFocusEffect add kiya
import React, { useCallback, useState } from 'react'; // IMPORTANT: useState aur useCallback add kiya
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // ActivityIndicator add kiya
import { supabase } from './supabase';

const NEON_GREEN = '#34D399';
const BACKGROUND_DARK = '#000000';
const TEXT_LIGHT = '#E5E7EB';

export default function NoteDetailScreen() {
  // content, date ko abhi bhi params se le sakte hain, lekin content ko ignore karke fetch karenge
  const { id, title, date } = useLocalSearchParams(); 

  const [noteContent, setNoteContent] = useState('');
  const [loading, setLoading] = useState(true);

  // --- FETCH FRESH CONTENT ON FOCUS ---
  const fetchNoteContent = useCallback(() => {
    
    const loadContent = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // FIX: Content ko database se fetch karein, na ki params se rely karein
        const { data, error } = await supabase
          .from('notes')
          .select('content')
          .eq('id', id)
          .single(); 

        if (error) throw error;
        
        setNoteContent(data?.content || 'Error: Content not found.');
      } catch (err: any) {
        Alert.alert("Error", "Could not fetch note details: " + err.message);
        setNoteContent('Error loading content.');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [id]);

  // Screen focus hone par fresh data fetch hoga
  useFocusEffect(fetchNoteContent);

  // EDIT button add karte hain
  const handleEdit = () => {
    router.push({
      pathname: '/EditorWorkspaceScreen',
      params: { 
        id: id, 
        title: title, 
        content: noteContent, // Pass the FRESHLY loaded content to the editor
        date: date
      } 
    });
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note permanently?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('notes')
                .delete()
                .eq('id', id);
              
              if (error) throw error;
              
              router.back(); 
            } catch (err: any) {
              Alert.alert("Error", err.message);
            }
          }
        }
      ]
    );
  };

  return (
    <LinearGradient colors={[BACKGROUND_DARK, '#051e15']} style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={NEON_GREEN} />
        </TouchableOpacity>
        <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
            <Text style={styles.headerDate}>{new Date(date as string).toLocaleDateString()}</Text>
        </View>
        
        {/* EDIT Button */}
        <TouchableOpacity onPress={handleEdit} style={styles.editBtn}>
          <Ionicons name="create-outline" size={24} color={NEON_GREEN} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={24} color="#FF5555" />
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <ScrollView style={styles.contentScroll} contentContainerStyle={{paddingBottom: 100}}>
        {loading ? (
            <ActivityIndicator size="large" color={NEON_GREEN} style={{marginTop: 50}} />
        ) : (
            <Text style={styles.noteContent}>{noteContent}</Text>
        )}
      </ScrollView>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#222', paddingBottom: 15 },
  headerTitle: { color: NEON_GREEN, fontSize: 18, fontWeight: 'bold', width: '60%', textAlign: 'center' },
  headerDate: { color: '#666', fontSize: 12, marginTop: 2 },
  backBtn: { padding: 5, marginRight: 15 }, // Adjusted for space
  editBtn: { padding: 5, marginLeft: 15 }, // Added edit button style
  deleteBtn: { padding: 5, marginLeft: 10 },
  
  contentScroll: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  noteContent: { color: TEXT_LIGHT, fontSize: 16, lineHeight: 26, textAlign: 'left' },
});