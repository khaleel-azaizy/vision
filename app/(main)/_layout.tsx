import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function MainLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: Colors[colorScheme ?? 'light'].surface,
          borderTopWidth: 1,
          borderTopColor: Colors[colorScheme ?? 'light'].border,
          height: 80,
          paddingBottom: 20,
          paddingTop: 12,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="result"
        options={{
          href: null, // This hides the screen from the tab bar
        }}
      />
      <Tabs.Screen
        name="history-detail"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}