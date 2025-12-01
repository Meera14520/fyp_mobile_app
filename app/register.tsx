import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "./supabase";

WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen() {
  
  const handleGoogleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "exp://localhost:19000/dashboard",
        }
      });

      if (error) {
        console.log("GOOGLE ERROR:", error.message);
        Alert.alert("Error", "Google Signup failed");
        return;
      }

      Alert.alert("Success", "Signed up successfully!");
      router.replace("/dashboard");

    } catch (e) {
      console.log("GOOGLE EXCEPTION:", e);
      Alert.alert("Error", "Google process failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register Account</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleGoogleSignUp}
      >
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 32, fontWeight: "900", marginBottom: 50 },
  button: {
    backgroundColor: "#4285F4",
    padding: 18,
    borderRadius: 12,
    width: "75%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
});
