import { StatusBar } from '@/components/status-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function CreateScreen() {
  const [userRequest, setUserRequest] = useState('');
  const colorScheme = useColorScheme();

  const handlePlan = () => {
    if (!userRequest.trim()) {
      Alert.alert('Please enter your request', 'Tell us what you want to make so we can help you plan it!');
      return;
    }

    // Navigate to result page with the user's request
    router.push({
      pathname: '/(main)/result',
      params: { userRequest: userRequest.trim() }
    });
  };


  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.screenContainer}>
      <StatusBar />
      <LinearGradient
        colors={colorScheme === 'dark'
          ? [colors.background, colors.backgroundSecondary]
          : [colors.background, colors.backgroundSecondary]
        }
        style={styles.container}
      >
        <ThemedView style={[styles.content, styles.scrollContent]}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
            Welcome to Vision
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
            Turn your ideas into reality with step-by-step guidance
          </ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.inputSection}>
          <ThemedView style={[styles.inputContainer, { 
            backgroundColor: colors.surface,
            borderColor: colors.border 
          }]}>
            <TextInput
              style={[styles.input, { 
                color: colors.text,
                backgroundColor: 'transparent'
              }]}
              placeholder="I want to make..."
              placeholderTextColor={colors.textTertiary}
              value={userRequest}
              onChangeText={setUserRequest}
              multiline
              textAlignVertical="top"
            />
          </ThemedView>
          
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity 
              style={styles.buttonTouchable}
              onPress={handlePlan}
              activeOpacity={0.8}
            >
              <ThemedText style={[styles.buttonText, { color: colors.textInverse }]}>
                Plan
              </ThemedText>
            </TouchableOpacity>
          </LinearGradient>
        </ThemedView>
        </ThemedView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 20,
  },
  scrollContent: {
    paddingBottom: 100, // Add extra padding to account for tab bar
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  inputSection: {
    flex: 1,
    justifyContent: 'center',
    gap: 24,
  },
  inputContainer: {
    borderWidth: 2,
    borderRadius: 16,
    minHeight: 140,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    padding: 20,
    fontSize: 16,
    minHeight: 140,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  button: {
    borderRadius: 16,
  },
  buttonTouchable: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});