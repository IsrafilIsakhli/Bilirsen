import { StyleSheet, Text, View } from 'react-native';
import { Body, Button, Card, ErrorNotice, Label, layout } from '../../components/studio';
import { EmptyStage, Eyebrow } from '../../components/studio-elements';
import { StudioLoading } from '../../components/studio-loading';
import { BrandMark } from '../../components/brand-mark';
import { ConnectionNotice } from '../../components/connection-notice';
import { colors } from '../../theme/tokens';

export type StudioStateView = 'connection' | 'loading' | 'empty' | 'error' | 'launch' | 'icon';
export function StudioStateContent({ view }: { view: StudioStateView }) {
  if (view === 'loading') return <StudioLoading />;
  if (view === 'connection')
    return (
      <View style={{ gap: 22 }}>
        <ConnectionNotice
          message="Yarışla əlaqə kəsildi. İnternet bağlantını yoxla."
          timedGame
          onRetry={() => undefined}
        />
      </View>
    );
  if (view === 'empty')
    return (
      <View style={{ gap: 20 }}>
        <Eyebrow>SƏNİN BİLİK YOLUN</Eyebrow>
        <Label>Son yarışlar</Label>
        <EmptyStage
          icon="flag-outline"
          title="İlk turun səni gözləyir"
          description="İlk yarışından sonra nəticələrin burada görünəcək."
        />
        <Button title="İlk turuna başla" disabled onPress={() => undefined} />
      </View>
    );
  if (view === 'error')
    return (
      <View style={{ gap: 20 }}>
        <ErrorNotice message="Yarış tarixçəsini yükləmək alınmadı." onRetry={() => undefined} />
      </View>
    );
  if (view === 'launch')
    return (
      <View style={[styles.hero, { paddingVertical: 48 }]}>
        <BrandMark size={160} />
        <Text style={styles.brand}>Bilirsən?</Text>
        <Eyebrow>BİLİK SƏHNƏSİ</Eyebrow>
        <View style={styles.goldLine} />
        <Text style={styles.tagline}>Hər cavab bir addım.</Text>
      </View>
    );
  return (
    <View style={{ gap: 26 }}>
      <View style={styles.hero}>
        <Eyebrow>TƏTBİQİN NİŞANI</Eyebrow>
        <BrandMark size={180} />
        <Text style={styles.title}>Bilirsən?</Text>
        <Body>Sual işarəsi və studiya çərçivəsi.</Body>
      </View>
      <Card>
        <Eyebrow>ANA EKRANDA GÖRÜNÜŞ</Eyebrow>
        <View style={[layout.row, { justifyContent: 'space-around', paddingVertical: 15 }]}>
          <View style={layout.center}>
            <BrandMark size={56} />
            <Text style={styles.tagline}>Bilirsən?</Text>
          </View>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.placeholderIcon} />
          ))}
        </View>
      </Card>
    </View>
  );
}
const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: 22, paddingVertical: 20 },
  title: {
    color: colors.text,
    fontSize: 29,
    lineHeight: 36,
    fontWeight: '700',
    textAlign: 'center',
  },
  brand: { color: colors.goldLight, fontSize: 40, fontWeight: '800', letterSpacing: -1 },
  goldLine: { backgroundColor: colors.gold, width: 32, height: 1, marginVertical: 8 },
  tagline: { color: colors.muted, fontSize: 12 },
  placeholderIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#16304c',
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 12,
  },
});
