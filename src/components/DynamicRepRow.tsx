import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { styles } from '../styles/globalStyles'; // Adjust path if your styles file is named differently
import { RepPerformance } from '../types/index';

interface DynamicRepRowProps {
  split: RepPerformance;
  index: number;
  formSplits: RepPerformance[];
  setFormSplits: React.Dispatch<React.SetStateAction<RepPerformance[]>>;
}

export const DynamicRepRow: React.FC<DynamicRepRowProps> = ({
  split,
  index,
  formSplits,
  setFormSplits,
}) => {
  return (
    <View style={styles.dynamicRepRow}>
      <Text style={styles.repRowNumberLabel}>Rep #{split.repNumber}</Text>

      {/* Distance Field */}
      <TextInput
        placeholder="Dist (e.g. 60m)"
        placeholderTextColor="#8E8E93"
        style={[styles.inputField, { flex: 1, marginBottom: 0, marginRight: 6 }]}
        value={split.distance}
        onChangeText={(text) => {
          const updated = [...formSplits];
          updated[index].distance = text;
          setFormSplits(updated);
        }}
      />

      {/* Time / Split Field */}
      <TextInput
        placeholder="Time (or leave empty)"
        placeholderTextColor="#8E8E93"
        style={[styles.inputField, { flex: 1.5, marginBottom: 0 }]}
        value={split.time}
        onChangeText={(text) => {
          const updated = [...formSplits];
          updated[index].time = text;
          setFormSplits(updated);
        }}
      />
    </View>
  );
};