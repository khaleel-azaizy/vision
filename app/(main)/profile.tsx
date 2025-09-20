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
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchResults = useCallback(async () => {
    try {
      const results = await listRecentResults(10);
      const mapped = results.map((r: any) => ({
        id: r.result_id,
        title: (r.title as string) || (r.items?.[0]?.name as string) || 'Planned project',
        type: r.method || 'AI Plan',
        time: new Date(r.created_at).toLocaleString(),
      }));
      setRecentItems(mapped);
    } catch (e) {
      // ignore for now
    }
  }, []);

  useEffect(() => {
    // Check authentication status immediately
    const unsub = onAuthChanged((user) => {
      setIsAuthenticated(!!user);
      setUserEmail(user?.email || null);
      setIsLoading(false);
      
      // If user is authenticated, fetch results
      if (user) {
        fetchResults();
      }
    });
    return () => unsub();
  }, [fetchResults]);

  useFocusEffect(
    useCallback(() => {
      // Only refresh if already authenticated
      if (isAuthenticated) {
        fetchResults();
      }
    }, [fetchResults, isAuthenticated])
  );


  const handleItemPress = (result_id: string) => {
    router.push({
      pathname: '/(main)/history-detail',
      params: { id: result_id },
    });
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={[styles.screenContainer, { backgroundColor: colors.background }]}>
        <StatusBar />
        <ScrollView 
          style={styles.container} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ThemedView style={styles.header}>
            <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
              Profile
            </ThemedText>
          </ThemedView>
          <ThemedView style={[styles.loadingContainer, { backgroundColor: colors.surface }]}>
            <Ionicons name="person-outline" size={48} color={colors.textTertiary} />
            <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>
              Loading...
            </ThemedText>
          </ThemedView>
        </ScrollView>
      </View>
    );
  }

  // Show sign-in interface if not authenticated
  if (!isAuthenticated) {
    return (
      <View style={[styles.screenContainer, { backgroundColor: colors.background }]}>
        <StatusBar />
        <ScrollView 
          style={styles.container} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ThemedView style={styles.header}>
            <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
              Profile
            </ThemedText>
          </ThemedView>

        {/* Sign In Section */}
        <ThemedView style={[styles.signInSection, { backgroundColor: colors.surface }]}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.text }]}>
            Sign In to Access Your Profile
          </ThemedText>
          
          <ThemedView style={styles.signInOptions}>
            <TouchableOpacity
              style={[styles.signInButton, { backgroundColor: colors.primary, borderColor: colors.primary }]}
              onPress={() => router.push('/(main)/signin')}
              activeOpacity={0.8}
            >
              <Ionicons name="log-in" size={20} color={colors.textInverse} />
              <ThemedText style={[styles.signInButtonText, { color: colors.textInverse }]}>
                Sign In
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.signInButton, { backgroundColor: 'transparent', borderColor: colors.border }]}
              onPress={() => router.push('/(main)/register')}
              activeOpacity={0.8}
            >
              <Ionicons name="person-add" size={20} color={colors.text} />
              <ThemedText style={[styles.signInButtonText, { color: colors.text }]}>
                Create Account
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedText style={[styles.signInDescription, { color: colors.textSecondary }]}>
            Sign in to view your profile details, manage your projects, and access your creation history.
          </ThemedText>
        </ThemedView>

        {/* Benefits Section */}
        <ThemedView style={[styles.benefitsSection, { backgroundColor: colors.surface }]}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.text }]}>
            Why Sign In?
          </ThemedText>
          
          <ThemedView style={styles.benefitsList}>
            <ThemedView style={styles.benefitItem}>
              <Ionicons name="cloud" size={20} color={colors.primary} />
              <ThemedText style={[styles.benefitText, { color: colors.text }]}>
                Sync your plans across devices
              </ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.benefitItem}>
              <Ionicons name="history" size={20} color={colors.primary} />
              <ThemedText style={[styles.benefitText, { color: colors.text }]}>
                Access your project history
              </ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.benefitItem}>
              <Ionicons name="settings" size={20} color={colors.primary} />
              <ThemedText style={[styles.benefitText, { color: colors.text }]}>
                Manage your profile settings
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.screenContainer, { backgroundColor: colors.background }]}>
      <StatusBar />
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
          Profile
        </ThemedText>
        <TouchableOpacity
          style={[styles.headerButton, { borderColor: colors.border, backgroundColor: colors.surface }]}
          onPress={() => router.push('/(main)/create')}
          activeOpacity={0.8}
        >
          <Ionicons name="home" size={16} color={colors.text} />
          <ThemedText style={[styles.headerButtonText, { color: colors.text }]}>Home</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Profile Details Section (no background card) */}
      <ThemedView style={[styles.profileSection]}>
        <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.text }]}>
          Account Details
        </ThemedText>
        
        {isAuthenticated ? (
          <ThemedView style={styles.profileDetails}>
            <ThemedView style={styles.profileRow}>
              <Ionicons name="mail" size={20} color={colors.primary} />
              <ThemedView style={styles.profileInfo}>
                <ThemedText style={[styles.profileLabel, { color: colors.textSecondary }]}>Email</ThemedText>
                <ThemedText style={[styles.profileValue, { color: colors.text }]}>{userEmail}</ThemedText>
              </ThemedView>
            </ThemedView>
            
            <ThemedView style={styles.profileRow}>
              <Ionicons name="calendar" size={20} color={colors.primary} />
              <ThemedView style={styles.profileInfo}>
                <ThemedText style={[styles.profileLabel, { color: colors.textSecondary }]}>Member Since</ThemedText>
                <ThemedText style={[styles.profileValue, { color: colors.text }]}>Recently joined</ThemedText>
              </ThemedView>
            </ThemedView>
            
            <ThemedView style={styles.profileRow}>
              <Ionicons name="document-text" size={20} color={colors.primary} />
              <ThemedView style={styles.profileInfo}>
                <ThemedText style={[styles.profileLabel, { color: colors.textSecondary }]}>Total Projects</ThemedText>
                <ThemedText style={[styles.profileValue, { color: colors.text }]}>{recentItems.length}</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        ) : (
          <ThemedView style={styles.notSignedIn}>
            <Ionicons name="person-outline" size={48} color={colors.textTertiary} />
            <ThemedText style={[styles.notSignedInText, { color: colors.textSecondary }]}>
              Sign in to view your profile details
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>

      {/* History Section (labels only, no background behind section title) */}
      <ThemedView style={styles.historySection}>
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
            onPress={() => handleItemPress(item.id)}
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
      </ScrollView>
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
  scrollContent: {
    padding: 24,
    paddingBottom: 100, // Add extra padding to account for tab bar
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  headerButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  profileSection: {
    padding: 0,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
  },
  profileDetails: {
    gap: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  profileValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  notSignedIn: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  notSignedInText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  historySection: {
    marginBottom: 40,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
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
    fontWeight: '700',
    marginBottom: 2,
    lineHeight: 22,
  },
  recentItemMeta: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
  loadingContainer: {
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  signInSection: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  signInOptions: {
    gap: 12,
    marginBottom: 20,
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  signInDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  benefitsSection: {
    padding: 0,
    marginBottom: 24,
  },
  benefitsList: {
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
});
