import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Trophy, Medal, Target, Share2, CreditCard as Edit2, X, Check } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  degree: z.string().min(1, 'Degree is required'),
  year: z.string().min(1, 'Year is required'),
});

type ProfileData = z.infer<typeof profileSchema>;

const ACHIEVEMENTS = [
  {
    id: '1',
    title: 'Early Bird',
    description: 'Completed morning routine for 7 days',
    icon: Trophy,
    color: '#6366f1',
  },
  {
    id: '2',
    title: 'Focus Master',
    description: 'Studied for 20 hours this week',
    icon: Target,
    color: '#ec4899',
  },
];

const LEADERBOARD = [
  {
    id: '1',
    name: 'Sarah Chen',
    points: 2500,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  },
  {
    id: '2',
    name: 'Michael Park',
    points: 2350,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    points: 2200,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
  },
];

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileData, string>>>({});
  const [profileData, setProfileData] = useState<ProfileData & { avatar: string }>({
    name: '',
    email: '',
    phone: '',
    degree: '',
    year: '',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
  });

  const [editedData, setEditedData] = useState(profileData);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.replace('/sign-up');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (profile) {
        setProfileData({
          ...profile,
          avatar: profileData.avatar, // Keep the default avatar
        });
        setEditedData({
          ...profile,
          avatar: profileData.avatar,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    try {
      profileSchema.parse(editedData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof ProfileData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof ProfileData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.replace('/sign-up');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          name: editedData.name,
          email: editedData.email,
          phone: editedData.phone,
          degree: editedData.degree,
          year: editedData.year,
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfileData(editedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setEditedData(profileData);
    setIsEditing(false);
    setErrors({});
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {!isEditing ? (
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => setIsEditing(true)}
            >
              <Edit2 size={20} color="#6366f1" />
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity 
                style={[styles.editActionButton, styles.cancelButton]} 
                onPress={handleCancel}
              >
                <X size={20} color="#ef4444" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.editActionButton, styles.saveButton]} 
                onPress={handleSave}
              >
                <Check size={20} color="#22c55e" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <Image
          source={{ uri: profileData.avatar }}
          style={styles.avatar}
        />
        
        {isEditing ? (
          <View style={styles.editForm}>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={editedData.name}
              onChangeText={(text) => setEditedData(prev => ({ ...prev, name: text }))}
              placeholder="Name"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={editedData.email}
              onChangeText={(text) => setEditedData(prev => ({ ...prev, email: text }))}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              value={editedData.phone}
              onChangeText={(text) => setEditedData(prev => ({ ...prev, phone: text }))}
              placeholder="Phone"
              keyboardType="phone-pad"
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

            <TextInput
              style={[styles.input, errors.degree && styles.inputError]}
              value={editedData.degree}
              onChangeText={(text) => setEditedData(prev => ({ ...prev, degree: text }))}
              placeholder="Degree"
            />
            {errors.degree && <Text style={styles.errorText}>{errors.degree}</Text>}

            <TextInput
              style={[styles.input, errors.year && styles.inputError]}
              value={editedData.year}
              onChangeText={(text) => setEditedData(prev => ({ ...prev, year: text }))}
              placeholder="Year"
              keyboardType="numeric"
            />
            {errors.year && <Text style={styles.errorText}>{errors.year}</Text>}
          </View>
        ) : (
          <>
            <Text style={styles.name}>{profileData.name}</Text>
            <Text style={styles.details}>{profileData.degree} • Year {profileData.year}</Text>
            <Text style={styles.contactInfo}>{profileData.email}</Text>
            <Text style={styles.contactInfo}>{profileData.phone}</Text>
          </>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2,500</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Challenges</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <TouchableOpacity style={styles.shareButton}>
            <Share2 size={20} color="#6366f1" />
          </TouchableOpacity>
        </View>
        <View style={styles.achievementsGrid}>
          {ACHIEVEMENTS.map((achievement) => (
            <View key={achievement.id} style={styles.achievementCard}>
              <View style={[styles.iconContainer, { backgroundColor: achievement.color }]}>
                <achievement.icon color="white" size={24} />
              </View>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDescription}>{achievement.description}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Leaderboard</Text>
        <View style={styles.leaderboard}>
          {LEADERBOARD.map((user, index) => (
            <View key={user.id} style={styles.leaderboardItem}>
              <Text style={styles.rank}>#{index + 1}</Text>
              <Image source={{ uri: user.avatar }} style={styles.leaderboardAvatar} />
              <View style={styles.leaderboardInfo}>
                <Text style={styles.leaderboardName}>{user.name}</Text>
                <Text style={styles.leaderboardPoints}>{user.points} points</Text>
              </View>
              {index === 0 && <Medal color="#FFD700" size={24} />}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTop: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 1,
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editActionButton: {
    padding: 8,
    borderRadius: 20,
  },
  cancelButton: {
    backgroundColor: '#fef2f2',
  },
  saveButton: {
    backgroundColor: '#f0fdf4',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  editForm: {
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  details: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#e5e7eb',
  },
  section: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  shareButton: {
    padding: 8,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  leaderboard: {
    gap: 12,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  rank: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    width: 40,
  },
  leaderboardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  leaderboardPoints: {
    fontSize: 14,
    color: '#6b7280',
  },
});