import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedView style={styles.avatar}>
          <Ionicons name="person" size={40} color="#666" />
        </ThemedView>
        <ThemedText type="title" style={styles.name}>
          User Name
        </ThemedText>
        <ThemedText style={styles.email}>
          user@example.com
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="time" size={24} color="#666" />
          <ThemedText style={styles.menuText}>History</ThemedText>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="heart" size={24} color="#666" />
          <ThemedText style={styles.menuText}>Favorites</ThemedText>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings" size={24} color="#666" />
          <ThemedText style={styles.menuText}>Settings</ThemedText>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle" size={24} color="#666" />
          <ThemedText style={styles.menuText}>Help & Support</ThemedText>
          <Ionicons name="chevron-forward" size={20} color="#666" />
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
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    opacity: 0.7,
  },
  menu: {
    gap: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
    marginBottom: 1,
    borderRadius: 8,
  },
  menuText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
  },
});