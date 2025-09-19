import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function CreateScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          What do you want to make?
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Describe what you'd like to create and get instant guidance
        </ThemedText>
        
        <ThemedView style={styles.input}>
          <ThemedText style={styles.placeholder}>
            I want to make...
          </ThemedText>
        </ThemedView>
        
        <TouchableOpacity style={styles.button}>
          <ThemedText style={styles.buttonText}>
            Generate Plan
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    gap: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    backgroundColor: '#fff',
  },
  placeholder: {
    fontSize: 16,
    opacity: 0.5,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});