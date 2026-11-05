import { Redirect, router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { sessionSchema } from '@azquiz/contracts';
import { Screen, Title, Button, ErrorNotice } from '../../components/studio';
import { Eyebrow } from '../../components/studio-elements';
import { useSession } from '../../stores/session';
import { request, errorMessage } from '../../services/http/client';
import { colors, displayFamily } from '../../theme/tokens';

export default function Welcome() {
  const { height } = useWindowDimensions();
  const profile = useSession((s) => s.profile);
  const guest = useMutation({
    mutationFn: async () => {
      const session = await request('/auth/guest', sessionSchema, {
        method: 'POST',
        authenticated: false,
      });
      await useSession.getState().setSession(session);
    },
  });
  if (profile) return <Redirect href="/(tabs)" />;

  return (
    <Screen style={styles.content}>
      <View style={[styles.hero, { minHeight: Math.max(330, Math.min(570, height * 0.65)) }]}>
        <View style={styles.center}>
          <Eyebrow>AZƏRBAYCAN DİLİNDƏ BİLİK YARIŞI</Eyebrow>
          <View style={styles.rule} />
          <Text accessibilityRole="header" style={styles.wordmark}>
            Bilirsən?
          </Text>
        </View>
        <View style={styles.center}>
          <Title>Səhnə sənindir.</Title>
          <Eyebrow>10 SUAL / 3 ÇƏTİNLİK / 2 AYRI RANK</Eyebrow>
        </View>
      </View>
      {guest.error && <ErrorNotice message={errorMessage(guest.error)} />}
      <Button title="Qonaq kimi başla" loading={guest.isPending} onPress={() => guest.mutate()} />
      <Button title="Hesab ekranlarına bax" onPress={() => router.push('/account')} quiet />
      {__DEV__ && (
        <Button
          title="Bütün dizayn ekranlarına bax"
          onPress={() => router.push('/studio-preview')}
          quiet
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 24, gap: 9 },
  hero: { justifyContent: 'space-between', gap: 24, paddingTop: 14, paddingBottom: 22 },
  center: { alignItems: 'center', gap: 12 },
  wordmark: {
    fontFamily: displayFamily,
    color: colors.text,
    fontSize: 64,
    fontWeight: '700',
    textAlign: 'center',
  },
  rule: { width: '82%', height: 1, backgroundColor: colors.brass },
});
