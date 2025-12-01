import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { supabase } from './supabase'; // Apni supabase file ka path check kar lena

const NEON_GREEN = '#34D399';
const BACKGROUND_DARK = '#000000';
const CARD_BG = '#111111';
const TEXT_LIGHT = '#E5E7EB';

export default function GeneratedNotesScreen() {
  const params = useLocalSearchParams();
  const { content, initialTopic } = params; // Pichle page se data aaya
  
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [noteTitle, setNoteTitle] = useState(initialTopic as string || 'My AI Notes');

  // --- SAVE TO SUPABASE ---
  const handleSave = async () => {
    if (!noteTitle.trim()) {
      Alert.alert("Title Required", "Please enter a name for your notes.");
      return;
    }

    setSaving(true);
    try {
      // 1. Get User ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user logged in");

      // 2. Insert into Database
      const { error } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          title: noteTitle,
          content: content, // Generated content
        });

      if (error) throw error;

      setModalVisible(false);
      Alert.alert("Success!", "Notes saved successfully.", [
        { text: "Go to Dashboard", onPress: () => router.replace('/(tabs)/dashboard') }
      ]);

    } catch (error: any) {
      Alert.alert("Save Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <LinearGradient colors={[BACKGROUND_DARK, '#051e15']} style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={NEON_GREEN} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Notes</Text>
        <View style={{ width: 24 }} /> 
      </View>

      {/* Content Area */}
      <ScrollView style={styles.contentScroll} contentContainerStyle={{paddingBottom: 100}}>
        <Text style={styles.generatedContent}>{content}</Text>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.discardButton} onPress={() => router.back()}>
          <Text style={styles.discardText}>Discard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.saveText}>Save Notes</Text>
          <Ionicons name="save-outline" size={20} color="#000" style={{marginLeft: 5}}/>
        </TouchableOpacity>
      </View>

      {/* --- SAVE MODAL (Ask for Name) --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Name Your Notes</Text>
            <Text style={styles.modalSub}>Enter a title to save this file.</Text>
            
            <TextInput 
              style={styles.input}
              value={noteTitle}
              onChangeText={setNoteTitle}
              placeholder="Enter file name..."
              placeholderTextColor="#666"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCancel}>
                <Text style={{color: '#FFF'}}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleSave} style={styles.modalSave} disabled={saving}>
                {saving ? <ActivityIndicator color="#000"/> : <Text style={{fontWeight: 'bold'}}>Confirm Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { color: NEON_GREEN, fontSize: 20, fontWeight: 'bold' },
  backBtn: { padding: 5 },
  
  contentScroll: { flex: 1, paddingHorizontal: 20 },
  generatedContent: { color: TEXT_LIGHT, fontSize: 16, lineHeight: 24, textAlign: 'justify' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', padding: 20, backgroundColor: 'rgba(0,0,0,0.9)',
    borderTopWidth: 1, borderTopColor: '#333', justifyContent: 'space-between'
  },
  discardButton: { paddingVertical: 15, paddingHorizontal: 30, borderRadius: 12, backgroundColor: '#333' },
  discardText: { color: '#FF5555', fontWeight: 'bold' },
  saveButton: { flex: 1, marginLeft: 15, paddingVertical: 15, borderRadius: 12, backgroundColor: NEON_GREEN, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  saveText: { color: '#000', fontWeight: 'bold', fontSize: 16 },

  // Modal Styles
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalContent: { width: '85%', backgroundColor: '#1F2937', borderRadius: 20, padding: 25, alignItems: 'center', borderWidth: 1, borderColor: NEON_GREEN },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF', marginBottom: 5 },
  modalSub: { color: '#AAA', marginBottom: 20 },
  input: { width: '100%', backgroundColor: '#111', color: '#FFF', padding: 15, borderRadius: 10, marginBottom: 20, borderWidth: 1, borderColor: '#444' },
  modalButtons: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  modalCancel: { padding: 15 },
  modalSave: { backgroundColor: NEON_GREEN, paddingVertical: 12, paddingHorizontal: 25, borderRadius: 10 },
});