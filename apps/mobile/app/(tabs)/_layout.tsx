import { Redirect, Tabs } from 'expo-router';
import { Icon, DuelMark } from '../../src/components/studio';
import { useSession } from '../../src/stores/session';
import { colors } from '../../src/theme/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export default function TabsLayout() {
  const profile = useSession((s) => s.profile);
  const insets = useSafeAreaInsets();
  if (!profile) return <Redirect href="/" />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: '#081626',
          borderTopColor: colors.line,
          height: 64 + Math.max(18, insets.bottom),
          paddingTop: 8,
          paddingBottom: Math.max(18, insets.bottom),
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana səhifə',
          tabBarIcon: ({ color }) => <Icon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="duel"
        options={{
          title: 'Duel',
          tabBarIcon: ({ color }) => <DuelMark size={25} color={color} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Reytinq',
          tabBarIcon: ({ color }) => <Icon name="podium-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <Icon name="person-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
