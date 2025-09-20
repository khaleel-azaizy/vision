import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { registerWithEmail } from '@/services/firebase';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function RegisterScreen() {
  const cs = useColorScheme();
  const colors = Colors[cs ?? 'light'];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    if (!email || !password || !confirmPassword) {
      return Alert.alert('Missing info', 'Please fill in all fields');
    }
    
    if (password !== confirmPassword) {
      return Alert.alert('Password mismatch', 'Passwords do not match. Please try again.');
    }
    
    if (password.length < 6) {
      return Alert.alert('Password too short', 'Password must be at least 6 characters long.');
    }
    
    setLoading(true);
    try {
      await registerWithEmail(email.trim(), password);
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (e: any) {
      Alert.alert('Register failed', e?.message ?? 'Try again');
    } finally {
      setLoading(false);
    }
  };

  const onGoSignIn = async () => {
    router.push('/(main)/signin');
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}> 
      <ThemedText type="title" style={[styles.title, { color: colors.text }]}>Create Account</ThemedText>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
        placeholder="Email"
        placeholderTextColor={colors.textTertiary}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
        placeholder="Password"
        placeholderTextColor={colors.textTertiary}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
        placeholder="Confirm Password"
        placeholderTextColor={colors.textTertiary}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={onRegister} disabled={loading}>
        <ThemedText style={[styles.buttonText, { color: colors.textInverse }]}>{loading ? 'Please wait…' : 'Register'}</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]} onPress={onGoSignIn}>
        <ThemedText style={[styles.buttonText, { color: colors.text }]}>I have an account</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()}>
        <ThemedText style={{ color: colors.primary }}>Back</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 16 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 },
  button: { paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { fontSize: 16, fontWeight: '600' },
});


