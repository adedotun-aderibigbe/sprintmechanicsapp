// WorkoutsScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { styles } from '../styles/globalStyles';
import { WorkoutSession, RepPerformance } from '../types/index';
import { DynamicRepRow } from '../components/DynamicRepRow';

interface WorkoutsScreenProps {
  workouts: WorkoutSession[];
  workoutTitle: string;
  setWorkoutTitle: (t: string) => void;
  workoutDistance: string;
  setWorkoutDistance: (d: string) => void;
  workoutReps: string;
  handleRepsChange: (text: string) => void;
  workoutNotes: string;
  setWorkoutNotes: (text: string) => void;
  formSplits: RepPerformance[];
  setFormSplits: React.Dispatch<React.SetStateAction<RepPerformance[]>>;
  isAddingWorkout: boolean;
  setIsAddingWorkout: (val: boolean) => void;
  handleAddWorkout: () => void;
  deleteWorkout: (id: string) => void;
}

export const WorkoutsScreen: React.FC<WorkoutsScreenProps> = ({
  workouts, workoutTitle, setWorkoutTitle, workoutDistance, setWorkoutDistance,
  workoutReps, handleRepsChange, workoutNotes, setWorkoutNotes, formSplits,
  setFormSplits, isAddingWorkout, setIsAddingWorkout, handleAddWorkout, deleteWorkout
}) => {
  return (
    <View style={styles.dashboardContainer}>
      <View style={styles.dashboardHeader}>
        <Text style={styles.dashboardTitle}>Sprint Training Log</Text>
        <TouchableOpacity onPress={() => setIsAddingWorkout(!isAddingWorkout)}>
          <Text style={styles.viewAllText}>{isAddingWorkout ? "Cancel" : "+ Log Workout"}</Text>
        </TouchableOpacity>
      </View>

      {/* 📝 NEW WORKOUT INPUT FORM CONTAINER */}
      {isAddingWorkout && (
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Session Title (e.g., Acceleration Blocks)"
            placeholderTextColor="#8E8E93"
            style={styles.inputField}
            value={workoutTitle}
            onChangeText={setWorkoutTitle}
            autoCorrect={true}
            autoCapitalize='words'
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TextInput
              placeholder="Distance (e.g., 60m)"
              placeholderTextColor="#8E8E93"
              style={[styles.inputField, { width: '48%' }]}
              value={workoutDistance}
              onChangeText={setWorkoutDistance}
            />
            <TextInput
              placeholder="Reps (e.g., 5)"
              placeholderTextColor="#8E8E93"
              keyboardType="numeric"
              style={[styles.inputField, { width: '48%' }]}
              value={workoutReps}
              onChangeText={handleRepsChange}
            />
          </View>
          
          <TextInput
            placeholder="Notes (Spikes used, track conditions...)"
            placeholderTextColor="#8E8E93"
            multiline
            style={[styles.inputField, { height: 60, textAlignVertical: 'top' }]}
            value={workoutNotes}
            onChangeText={setWorkoutNotes}
            autoCorrect={true}
            autoCapitalize='sentences'
          />

          {/* 🏃‍♂️ DYNAMIC REP SPLIT INPUTS ROW MATRIX */}
            {formSplits.map((split, index) => (
            <DynamicRepRow
                key={split.repNumber}
                split={split}
                index={index}
                formSplits={formSplits}
                setFormSplits={setFormSplits}
            />
            ))}

          <TouchableOpacity style={[styles.button, styles.analyzeButton, { marginTop: 5 }]} onPress={handleAddWorkout}>
            <Text style={styles.buttonText}>Save Session Log</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 📋 WORKOUT LIST DISPLAY */}
      {workouts.length === 0 ? (
        <Text style={styles.historySubtext}>No logged workouts yet. Log your track session above!</Text>
      ) : (
        workouts.map((item) => (
          <View key={item.id} style={styles.workoutCard}>
            <View style={styles.workoutCardHeader}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.historyDate}>{item.title}</Text>
                <Text style={styles.historySubtext}>{item.date}</Text>
              </View>
              <TouchableOpacity style={styles.deleteCardButton} onPress={() => deleteWorkout(item.id)}>
                <Text style={styles.deleteCardButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.splitsDisplayGrid}>
              {item.splits.map((split) => (
                <View key={split.repNumber} style={styles.splitGridLine}>
                  <Text style={styles.splitGridText}>Rep {split.repNumber}: {split.distance}</Text>
                  <Text style={[styles.splitGridText, { fontWeight: '700', color: split.time === 'N/A' ? '#8E8E93' : '#34C759' }]}>
                    {split.time}{split.time !== 'N/A' && !split.time.includes('s') ? 's' : ''}
                  </Text>
                </View>
              ))}
            </View>

            {item.notes ? <Text style={styles.workoutNotesText}>“{item.notes}”</Text> : null}
          </View>
        ))
      )}
    </View>
  );
};