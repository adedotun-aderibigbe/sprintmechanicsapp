import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Alert,  ScrollView,  } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import { SprintMetrics, SprintLog, RepPerformance, WorkoutSession } from './src/types/index';
import { styles } from './src/styles/globalStyles';
import { AnalyzerScreen } from './src/screens/AnalyzerScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { WorkoutsScreen } from './src/screens/WorkoutsScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { supabase } from './src/services/supabaseClient';

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [history, setHistory] = useState<SprintLog[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analyzer' | 'history' | 'workouts'>('dashboard');
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [workoutDistance, setWorkoutDistance] = useState('');
  const [workoutReps, setWorkoutReps] = useState('');
  const [formSplits, setFormSplits] = useState<RepPerformance[]>([]);
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [isAddingWorkout, setIsAddingWorkout] = useState(false);

  // Check auth session and fetch data on start
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserData();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserData();
      } else {
        setUser(null);
        setHistory([]);
        setWorkouts([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ☁️ CLOUD DOWNLOAD LOOP
  const fetchUserData = async () => {
    try {
      const { data: sprintData, error: sprintError } = await supabase
        .from('sprint_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (sprintError) throw sprintError;
      if (sprintData) setHistory(sprintData);

      const { data: workoutData, error: workoutError } = await supabase
        .from('workout_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (workoutError) throw workoutError;
      if (workoutData) setWorkouts(workoutData);
    } catch (error: any) {
      console.error("Error loading cloud data:", error.message);
    }
  };

  const handleRepsChange = (numText: string) => {
    setWorkoutReps(numText);
    const count = parseInt(numText);
    if (isNaN(count) || count <= 0) {
      setFormSplits([]);
      return;
    }
    const newRows: RepPerformance[] = Array.from({ length: count }, (_, index) => ({
      repNumber: index + 1,
      distance: '',
      time: '',
    }));
    setFormSplits(newRows);
  };

  // 👟 CLOUD PUSH: WORKOUT LOGGER SAVER
  const handleAddWorkout = async () => {
    if (!workoutTitle || formSplits.length === 0) {
      Alert.alert("Missing Fields", "Please fill in Title and Reps.");
      return;
    }

    const sanitizedSplits = formSplits.map((split) => ({
      repNumber: split.repNumber,
      distance: split.distance.trim() === '' ? 'Run' : split.distance,
      time: split.time.trim() === '' ? 'N/A' : split.time,
    }));

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const newWorkout = {
        user_id: authUser.id,
        date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        title: workoutTitle,
        splits: sanitizedSplits,
        notes: workoutNotes,
      };

      const { data, error } = await supabase
        .from('workout_sessions')
        .insert([newWorkout])
        .select();

      if (error) throw error;
      if (data) {
        setWorkouts((prev) => [data[0], ...prev]);
      }

      setWorkoutTitle('');
      setWorkoutReps('');
      setFormSplits([]);
      setWorkoutNotes('');
      setIsAddingWorkout(false);
    } catch (e: any) {
      Alert.alert("Error saving session", e.message);
    }
  };

  // 🗑️ CLOUD SYNC: DELETE WORKOUT FROM TABLES
  const deleteWorkout = async (id: string) => {
    try {
      const { error } = await supabase
        .from('workout_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setWorkouts((prev) => prev.filter((workout) => workout.id !== id));
    } catch (e: any) {
      Alert.alert("Error", "Could not delete this workout entry: " + e.message);
    }
  };

  // 🔐 THE SECURITY GUARD WALL
  if (!user) {
    return (
      <View style={{ flex: 1, backgroundColor: '#121214' }}>
        <AuthScreen onLoginSuccess={(email) => setUser(email)} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Sprint Tracker</Text>
          <Text style={styles.subtitle}>AI-Powered Tracker</Text>
        </View>

        {activeTab === 'dashboard' && <DashboardScreen history={history} workouts={workouts} />}
        
        {activeTab === 'analyzer' && <AnalyzerScreen user={user}/>}

        {activeTab === 'history' && (
          <HistoryScreen history={history} clearHistory={() => setHistory([])} />
        )}

        {activeTab === 'workouts' && (
          <WorkoutsScreen
            workouts={workouts}
            workoutTitle={workoutTitle}
            setWorkoutTitle={setWorkoutTitle}
            workoutDistance={workoutDistance}
            setWorkoutDistance={setWorkoutDistance}
            workoutReps={workoutReps}
            handleRepsChange={handleRepsChange}
            workoutNotes={workoutNotes}
            setWorkoutNotes={setWorkoutNotes}
            formSplits={formSplits}
            setFormSplits={setFormSplits}
            isAddingWorkout={isAddingWorkout}
            setIsAddingWorkout={setIsAddingWorkout}
            handleAddWorkout={handleAddWorkout}
            deleteWorkout={deleteWorkout}
          />
        )}
      </ScrollView>

      {/* Tab Navigation Footer Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tabItem, activeTab === 'dashboard' && styles.activeTabItem]} onPress={() => setActiveTab('dashboard')}>
          <Text style={[styles.tabText, activeTab === 'dashboard' && styles.activeTabText]}>🏠 Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabItem, activeTab === 'analyzer' && styles.activeTabItem]} onPress={() => setActiveTab('analyzer')}>
          <Text style={[styles.tabText, activeTab === 'analyzer' && styles.activeTabText]}>⏱️ Analyzer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabItem, activeTab === 'workouts' && styles.activeTabItem]} onPress={() => setActiveTab('workouts')}>
          <Text style={[styles.tabText, activeTab === 'workouts' && styles.activeTabText]}>👟 Workouts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabItem, activeTab === 'history' && styles.activeTabItem]} onPress={() => setActiveTab('history')}>
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>📊 History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}