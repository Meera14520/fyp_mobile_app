// fileName: EditorWorkspaceScreen.tsx

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { generateContent } from './gemini';
import { supabase } from './supabase';

const NEON_GREEN = '#34D399';
const BACKGROUND_DARK = '#000000';
const INPUT_BG = '#1F2937';

export default function EditorWorkspaceScreen() {
  const { id, title, content } = useLocalSearchParams();
  
  const [noteContent, setNoteContent] = useState(content as string);
  const [aiCommand, setAiCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --- GEMINI AI LOGIC ---
  const handleAICommand = async () => {
    if (!aiCommand.trim()) return;
    const contentToSend = noteContent;
    setIsProcessing(true);
    
    try {
        const newContent = await generateContent(aiCommand, contentToSend); 
        setNoteContent(newContent); 
    } catch (error) {
        console.error("AI Command Execution Error:", error);
        Alert.alert("AI Error", "Could not process command. Check the console for API details.");
    }

    setAiCommand('');
    setIsProcessing(false);
  };

 // --- SAVE LOGIC ---
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // FIX: updated_at ko current timestamp ke saath update karein
      const { error } = await supabase
        .from('notes')
        .update({ 
          content: noteContent,
          updated_at: new Date().toISOString() // CRITICAL FIX: Add this line
        })
        .eq('id', id);

      if (error) throw error;
      Alert.alert("Saved", "Changes updated successfully!");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <LinearGradient colors={[BACKGROUND_DARK, '#091F15']} style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#666" />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <TouchableOpacity onPress={handleSave} disabled={isSaving}>
          {isSaving ? <ActivityIndicator color={NEON_GREEN}/> : <Text style={styles.saveText}>Save</Text>}
        </TouchableOpacity>
      </View>

      {/* Main Editor Area */}
      <ScrollView style={styles.editorContainer}>
        <TextInput 
          style={styles.editorInput}
          multiline
          value={noteContent}
          onChangeText={setNoteContent}
          placeholder="Start typing..."
          placeholderTextColor="#555"
          textAlignVertical="top"
        />
      </ScrollView>

      {/* AI Command Bar (Keyboard Avoidance) */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.commandBar}>
          <View style={styles.inputWrapper}>
            <Ionicons name="sparkles" size={20} color={NEON_GREEN} style={{marginRight: 8}} />
            <TextInput 
              style={styles.commandInput}
              placeholder="Ask AI to edit (e.g., 'Summarize this' or 'Translate to Urdu')"
              placeholderTextColor="#888"
              value={aiCommand}
              onChangeText={setAiCommand}
            />
          </View>
          <TouchableOpacity 
            style={[styles.sendButton, { opacity: aiCommand ? 1 : 0.5 }]} 
            onPress={handleAICommand}
            disabled={!aiCommand || isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Ionicons name="arrow-up" size={24} color="#000" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#222' },
  title: { color: '#FFF', fontSize: 18, fontWeight: 'bold', width: '60%', textAlign: 'center' },
  saveText: { color: NEON_GREEN, fontWeight: 'bold', fontSize: 16 },
  
  editorContainer: { flex: 1, padding: 20 },
  editorInput: { color: '#EEE', fontSize: 16, lineHeight: 24, minHeight: 300 },

  commandBar: { flexDirection: 'row', padding: 15, backgroundColor: '#111', borderTopWidth: 1, borderTopColor: '#333', alignItems: 'center' },
  inputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: INPUT_BG, borderRadius: 25, paddingHorizontal: 15, height: 50, marginRight: 10, borderWidth: 1, borderColor: '#333' },
  commandInput: { flex: 1, color: '#FFF' },
  sendButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: NEON_GREEN, justifyContent: 'center', alignItems: 'center' },
});