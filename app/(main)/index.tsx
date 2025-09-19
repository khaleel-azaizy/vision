import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { loadRecentLocalResults } from '@/services/localdb';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [recentItems, setRecentItems] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const results = await loadRecentLocalResults(10);
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
    };
    load();
  }, []);

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    paddingTop: 80,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
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