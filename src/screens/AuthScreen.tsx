// src/screens/AuthScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { styles } from '../styles/globalStyles';
import { supabase } from '../services/supabaseClient';

interface AuthScreenProps {
  onLoginSuccess: (userEmail: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    try {
      if (isLoginMode) {
        // 🔐 SIGN IN EXISTING USER
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) onLoginSuccess(data.user.email || email);
      } else {
        // 📝 CREATE NEW USER ACCOUNT
        if (password !== confirmPassword) {
          Alert.alert("Error", "Passwords do not match.");
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        Alert.alert("Success!", "Account created! Check your email inbox for a verification link.");
      }
    } catch (error: any) {
      Alert.alert("Authentication Failed", error.message || "An unexpected error occurred.");
    }
  };

  return (
    <View style={[styles.dashboardContainer, { justifyContent: 'center', flex: 1, paddingHorizontal: 20 }]}>
      <Text style={[styles.title, { textAlign: 'center', marginBottom: 8 }]}>🏃‍♂️ Sprint Analyzer</Text>
      <Text style={[styles.subtitle, { textAlign: 'center', marginBottom: 32 }]}>
        {isLoginMode ? "Sign in to track your metrics" : "Create an account to get started"}
      </Text>

      {/* Email Input */}
      <TextInput
        placeholder="Email Address"
        placeholderTextColor="#8E8E93"
        style={styles.inputField}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCorrect={false}
      />

      {/* Password Input */}
      <TextInput
        placeholder="Password"
        placeholderTextColor="#8E8E93"
        secureTextEntry
        style={styles.inputField}
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />

      {/* Confirm Password Input (Only shows up during Registration) */}
      {!isLoginMode && (
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#8E8E93"
          secureTextEntry
          style={styles.inputField}
          autoCapitalize="none"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      )}

      {/* Submit Action Button */}
      <TouchableOpacity style={[styles.button, styles.analyzeButton, { marginTop: 12 }]} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{isLoginMode ? "Sign In" : "Register Account"}</Text>
      </TouchableOpacity>

      {/* Toggle View Link */}
      <TouchableOpacity style={{ marginTop: 20 }} onPress={() => setIsLoginMode(!isLoginMode)}>
        <Text style={[styles.resetLinkText, { textAlign: 'center' }]}>
          {isLoginMode ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};