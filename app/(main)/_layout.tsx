import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="create" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="result" />
      <Stack.Screen name="index" />
      <Stack.Screen name="history-detail" />
      <Stack.Screen name="signin" />
      <Stack.Screen name="register" />
    </Stack>
  );
}