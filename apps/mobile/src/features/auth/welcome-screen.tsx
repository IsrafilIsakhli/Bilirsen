import { Redirect, router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { View, Text, StyleSheet } from 'react-native';
import { sessionSchema } from '@azquiz/contracts';
import {
  Screen,
  Title,
  Body,
  Button,
  ErrorNotice,
  Card,
  Icon,
  layout,
} from '../../components/studio';
import { Eyebrow } from '../../components/studio-elements';
import { BrandMark } from '../../components/brand-mark';
import { useSession } from '../../stores/session';
import { request, errorMessage } from '../../services/http/client';
import { colors } from '../../theme/tokens';
export default function Welcome() {
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
      <View style={styles.hero}>
        <Eyebrow>AZƏRBAYCANIN BİLİK SƏHNƏSİ</Eyebrow>
        <BrandMark size={112} />
        <Text style={styles.brand}>Bilirsən?</Text>
        <Title small>Səhnə sənindir.</Title>
        <Text style={styles.description}>
          Biliyini sına. Pillələri yüksəl.{'\n'}Hər sual yeni bir fürsətdir.
        </Text>
      </View>
      <Card style={{ padding: 14, borderWidth: 0 }}>
        <View style={[layout.row, { gap: 0 }]}>
          {[
            { icon: 'help-circle-outline' as const, title: '10 sual' },
            { icon: 'time-outline' as const, title: 'Bir səhnə' },
            { icon: 'ribbon-outline' as const, title: 'Bilik rankı' },
          ].map((item, index) => (
            <View
              key={item.title}
              style={{
                flex: 1,
                alignItems: 'center',
                gap: 8,
                borderLeftWidth: index ? 1 : 0,
                borderColor: '#c29a5040',
              }}
            >
              <Icon name={item.icon} size={23} />
              <Text style={{ color: colors.text, fontSize: 12, textAlign: 'center' }}>
                {item.title}
              </Text>
            </View>
          ))}
        </View>
      </Card>
      <View style={{ gap: 16 }}>
        {guest.error && <ErrorNotice message={errorMessage(guest.error)} />}
        <Button
          title="Qonaq kimi başla"
          loading={guest.isPending}
          onPress={() => guest.mutate()}
          icon="arrow-forward"
        />
        <Body>
          İlk sınaqda qonaq kimi oynaya bilərsən. Qeydiyyat növbəti mərhələdə əlavə olunacaq.
        </Body>
        <Button title="Hesab ekranlarına bax" onPress={() => router.push('/account')} quiet />
        {__DEV__ && (
          <Button
            title="Bütün dizayn ekranlarına bax"
            onPress={() => router.push('/studio-preview')}
            quiet
          />
        )}
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  content: { justifyContent: 'center', paddingTop: 32, paddingBottom: 32, gap: 28 },
  hero: { alignItems: 'center', gap: 18, paddingTop: 8 },
  brand: { color: colors.goldLight, fontSize: 44, fontWeight: '700', letterSpacing: -1.2 },
  description: { color: colors.muted, fontSize: 15, textAlign: 'center', lineHeight: 25 },
});
