import { StatusBar } from '@/components/status-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { listRecentResults, onAuthChanged } from '@/services/firebase';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchResults = useCallback(async () => {
    try {
      const results = await listRecentResults(10);
      const mapped = results.map((r: any) => ({
        id: r.result_id,
        title: (r.items?.[0]?.name as string) || 'Planned project',
        type: r.method || 'AI Plan',
        time: new Date(r.created_at).toLocaleString(),
      }));
      setRecentItems(mapped);
    } catch (e) {
      // ignore for now
    }
  }, []);

  useEffect(() => {
    // initial load
    fetchResults();
  }, [fetchResults]);

  useFocusEffect(
    useCallback(() => {
      // refresh whenever screen gains focus (switching tabs or back navigation)
      fetchResults();
      const unsub = onAuthChanged((user) => {
        setIsAuthenticated(!!user);
        fetchResults();
      });
      return () => unsub();
    }, [fetchResults])
  );


  return (
    <View style={[styles.screenContainer, { backgroundColor: colors.background }]}>
      <StatusBar />
      <ThemedView style={[styles.container, styles.scrollContent]}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
            History
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
            Your past projects and creations
          </ThemedText>
        </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.text }]}>
          Recent Projects
        </ThemedText>
        {recentItems.length === 0 && !isAuthenticated && (
          <TouchableOpacity
            style={[styles.recentItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.push('/(main)/signin')}
            activeOpacity={0.8}
          >
            <ThemedView style={[styles.recentItemIcon, { backgroundColor: colors.primary + '15' }]}> 
              <Ionicons name="log-in" size={22} color={colors.primary} />
            </ThemedView>
            <ThemedView style={styles.recentItemText}>
              <ThemedText style={[styles.recentItemTitle, { color: colors.text }]}>Sign in to sync your plans</ThemedText>
              <ThemedText style={[styles.recentItemMeta, { color: colors.textSecondary }]}>Tap to sign in or register</ThemedText>
            </ThemedView>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
        {recentItems.length === 0 && isAuthenticated && (
          <ThemedView style={[styles.recentItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ThemedView style={[styles.recentItemIcon, { backgroundColor: colors.primary + '15' }]}> 
              <Ionicons name="document-text" size={22} color={colors.primary} />
            </ThemedView>
            <ThemedView style={styles.recentItemText}>
              <ThemedText style={[styles.recentItemTitle, { color: colors.text }]}>No projects yet</ThemedText>
              <ThemedText style={[styles.recentItemMeta, { color: colors.textSecondary }]}>Create your first plan in the Home tab</ThemedText>
            </ThemedView>
          </ThemedView>
        )}
        {recentItems.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.recentItem, { 
              backgroundColor: colors.surface,
              borderColor: colors.border 
            }]}
            activeOpacity={0.7}
            onPress={() => router.push({ pathname: '/(main)/history-detail', params: { id: String(item.id) } })}
          >
            <ThemedView style={[styles.recentItemIcon, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="document-text" size={22} color={colors.primary} />
            </ThemedView>
            <ThemedView style={styles.recentItemText}>
              <ThemedText style={[styles.recentItemTitle, { color: colors.text }]}>
                {item.title}
              </ThemedText>
              <ThemedText style={[styles.recentItemMeta, { color: colors.textSecondary }]}>
                {item.type} • {item.time}
              </ThemedText>
            </ThemedView>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </ThemedView>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  scrollContent: {
    paddingBottom: 100, // Add extra padding to account for tab bar
  },
  header: {
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 4,
    borderWidth: 1,
  },
  recentItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentItemText: {
    flex: 1,
    marginLeft: 20,
  },
  recentItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 22,
  },
  recentItemMeta: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
});