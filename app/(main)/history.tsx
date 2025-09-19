import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { borderRadius, colors, shadows, spacing } from '@/styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function HistoryScreen() {
  const recentItems = [
    { id: 1, title: 'Chocolate Chip Cookies', type: 'Recipe', time: '2 hours ago' },
    { id: 2, title: 'Wooden Coffee Table', type: 'DIY Project', time: '1 day ago' },
    { id: 3, title: 'Garden Planter Box', type: 'Craft', time: '3 days ago' },
    { id: 4, title: 'Homemade Pizza Dough', type: 'Recipe', time: '1 week ago' },
    { id: 5, title: 'Floating Shelves', type: 'DIY Project', time: '2 weeks ago' },
    { id: 6, title: 'Macrame Wall Hanging', type: 'Craft', time: '3 weeks ago' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          History
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Your recent projects and creations
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        {recentItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.historyItem}>
            <ThemedView style={styles.historyItemIcon}>
              <Ionicons 
                name={item.type === 'Recipe' ? 'restaurant' : item.type === 'DIY Project' ? 'hammer' : 'color-palette'} 
                size={22} 
                color={colors.primary} 
              />
            </ThemedView>
            <ThemedView style={styles.historyItemText}>
              <ThemedText style={styles.historyItemTitle}>{item.title}</ThemedText>
              <ThemedText style={styles.historyItemMeta}>
                {item.type} • {item.time}
              </ThemedText>
            </ThemedView>
            <Ionicons name="chevron-forward" size={18} color={colors.light.textTertiary} />
          </TouchableOpacity>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    paddingTop: 60,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22,
    color: colors.light.textSecondary,
  },
  content: {
    flex: 1,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.small,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  historyItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.light.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyItemText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  historyItemTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
    color: colors.light.textPrimary,
  },
  historyItemMeta: {
    fontSize: 13,
    opacity: 0.6,
    fontWeight: '500',
    color: colors.light.textSecondary,
  },
});