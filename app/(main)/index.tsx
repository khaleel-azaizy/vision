import { StyleSheet, TouchableOpacity, Animated, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useRef } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const scaleValue = useRef(new Animated.Value(1)).current;
  
  const recentItems = [
    { id: 1, title: 'Chocolate Chip Cookies', type: 'Recipe', time: '2 hours ago' },
    { id: 2, title: 'Wooden Coffee Table', type: 'DIY Project', time: '1 day ago' },
    { id: 3, title: 'Garden Planter Box', type: 'Craft', time: '3 days ago' },
  ];

  const handleCreatePress = () => {
    // Animation for press feedback
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Navigation will be handled by the tab navigator
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Welcome to Vision
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Turn your ideas into reality with step-by-step guidance
        </ThemedText>
      </ThemedView>

      <AnimatedTouchableOpacity 
        style={[
          styles.quickAction, 
          colorScheme === 'dark' ? styles.quickActionDark : styles.quickActionLight,
          { transform: [{ scale: scaleValue }] }
        ]} 
        onPress={handleCreatePress}
        activeOpacity={0.8}
      >
        <ThemedView style={styles.iconContainer}>
          <Ionicons name="add-circle" size={28} color="#FFFFFF" />
        </ThemedView>
        <ThemedView style={styles.quickActionText}>
          <ThemedText style={[styles.quickActionTitle, colorScheme === 'dark' ? styles.titleDark : styles.titleLight]}>
            Start Creating
          </ThemedText>
          <ThemedText style={[styles.quickActionSubtitle, colorScheme === 'dark' ? styles.subtitleDark : styles.subtitleLight]}>
            Tell us what you want to make
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </ThemedView>
      </AnimatedTouchableOpacity>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Recent Projects
        </ThemedText>
        {recentItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.recentItem}>
            <ThemedView style={styles.recentItemIcon}>
              <Ionicons name="document-text" size={22} color="#1976d2" />
            </ThemedView>
            <ThemedView style={styles.recentItemText}>
              <ThemedText style={styles.recentItemTitle}>{item.title}</ThemedText>
              <ThemedText style={styles.recentItemMeta}>
                {item.type} • {item.time}
              </ThemedText>
            </ThemedView>
            <Ionicons name="chevron-forward" size={18} color="#9e9e9e" />
          </TouchableOpacity>
        ))}
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
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionLight: {
    backgroundColor: '#007AFF',
  },
  quickActionDark: {
    backgroundColor: '#0A84FF',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quickActionText: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  titleLight: {
    color: '#FFFFFF',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  quickActionSubtitle: {
    fontSize: 15,
    lineHeight: 20,
  },
  subtitleLight: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  subtitleDark: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  recentItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentItemText: {
    flex: 1,
    marginLeft: 16,
  },
  recentItemTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  recentItemMeta: {
    fontSize: 13,
    opacity: 0.6,
    fontWeight: '500',
  },
  
});