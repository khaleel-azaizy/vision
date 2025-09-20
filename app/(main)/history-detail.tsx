import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getResultById, updateResultItemsCloud } from '@/services/firebase';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function HistoryDetailScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { id } = useLocalSearchParams();
  const [detail, setDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [itemsDraft, setItemsDraft] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const d = await getResultById(String(id));
        setDetail(d);
        setItemsDraft(d?.items ? JSON.parse(JSON.stringify(d.items)) : []);
      } catch (e) {
        Alert.alert('Error', 'Failed to load detail');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleBack = () => router.back();

  const toggleEdit = () => setEditing((e) => !e);

  const updateItemField = (index: number, field: string, value: string) => {
    setItemsDraft((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addItem = () => {
    setItemsDraft((prev) => [
      ...prev,
      { name: '', description: '', price: '', store: '', category: 'product', availability: '' },
    ]);
  };

  const removeItem = (index: number) => {
    setItemsDraft((prev) => prev.filter((_, i) => i !== index));
  };

  const saveChanges = async () => {
    if (!detail) return;
    try {
      await updateResultItemsCloud(detail.result_id, itemsDraft, detail.method);
      const refreshed = await getResultById(detail.result_id);
      setDetail(refreshed);
      setEditing(false);
      Alert.alert('Saved', 'Your changes have been saved.');
    } catch (e) {
      Alert.alert('Error', 'Failed to save changes.');
    }
  };

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
        <TouchableOpacity onPress={editing ? saveChanges : toggleEdit} style={styles.headerBtn}>
          <Ionicons name={editing ? 'save' : 'create'} size={22} color={colors.text} />
        </TouchableOpacity>
      </ThemedView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
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
          {(editing ? itemsDraft : detail.items)?.map((it: any, idx: number) => (
            <ThemedView key={idx} style={[styles.itemCard, { borderColor: colors.border }]}>
              {editing ? (
                <>
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                    placeholder="Name"
                    placeholderTextColor={colors.textTertiary}
                    value={it.name}
                    onChangeText={(t) => updateItemField(idx, 'name', t)}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                    placeholder="Description"
                    placeholderTextColor={colors.textTertiary}
                    value={it.description}
                    onChangeText={(t) => updateItemField(idx, 'description', t)}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                    placeholder="Price"
                    placeholderTextColor={colors.textTertiary}
                    value={String(it.price ?? '')}
                    onChangeText={(t) => updateItemField(idx, 'price', t)}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                    placeholder="Store"
                    placeholderTextColor={colors.textTertiary}
                    value={it.store}
                    onChangeText={(t) => updateItemField(idx, 'store', t)}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                    placeholder="Category (product/tool)"
                    placeholderTextColor={colors.textTertiary}
                    value={it.category || it.type}
                    onChangeText={(t) => updateItemField(idx, 'category', t as any)}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                    placeholder="Availability"
                    placeholderTextColor={colors.textTertiary}
                    value={it.availability}
                    onChangeText={(t) => updateItemField(idx, 'availability', t)}
                  />
                  <TouchableOpacity onPress={() => removeItem(idx)} style={styles.removeBtn}>
                    <Ionicons name="trash" size={18} color={colors.error} />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <ThemedText style={[styles.itemName, { color: colors.text }]}>{it.name}</ThemedText>
                  <ThemedText style={[styles.itemMeta, { color: colors.textSecondary }]}>Type: {it.category || it.type}</ThemedText>
                  {it.price ? (
                    <ThemedText style={[styles.itemMeta, { color: colors.textSecondary }]}>Price: {it.price}</ThemedText>
                  ) : null}
                  {it.store ? (
                    <ThemedText style={[styles.itemMeta, { color: colors.textSecondary }]}>Store: {it.store}</ThemedText>
                  ) : null}
                </>
              )}
            </ThemedView>
          ))}
          {editing ? (
            <TouchableOpacity onPress={addItem} style={styles.addBtn}>
              <Ionicons name="add" size={20} color={colors.text} />
            </TouchableOpacity>
          ) : null}
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
    paddingTop: 20,
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
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 8 },
  addBtn: { alignSelf: 'flex-start', padding: 10, borderRadius: 10 },
  removeBtn: { alignSelf: 'flex-end', padding: 6 },
});


