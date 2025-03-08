import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MessageSquare, Users, Video, Calendar } from 'lucide-react-native';

const CHAT_ROOMS = [
  {
    id: '1',
    title: 'General Discussion',
    description: 'Connect with peers and share knowledge',
    icon: MessageSquare,
    color: '#3B82F6',
    participants: 156,
  },
  {
    id: '2',
    title: 'Study Groups',
    description: 'Join or create study groups',
    icon: Users,
    color: '#EC4899',
    participants: 89,
  },
  {
    id: '3',
    title: 'Movie Night',
    description: 'Join our weekly movie nights',
    icon: Video,
    color: '#10B981',
    participants: 45,
  },
];

const UPCOMING_EVENTS = [
  {
    id: '1',
    title: 'Web Dev Workshop',
    date: 'Tomorrow, 3:00 PM',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2070',
  },
  {
    id: '2',
    title: 'Design Thinking Session',
    date: 'Friday, 5:00 PM',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070',
  },
];

export default function ChatScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <Text style={styles.headerSubtitle}>Connect with peers and mentors</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chat Rooms</Text>
        {CHAT_ROOMS.map((room) => (
          <TouchableOpacity key={room.id} style={styles.roomCard}>
            <View style={[styles.iconContainer, { backgroundColor: room.color }]}>
              <room.icon color="#ffffff" size={24} />
            </View>
            <View style={styles.roomInfo}>
              <Text style={styles.roomTitle}>{room.title}</Text>
              <Text style={styles.roomDescription}>{room.description}</Text>
              <Text style={styles.participantsText}>{room.participants} participants</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.eventsScroll}>
          {UPCOMING_EVENTS.map((event) => (
            <TouchableOpacity key={event.id} style={styles.eventCard}>
              <Image source={{ uri: event.image }} style={styles.eventImage} />
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={styles.dateContainer}>
                  <Calendar size={16} color="#6B7280" />
                  <Text style={styles.eventDate}>{event.date}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  roomCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomInfo: {
    flex: 1,
    marginLeft: 16,
  },
  roomTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  roomDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  participantsText: {
    fontSize: 12,
    color: '#6B7280',
  },
  eventsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  eventCard: {
    width: 280,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventImage: {
    width: '100%',
    height: 160,
  },
  eventInfo: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDate: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
});