import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { signInWithEmail } from '@/services/firebase';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function SignInScreen() {
  const cs = useColorScheme();
  const colors = Colors[cs ?? 'light'];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSignIn = async () => {
    if (!email || !password) return Alert.alert('Missing info', 'Enter email and password');
    setLoading(true);
    try {
      await signInWithEmail(email.trim(), password);
      router.back();
    } catch (e: any) {
      Alert.alert('Sign in failed', e?.message ?? 'Try again');
    } finally {
      setLoading(false);
    }
  };

  const onRegister = () => {
    router.push('/(main)/register');
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}> 
      <ThemedText type="title" style={[styles.title, { color: colors.text }]}>Sign In</ThemedText>
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
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={onSignIn} disabled={loading}>
        <ThemedText style={[styles.buttonText, { color: colors.textInverse }]}>{loading ? 'Please wait…' : 'Sign In'}</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]} onPress={onRegister}>
        <ThemedText style={[styles.buttonText, { color: colors.text }]}>Create Account</ThemedText>
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


