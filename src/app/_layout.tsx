import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(app)" />
      <Stack.Screen name="connexion" />
      <Stack.Screen name="cgu-cgv" />
      <Stack.Screen name="politique-confidentialite" />
    </Stack>
  );
}
