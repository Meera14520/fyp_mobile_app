// fileName: ocr-scanner.tsx

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// 🛑 CRITICAL FIX: Use the legacy module for readAsStringAsync as recommended by Expo.
import * as FileSystem from 'expo-file-system/legacy';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// --- Theme Colors ---
const NEON_GREEN = '#34D399';
const BRIGHT_NEON = '#A7F3D0';
const BACKGROUND_DARK = '#000000';
const CARD_BG = '#111111';
const TEXT_LIGHT = '#E5E7EB';
const PLACEHOLDER_COLOR = '#6B7280';

// 🛑 IMPORTANT: Replace 192.168.x.x with your actual Local IP address (where your Node.js server is running)
// Example: 'http://192.168.1.5:3000/api/ocr'
const OCR_API_URL = 'http://192.168.1.x:3000/api/ocr'; 


const OCRScannerScreen = () => {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [extractedText, setExtractedText] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [tempText, setTempText] = useState(''); // State for editable text

    // 1. Image Picker Function
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Please grant access to the photo library.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImageUri(uri);
            // Once image is selected, start OCR immediately
            processOCR(uri); 
        }
    };
    
    // 2. OCR Processing (Sends image to your Node.js Backend)
    const processOCR = async (uri: string) => {
        setIsProcessing(true);
        setExtractedText(null);
        setTempText('');

        try {
            // CRITICAL FIX IS HERE: Using the imported legacy FileSystem module
            const base64Image = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            
            // Send Base64 image to your secure backend endpoint
            const response = await fetch(OCR_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: base64Image, // The Base64 string is sent here
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                // Check for server-side error messages
                throw new Error(data.error || 'OCR API failed to process the image. Check your Node.js console.');
            }

            const recognizedText = data.extractedText; 
            
            setExtractedText(recognizedText);
            setTempText(recognizedText); // Initialize the editable text
            
        } catch (e: any) {
            console.error("OCR Error:", e);
            Alert.alert(
                "OCR Failed", 
                `Could not extract text. Please ensure your backend is running and the IP address in OCR_API_URL is correct. Error: ${e.message}`,
                [{ text: "OK" }]
            );
        } finally {
            setIsProcessing(false);
        }
    };
    
    // 3. Save to Notes Function
    const handleSave = () => {
        if (!tempText.trim()) {
            Alert.alert("Cannot Save", "There is no text to save.");
            return;
        }
        
        // Navigate to the Notes screen and pass the text to be saved
        router.push({
            pathname: '/notes', 
            params: { initialContent: tempText, isNewNote: 'true' }
        } as any);
    };


    return (
        <LinearGradient colors={[BACKGROUND_DARK, '#061a12']} style={styles.container}>
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={30} color={NEON_GREEN} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Image to Text</Text>
                <Ionicons name="scan-outline" size={30} color={NEON_GREEN} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Image Placeholder/Display */}
                <TouchableOpacity 
                    style={styles.imagePickerArea} 
                    onPress={pickImage}
                    disabled={isProcessing}
                >
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Ionicons name="image-outline" size={50} color={PLACEHOLDER_COLOR} />
                            <Text style={styles.placeholderText}>Tap to Select Image for OCR</Text>
                            <Text style={styles.placeholderSubText}>(For High-Quality OCR)</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Processing/Extracted Text Display */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Extracted Text</Text>
                    
                    {isProcessing && (
                        <View style={styles.processingArea}>
                            <ActivityIndicator size="large" color={NEON_GREEN} />
                            <Text style={styles.processingText}>Sending to Google Vision...</Text>
                        </View>
                    )}
                    
                    {extractedText && !isProcessing && (
                        <TextInput
                            style={styles.textInput}
                            multiline
                            placeholder="OCR text will appear here..."
                            placeholderTextColor={PLACEHOLDER_COLOR}
                            value={tempText}
                            onChangeText={setTempText}
                        />
                    )}
                    
                    {!imageUri && !isProcessing && (
                         <Text style={{color: PLACEHOLDER_COLOR, textAlign: 'center', padding: 10}}>
                             Select an image to begin OCR process.
                         </Text>
                    )}

                </View>

                {/* Action Buttons */}
                <TouchableOpacity 
                    style={[styles.saveButton, { opacity: tempText.trim() ? 1 : 0.5 }]} 
                    onPress={handleSave}
                    disabled={!tempText.trim()}
                >
                    <Ionicons name="save-outline" size={24} color="#000" />
                    <Text style={styles.saveButtonText}>Save to Notes</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.reScanButton} 
                    onPress={pickImage}
                    disabled={isProcessing}
                >
                    <Ionicons name="refresh-outline" size={24} color={NEON_GREEN} />
                    <Text style={styles.reScanButtonText}>Re-scan Image</Text>
                </TouchableOpacity>

            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 60 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 30 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: BRIGHT_NEON },
    
    // Image Area
    imagePickerArea: {
        backgroundColor: CARD_BG,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: NEON_GREEN,
        borderStyle: 'dashed',
        marginBottom: 20,
        overflow: 'hidden',
        minHeight: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholder: {
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePreview: {
        width: '100%',
        minHeight: 200,
        resizeMode: 'contain',
        backgroundColor: '#000',
    },
    placeholderText: {
        color: TEXT_LIGHT,
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10,
    },
    placeholderSubText: {
        color: PLACEHOLDER_COLOR,
        fontSize: 12,
        marginTop: 5,
    },
    
    // Text Card
    card: { backgroundColor: CARD_BG, borderRadius: 18, padding: 15, marginBottom: 20, borderWidth: 1, borderColor: '#222' },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: NEON_GREEN, marginBottom: 15, textAlign: 'center', borderBottomWidth: 1, borderBottomColor: '#333', paddingBottom: 10 },
    processingArea: { 
        padding: 30, 
        alignItems: 'center' 
    },
    processingText: {
        color: BRIGHT_NEON,
        marginTop: 10,
        fontSize: 16,
    },
    textInput: {
        minHeight: 200,
        color: TEXT_LIGHT,
        fontSize: 16,
        padding: 5,
        textAlignVertical: 'top',
        backgroundColor: '#0A0A0A',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333',
    },

    // Buttons
    saveButton: { 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: NEON_GREEN, 
        paddingVertical: 18, 
        borderRadius: 15, 
        marginTop: 10, 
        gap: 10, 
        shadowColor: NEON_GREEN, 
        shadowOffset: { width: 0, height: 6 }, 
        shadowOpacity: 0.8, 
        shadowRadius: 15, 
        elevation: 15 
    },
    saveButtonText: { 
        fontSize: 20, 
        fontWeight: '900', 
        color: BACKGROUND_DARK 
    },
    reScanButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1F2937',
        paddingVertical: 18,
        borderRadius: 15,
        marginTop: 15,
        gap: 10,
        borderWidth: 1,
        borderColor: NEON_GREEN,
    },
    reScanButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: NEON_GREEN,
    }
});

export default OCRScannerScreen;