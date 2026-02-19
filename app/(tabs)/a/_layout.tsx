import { Stack } from 'expo-router';

export default function ALayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="main" />
    </Stack>
  );
}
