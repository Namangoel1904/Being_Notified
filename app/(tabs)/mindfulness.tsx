import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Brain, Calendar, Clock, Heart, Music } from 'lucide-react-native';

const MOODS = [
  { id: 'great', label: 'Great', color: '#22c55e' },
  { id: 'good', label: 'Good', color: '#3b82f6' },
  { id: 'okay', label: 'Okay', color: '#eab308' },
  { id: 'bad', label: 'Bad', color: '#ef4444' },
];

const FEELINGS = [
  'Anxious', 'Calm', 'Confident', 'Confused',
  'Energetic', 'Frustrated', 'Happy', 'Inspired',
  'Peaceful', 'Stressed', 'Tired', 'Worried'
];

const FACTORS = [
  'Academics', 'Family', 'Friends', 'Health',
  'Work', 'Sleep', 'Exercise', 'Diet',
  'Social Life', 'Personal Growth', 'Finances', 'Other'
];

export default function MindfulnessScreen() {
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const toggleFeeling = (feeling: string) => {
    setSelectedFeelings(prev =>
      prev.includes(feeling)
        ? prev.filter(f => f !== feeling)
        : [...prev, feeling]
    );
  };

  const toggleFactor = (factor: string) => {
    setSelectedFactors(prev =>
      prev.includes(factor)
        ? prev.filter(f => f !== factor)
        : [...prev, factor]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mindfulness Journal</Text>
        <Text style={styles.headerSubtitle}>Track your mental well-being</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How are you feeling?</Text>
        <View style={styles.moodGrid}>
          {MOODS.map(mood => (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodButton,
                selectedMood === mood.id && { backgroundColor: mood.color }
              ]}
              onPress={() => setSelectedMood(mood.id)}
            >
              <Text style={[
                styles.moodText,
                selectedMood === mood.id && styles.moodTextSelected
              ]}>
                {mood.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What describes your feelings?</Text>
        <View style={styles.feelingsGrid}>
          {FEELINGS.map(feeling => (
            <TouchableOpacity
              key={feeling}
              style={[
                styles.feelingChip,
                selectedFeelings.includes(feeling) && styles.feelingChipSelected
              ]}
              onPress={() => toggleFeeling(feeling)}
            >
              <Text style={[
                styles.feelingText,
                selectedFeelings.includes(feeling) && styles.feelingTextSelected
              ]}>
                {feeling}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What factors are affecting you?</Text>
        <View style={styles.factorsGrid}>
          {FACTORS.map(factor => (
            <TouchableOpacity
              key={factor}
              style={[
                styles.factorChip,
                selectedFactors.includes(factor) && styles.factorChipSelected
              ]}
              onPress={() => toggleFactor(factor)}
            >
              <Text style={[
                styles.factorText,
                selectedFactors.includes(factor) && styles.factorTextSelected
              ]}>
                {factor}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Notes</Text>
        <TextInput
          style={styles.notesInput}
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={setNotes}
          placeholder="Write your thoughts here..."
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard}>
            <Music color="#6366f1" size={24} />
            <Text style={styles.actionTitle}>Meditation</Text>
            <Text style={styles.actionSubtitle}>10 min session</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Heart color="#ec4899" size={24} />
            <Text style={styles.actionTitle}>Gratitude</Text>
            <Text style={styles.actionSubtitle}>Write journal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Calendar color="#10b981" size={24} />
            <Text style={styles.actionTitle}>Schedule</Text>
            <Text style={styles.actionSubtitle}>Plan your day</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Save Entry</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  moodGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  moodButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  moodText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  moodTextSelected: {
    color: '#ffffff',
  },
  feelingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  feelingChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  feelingChipSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  feelingText: {
    fontSize: 14,
    color: '#111827',
  },
  feelingTextSelected: {
    color: '#ffffff',
  },
  factorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  factorChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  factorChipSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  factorText: {
    fontSize: 14,
    color: '#111827',
  },
  factorTextSelected: {
    color: '#ffffff',
  },
  notesInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    height: 120,
    textAlignVertical: 'top',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 8,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#6366f1',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});