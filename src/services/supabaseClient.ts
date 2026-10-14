// src/services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ REPLACE THESE STRINGS WITH YOUR ACTUAL VALUES FROM THE SUPABASE SETTINGS PAGE
const supabaseUrl = 'https://nyckpfcxdyvbnltkpahz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55Y2twZmN4ZHl2Ym5sdGtwYWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3Mjk1MTcsImV4cCI6MjA5OTMwNTUxN30.uWdpKt2-WUUZHMChGc3T3JKTVrEVYRl17ocjksow_Co';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // 🔐 Automatically saves the login session tokens safely onto the phone hardware!
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});