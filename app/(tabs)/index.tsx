import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Brain, Trophy, Target } from 'lucide-react-native';

const STRESS_LEVELS = {
  low: { color: '#22c55e', label: 'Low Stress' },
  medium: { color: '#eab308', label: 'Medium Stress' },
  high: { color: '#ef4444', label: 'High Stress' },
};

const QUICK_ACTIONS = [
  {
    title: 'Daily Challenge',
    icon: Trophy,
    color: '#6366f1',
    description: 'Complete today\'s challenge',
  },
  {
    title: 'Set Goals',
    icon: Target,
    color: '#ec4899',
    description: 'Update your goals',
  },
  {
    title: 'Mindfulness',
    icon: Brain,
    color: '#14b8a6',
    description: 'Log your state of mind',
  },
];

const POSITIVE_MESSAGES = [
  'Believe in yourself and all that you are.',
  'Every small step counts towards your big goals.',
  'Your potential is limitless.',
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Carousel Banner */}
      <View style={styles.carousel}>
        <Text style={styles.carouselText}>{POSITIVE_MESSAGES[0]}</Text>
      </View>

      {/* Stress Level Indicator */}
      <View style={styles.stressContainer}>
        <Text style={styles.sectionTitle}>Current Stress Level</Text>
        <View style={[styles.stressIndicator, { backgroundColor: STRESS_LEVELS.low.color }]}>
          <Text style={styles.stressText}>{STRESS_LEVELS.low.label}</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          {QUICK_ACTIONS.map((action, index) => (
            <TouchableOpacity key={index} style={styles.actionCard}>
              <View style={[styles.iconContainer, { backgroundColor: action.color }]}>
                <action.icon color="white" size={24} />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Fun Challenge Button */}
      <TouchableOpacity style={styles.challengeButton}>
        <Text style={styles.challengeButtonText}>Start Fun Challenge</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  carousel: {
    backgroundColor: '#6366f1',
    padding: 24,
    margin: 16,
    borderRadius: 12,
  },
  carouselText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  stressContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  stressIndicator: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  stressText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    padding: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  challengeButton: {
    backgroundColor: '#6366f1',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  challengeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});