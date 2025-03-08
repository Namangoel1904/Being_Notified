import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  degree: z.string().min(1, 'Degree is required'),
  goal: z.enum(['curricular', 'curricular-extra', 'all-round'], {
    required_error: 'Please select a goal',
  }),
});

type FormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    degree: '',
    goal: 'curricular' as const,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validateForm = () => {
    try {
      signUpSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSignUp = async () => {
    setGeneralError(null);
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: 'temporary-password', // In a real app, you'd collect this from the user
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            ...formData,
          });

        if (profileError) throw profileError;

        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setGeneralError('An error occurred during sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Start your journey to success</Text>

        {generalError && (
          <Text style={styles.generalError}>{generalError}</Text>
        )}

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter your full name"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Degree *</Text>
            <TextInput
              style={[styles.input, errors.degree && styles.inputError]}
              value={formData.degree}
              onChangeText={(text) => setFormData({ ...formData, degree: text })}
              placeholder="Enter your degree"
            />
            {errors.degree && <Text style={styles.errorText}>{errors.degree}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Goal *</Text>
            <View style={styles.goalContainer}>
              <TouchableOpacity
                style={[
                  styles.goalButton,
                  formData.goal === 'curricular' && styles.goalButtonActive,
                  errors.goal && styles.goalButtonError,
                ]}
                onPress={() => setFormData({ ...formData, goal: 'curricular' })}
              >
                <Text style={[
                  styles.goalButtonText,
                  formData.goal === 'curricular' && styles.goalButtonTextActive,
                ]}>Only Curricular</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.goalButton,
                  formData.goal === 'curricular-extra' && styles.goalButtonActive,
                  errors.goal && styles.goalButtonError,
                ]}
                onPress={() => setFormData({ ...formData, goal: 'curricular-extra' })}
              >
                <Text style={[
                  styles.goalButtonText,
                  formData.goal === 'curricular-extra' && styles.goalButtonTextActive,
                ]}>Curricular + Extra</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.goalButton,
                  formData.goal === 'all-round' && styles.goalButtonActive,
                  errors.goal && styles.goalButtonError,
                ]}
                onPress={() => setFormData({ ...formData, goal: 'all-round' })}
              >
                <Text style={[
                  styles.goalButtonText,
                  formData.goal === 'all-round' && styles.goalButtonTextActive,
                ]}>All Round Growth</Text>
              </TouchableOpacity>
            </View>
            {errors.goal && <Text style={styles.errorText}>{errors.goal}</Text>}
          </View>

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
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
  content: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  generalError: {
    color: '#ef4444',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
  },
  goalContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  goalButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  goalButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  goalButtonError: {
    borderColor: '#ef4444',
  },
  goalButtonText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
  goalButtonTextActive: {
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});