// src/screens/DashboardScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/globalStyles';
import { SprintLog, WorkoutSession } from '../types/index';
import { supabase } from '../services/supabaseClient';

interface DashboardScreenProps {
  history: SprintLog[];
  workouts: WorkoutSession[];
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ history, workouts }) => {
  
  // 🏆 1. AUTO-CALCULATE PERSONAL RECORDS (PRs)
  // Finds the fastest numerical reaction time in your history array
  const fastestReaction = history.length > 0 
    ? Math.min(...history.map(item => parseFloat(item.reaction_time)).filter(t => !isNaN(t)))
    : null;

  // 📈 2. AUTO-CALCULATE WEEKLY TRAINING VOLUME
  // Loops through all workouts logged in the last 7 days and tallies up the total meters
  const calculateWeeklyVolume = () => {
    let totalMeters = 0;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    workouts.forEach(session => {
      const sessionDate = new Date(session.date);
      if (sessionDate >= sevenDaysAgo) {
        session.splits.forEach(split => {
          // Extracts numbers out of strings like "60m" or "100"
          const distanceNum = parseInt(split.distance.replace(/[^0-9]/g, ''));
          if (!isNaN(distanceNum)) {
            totalMeters += distanceNum;
          }
        });
      }
    });
    return totalMeters;
  };

  const weeklyVolume = calculateWeeklyVolume();

  // ⚠️ 3. SMART COACHING ALERT (CNS Fatigue check)
  // Compares your most recent run's reaction time against your lifetime PR
  const getCNSStatus = () => {
    if (history.length < 2 || !fastestReaction) return { status: 'Optimal', color: '#34C759', text: 'CNS is fresh and ready for max velocity.' };
    
    const latestReaction = parseFloat(history[0].reaction_time);
    const spikePercentage = ((latestReaction - fastestReaction) / fastestReaction) * 100;

    if (spikePercentage > 15) {
      return { status: 'Fatigued ⚠️', color: '#FF3B30', text: 'Reaction times have spiked by >15%. High risk of hamstring injury. Consider lowering volume today.' };
    } else if (spikePercentage > 8) {
      return { status: 'Moderate', color: '#FF9500', text: 'Slight fatigue detected. Monitor your warmup outputs closely.' };
    }
    return { status: 'Optimal', color: '#34C759', text: 'CNS is fresh and ready for explosive outputs.' };
  };

  const cns = getCNSStatus();

  const generateBiomechanicalInsight = (history: SprintLog[]) => {
    if (history.length === 0) return "Upload a sprint video to analyze your block mechanics.";
    
    const latest = history[0];
    const launchAngle = latest.launch_angle ? parseFloat(latest.launch_angle as any) : null;
    const kneeAngle = latest.knee_angle ? parseFloat(latest.knee_angle as any) : null;

    let feedback = "";

    // 1. Analyze Launch Vector Performance
    if (launchAngle && launchAngle > 65) {
      feedback += "⚠️ High Launch Angle detected. You are stepping upwards rather than projecting horizontally. Focus on driving your hips forward out of the blocks.\n\n";
    } else if (launchAngle && launchAngle >= 45 && launchAngle <= 58) {
      feedback += "🔥 Elite Launch Vector! Excellent horizontal projection out of the blocks.\n\n";
    }

    // 2. Analyze Block Geometry 
    if (kneeAngle && (kneeAngle < 85 || kneeAngle > 110)) {
      feedback += "👟 Block Setup Variance: Your front knee angle deviates from the standard 90°-100° optimum baseline. Try adjusting your block pedals slightly forward or backward.";
    } else if (kneeAngle) {
      feedback += "✅ Optimal Muscular Pre-tension: Front knee flexion is in the perfect power zone for maximum impulse.";
    }

    return feedback || "Mechanics look stable. Keep logging starts to map trend variations.";
  };

  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Error signing out: " + error.message);
    }
  };

  return (
    <View style={styles.dashboardContainer}>
      <Text style={styles.dashboardTitle}>Welcome Back, Athlete</Text>

      {/* 🧠 SMART COACHING CARD */}
      <View style={styles.workoutCard}>
        <Text style={{ color: '#8E8E93', fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>
          🧬 Biomechanical Kinematics Report
        </Text>
        <Text style={{ color: '#FFF', fontSize: 15, marginTop: 8, lineHeight: 22, fontWeight: '500' }}>
          {generateBiomechanicalInsight(history)}
        </Text>
      </View>

      {/* 📊 SUMMARY WIDGETS GRID */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 }}>
        {/* Widget 1: Personal Best */}
        <View style={[styles.metricCard, { width: '48%', marginHorizontal: 0, padding: 12 }]}>
          <Text style={styles.metricLabel}>Reaction PR</Text>
          <Text style={[styles.metricValue, { fontSize: 24, color: '#FFD700' }]}>
            {fastestReaction ? `${fastestReaction}ms` : 'N/A'}
          </Text>
        </View>

        {/* Widget 2: Weekly Training Volume */}
        <View style={[styles.metricCard, { width: '48%', marginHorizontal: 0, padding: 12 }]}>
          <Text style={styles.metricLabel}>7-Day Volume</Text>
          <Text style={[styles.metricValue, { fontSize: 24, color: '#007AFF' }]}>
            {weeklyVolume > 0 ? `${weeklyVolume}m` : '0m'}
          </Text>
        </View>
      </View>

      {/* 📈 QUICK PERFORMANCE SNAPSHOT */}
      <View style={styles.workoutCard}>
        <Text style={styles.historyDate}>Recent Progression Ledger</Text>
        {history.length === 0 ? (
          <Text style={styles.historySubtext}>No tracking points found yet. Run an analysis to populate your logs.</Text>
        ) : (
          history.slice(0, 3).map((item, idx) => (
            <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: idx !== 2 ? 0.5 : 0, borderBottomColor: '#2C2C2E' }}>
              <Text style={styles.historySubtext}>{item.date}</Text>
              <Text style={{ color: '#34C759', fontWeight: '700' }}>{item.reaction_time}ms</Text>
            </View>
          ))
        )}
      </View>

      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogOut}
      >
        <Text style={styles.logoutButtonText}>🚪 Sign Out Account</Text>
      </TouchableOpacity>
    </View>
  );
};