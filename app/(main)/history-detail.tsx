import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { loadResultDetail } from '@/services/localdb';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HistoryDetailScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { id } = useLocalSearchParams();
  const [detail, setDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const d = await loadResultDetail(String(id));
        setDetail(d);
      } catch (e) {
        Alert.alert('Error', 'Failed to load detail');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleBack = () => router.back();

  if (loading) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
        <ThemedView style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={handleBack} style={styles.headerBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <ThemedText type="title" style={[styles.title, { color: colors.text }]}>Loading…</ThemedText>
          <View style={styles.headerBtn} />
        </ThemedView>
      </ThemedView>
    );
  }

  if (!detail) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
        <ThemedView style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={handleBack} style={styles.headerBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <ThemedText type="title" style={[styles.title, { color: colors.text }]}>Not found</ThemedText>
          <View style={styles.headerBtn} />
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <ThemedText type="title" style={[styles.title, { color: colors.text }]}>Project Details</ThemedText>
        <View style={styles.headerBtn} />
      </ThemedView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedView style={[styles.section, { backgroundColor: colors.surface }]}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Overview</ThemedText>
          <ThemedText style={[styles.rowLine, { color: colors.textSecondary }]}>Requested: {new Date(detail.created_at).toLocaleString()}</ThemedText>
          <ThemedText style={[styles.rowLine, { color: colors.textSecondary }]}>Method: {detail.method}</ThemedText>
          {detail.input_text ? (
            <ThemedText style={[styles.rowLine, { color: colors.text }]}>
              Input: {detail.input_text}
            </ThemedText>
          ) : null}
        </ThemedView>

        <ThemedView style={[styles.section, { backgroundColor: colors.surface }]}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Items</ThemedText>
          {detail.items?.map((it: any, idx: number) => (
            <ThemedView key={idx} style={[styles.itemCard, { borderColor: colors.border }]}>
              <ThemedText style={[styles.itemName, { color: colors.text }]}>{it.name}</ThemedText>
              <ThemedText style={[styles.itemMeta, { color: colors.textSecondary }]}>Type: {it.category || it.type}</ThemedText>
              {it.price ? (
                <ThemedText style={[styles.itemMeta, { color: colors.textSecondary }]}>Price: {it.price}</ThemedText>
              ) : null}
              {it.store ? (
                <ThemedText style={[styles.itemMeta, { color: colors.textSecondary }]}>Store: {it.store}</ThemedText>
              ) : null}
            </ThemedView>
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 24,
    borderBottomWidth: 1,
  },
  headerBtn: { padding: 8, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  content: { flex: 1, padding: 16 },
  section: { borderRadius: 16, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  rowLine: { fontSize: 14, marginBottom: 6 },
  itemCard: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 10 },
  itemName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  itemMeta: { fontSize: 14 },
});


