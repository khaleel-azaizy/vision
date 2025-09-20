import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { onAuthChanged, seedSampleCatalog, signOutUser } from '@/services/firebase';
import { LocationService } from '@/services/locationService';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, TouchableOpacity } from 'react-native';

export function StatusBar() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [location, setLocation] = useState('Getting location...');
  const [locationPermission, setLocationPermission] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Listen to auth changes
  useEffect(() => {
    const unsub = onAuthChanged((user) => {
      setIsAuthenticated(!!user);
      setUserEmail(user?.email || null);
    });
    return () => unsub();
  }, []);

  // Get device location
  useEffect(() => {
    const getLocation = async () => {
      try {
        // Request location permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setLocation('Location denied');
          return;
        }

        setLocationPermission(true);

        // Get current position
        const currentPosition = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          maximumAge: 300000, // 5 minutes
        });

        // Resolve coordinates into a human-readable location
        try {
          const lat = currentPosition.coords.latitude;
          const lng = currentPosition.coords.longitude;

          console.log('Location coordinates:', lat, lng);

          // First try a CORS-friendly reverse geocoding service
          try {
            const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
            const bdcRes = await fetch(bdcUrl);
            if (bdcRes.ok) {
              const bdc = await bdcRes.json();
              // Prefer city/locality + region/country
              const city = bdc.city || bdc.locality || bdc.localityInfo?.administrative?.find((a: any) => a.order === 5)?.name;
              const region = bdc.principalSubdivision || bdc.countryName;
              if (city || region) {
                setLocation(city && region ? `${city}, ${region}` : (city || region));
                return;
              }
            }
          } catch (e) {
            // Ignore and fall back
          }

          // Fallback to our local mapping/approximation
          const locationName = await LocationService.getLocationName(lat, lng);
          setLocation(locationName);

        } catch (locationError) {
          console.log('Location processing error:', locationError);
          setLocation('Current Location');
        }
      } catch (error) {
        console.error('Error getting location:', error);
        setLocation('Location unavailable');
      }
    };

    getLocation();
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getUserDisplayName = () => {
    if (!isAuthenticated) return 'Guest';
    if (userEmail) {
      // Extract name from email (part before @) and limit length
      const name = userEmail.split('@')[0];
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
      // Limit to 8 characters for better fit
      return capitalizedName.length > 8 ? capitalizedName.substring(0, 8) + '...' : capitalizedName;
    }
    return 'User';
  };

  const handleUserAction = () => {
    if (!isAuthenticated) {
      router.push('/(main)/signin');
    } else {
      setShowUserMenu(true);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOutUser();
              setShowUserMenu(false);
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          }
        }
      ]
    );
  };

  const handleViewProfile = () => {
    router.push('/(main)/profile');
    setShowUserMenu(false);
  };

  const handleSeedData = async () => {
    try {
      setShowUserMenu(false);
      const res = await seedSampleCatalog();
      Alert.alert('Seeded', `Added ${res.shops} shops and ${res.items} items.`);
    } catch (e) {
      Alert.alert('Error', 'Failed to seed sample data.');
    }
  };

  return (
    <ThemedView style={[styles.container, { 
      backgroundColor: colors.background,
      borderBottomColor: colors.border 
    }]}>
      <ThemedView style={styles.leftSection}>
        <ThemedText style={[styles.time, { color: colors.text }]}>
          {formatTime(currentTime)}
        </ThemedText>
        <ThemedText style={[styles.date, { color: colors.textSecondary }]}>
          {formatDate(currentTime)}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.centerSection}>
        <Ionicons name="location" size={12} color={colors.textSecondary} />
        <ThemedText style={[styles.location, { color: colors.textSecondary }]}>
          {location}
        </ThemedText>
      </ThemedView>

      <TouchableOpacity 
        style={[styles.rightSection, { 
          backgroundColor: isAuthenticated ? colors.surface : colors.primary,
          borderColor: colors.border 
        }]}
        onPress={handleUserAction}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={isAuthenticated ? "person" : "log-in"} 
          size={10} 
          color={isAuthenticated ? colors.text : colors.textInverse} 
        />
        <ThemedText style={[styles.userText, { 
          color: isAuthenticated ? colors.text : colors.textInverse 
        }]}>
          {isAuthenticated ? getUserDisplayName() : 'Sign In'}
        </ThemedText>
        {isAuthenticated && (
          <Ionicons name="chevron-down" size={8} color={colors.text} />
        )}
      </TouchableOpacity>

      {/* User Menu Modal */}
      <Modal
        visible={showUserMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUserMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowUserMenu(false)}
        >
          <ThemedView style={[styles.userMenu, { 
            backgroundColor: colors.surface,
            borderColor: colors.border
          }]}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleSeedData}
              activeOpacity={0.7}
            >
              <Ionicons name="save" size={16} color={colors.text} />
              <ThemedText style={[styles.menuItemText, { color: colors.text }]}>
                Seed Sample Data
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleViewProfile}
              activeOpacity={0.7}
            >
              <Ionicons name="person" size={16} color={colors.text} />
              <ThemedText style={[styles.menuItemText, { color: colors.text }]}>
                View Profile
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleSignOut}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out" size={16} color={colors.destructive} />
              <ThemedText style={[styles.menuItemText, { color: colors.destructive }]}>
                Sign Out
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </TouchableOpacity>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    height: 48,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    fontWeight: '500',
  },
  centerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 12,
    fontWeight: '500',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  userText: {
    fontSize: 11,
    fontWeight: '600',
    maxWidth: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 48, // Position below status bar
    paddingRight: 20,
  },
  userMenu: {
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 160,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
