import { Redirect, Tabs } from 'expo-router';
import { Icon, DuelMark } from '../../src/components/studio';
import { useSession } from '../../src/stores/session';
import { colors } from '../../src/theme/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function tabTint(focused: boolean) {
  return focused ? colors.gold : colors.muted;
}

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
          backgroundColor: '#050b17',
          borderTopColor: colors.brass,
          height: 56 + Math.max(8, insets.bottom),
          paddingTop: 5,
          paddingBottom: Math.max(8, insets.bottom),
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana səhifə',
          tabBarIcon: ({ focused }) => <Icon name="home-outline" color={tabTint(focused)} />,
        }}
      />
      <Tabs.Screen
        name="duel"
        options={{
          title: 'Duel',
          tabBarIcon: ({ focused }) => <DuelMark size={25} color={tabTint(focused)} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Reytinq',
          tabBarIcon: ({ focused }) => <Icon name="podium-outline" color={tabTint(focused)} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) => <Icon name="person-outline" color={tabTint(focused)} />,
        }}
      />
    </Tabs>
  );
}
