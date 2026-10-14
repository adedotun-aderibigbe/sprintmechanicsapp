import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/globalStyles';
import { SprintLog } from '../types/index';

interface HistoryScreenProps {
  history: SprintLog[];
  clearHistory: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, clearHistory }) => {
  return (
    <View style={styles.dashboardContainer}>
      <Text style={styles.dashboardTitle}>Complete Performance Archive</Text>

      {history.length === 0 ? (
        <Text style={styles.historySubtext}>
          No saved runs found. Go analyze a video to start your ledger!
        </Text>
      ) : (
        history.map((item) => (
          <View key={item.id} style={styles.historyRow}>
            <View>
              <Text style={styles.historyDate}>{item.date}</Text>
              <Text style={styles.historySubtext}>Whistle: {item.whistle_time}ms</Text>
            </View>

            <View style={styles.timeBadge}>
              <Text style={styles.timeBadgeText}>{item.reaction_time} ms</Text>
            </View>
          </View>
        ))
      )}

      {history.length > 0 && (
        <TouchableOpacity style={{ marginTop: 25, paddingVertical: 10 }} onPress={clearHistory}>
          <Text style={{ color: '#FF3B30', textAlign: 'center', fontWeight: '600', fontSize: 14 }}>
            Wipe All History
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};