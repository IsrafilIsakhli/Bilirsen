import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Providers } from '../src/components/providers';
import { useSession } from '../src/stores/session';
function Routes() {
  const authenticated = useSession((state) => Boolean(state.profile));
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#061321' },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="account" />
      <Stack.Protected guard={__DEV__}>
        <Stack.Screen name="studio-preview" />
      </Stack.Protected>
      <Stack.Protected guard={authenticated}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="rank" />
        <Stack.Screen name="solo-ready" />
        <Stack.Screen name="solo" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="history" />
      </Stack.Protected>
    </Stack>
  );
}
export default function RootLayout() {
  return (
    <Providers>
      <StatusBar style="light" />
      <Routes />
    </Providers>
  );
}
