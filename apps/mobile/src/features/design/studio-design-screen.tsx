import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Body, Card, Icon, Label, Screen, Title, layout } from '../../components/studio';
import { PageHeader } from '../../components/page-header';
import { Eyebrow, StudioNotice } from '../../components/studio-elements';
import { AccountContent } from '../auth/account-content';
import type { AccountView } from '../auth/account-content';
import { DuelStageContent } from '../duel/duel-stage';
import type { DuelStage } from '../duel/duel-stage';
import { StandingsContent } from '../leaderboard/standings-content';
import { StudioStateContent } from './studio-state-content';
import type { StudioStateView } from './studio-state-content';
import { DuelMotionPreview } from './duel-motion-preview';
import { sampleDuel, sampleStandings, sampleStandingSelf } from './design-samples';
import { colors } from '../../theme/tokens';

type DesignEntry = { title: string; id: string } & (
  | { group: 'account'; view: AccountView }
  | { group: 'duel'; view: DuelStage }
  | { group: 'state'; view: StudioStateView }
  | { group: 'standings' | 'motion' }
);
export const designEntries: readonly DesignEntry[] = [
  { id: 'login', title: 'Giriş', group: 'account', view: 'login' },
  { id: 'register', title: 'Qeydiyyat', group: 'account', view: 'register' },
  { id: 'password-recovery', title: 'Şifrə bərpası', group: 'account', view: 'recovery' },
  { id: 'email-verification', title: 'E-poçt təsdiqi', group: 'account', view: 'verification' },
  { id: 'guest-conversion', title: 'Qonaqdan hesaba keçid', group: 'account', view: 'conversion' },
  { id: 'search', title: 'Rəqib axtarışı', group: 'duel', view: 'search' },
  { id: 'faceoff', title: 'Duel başlayır', group: 'duel', view: 'faceoff' },
  { id: 'duel-question', title: 'Duel sualı', group: 'duel', view: 'question' },
  { id: 'overtime', title: 'Əlavə mərhələ', group: 'duel', view: 'overtime' },
  { id: 'victory', title: 'Duel qələbəsi', group: 'duel', view: 'victory' },
  { id: 'defeat', title: 'Duel məğlubiyyəti', group: 'duel', view: 'defeat' },
  { id: 'leaderboard-full', title: 'Dolu reytinq', group: 'standings' },
  { id: 'connection-lost', title: 'Bağlantı kəsilib', group: 'state', view: 'connection' },
  { id: 'loading-state', title: 'Yarış hazırlanır', group: 'state', view: 'loading' },
  { id: 'empty-history', title: 'Boş tarixçə', group: 'state', view: 'empty' },
  { id: 'request-error', title: 'Məlumat alınmadı', group: 'state', view: 'error' },
  { id: 'launch-screen', title: 'Açılış ekranı', group: 'state', view: 'launch' },
  { id: 'app-icon', title: 'Tətbiq ikonu', group: 'state', view: 'icon' },
  { id: 'motion-preview', title: 'Duel keçidinin hərəkəti', group: 'motion' },
];
export default function StudioDesignScreen() {
  const params = useLocalSearchParams<{ screen?: string }>();
  const entry = designEntries.find((item) => item.id === params.screen);
  const [mode, setMode] = useState<'solo' | 'duel'>('solo');
  if (!entry)
    return (
      <Screen>
        <PageHeader title="Dizayn baxışı" />
        <Eyebrow>STUDİYANIN BÜTÜN EKRANLARI</Eyebrow>
        <Title>19 ekran, bir üslub.</Title>
        <Body>
          Bunlar telefon üçün hazırlanmış dizayn ekranlarıdır. Nümunə məlumatlar rəsmi hesab, canlı
          duel və ya reytinq deyil.
        </Body>
        {Boolean(params.screen) && (
          <StudioNotice>Belə dizayn ekranı yoxdur. Siyahıdan ekran seç.</StudioNotice>
        )}
        {designEntries.map((item, index) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={item.title + ' dizaynına bax'}
            onPress={() => router.setParams({ screen: item.id })}
          >
            <Card style={{ padding: 14 }}>
              <View style={layout.row}>
                <Text style={styles.number}>{String(index + 1).padStart(2, '0')}</Text>
                <View style={{ flex: 1, gap: 4 }}>
                  <Label>{item.title}</Label>
                  <Text style={styles.note}>
                    {item.group === 'account'
                      ? 'Hesab ekranı'
                      : item.group === 'duel'
                        ? 'Duel mərhələsi'
                        : item.group === 'standings'
                          ? 'Sıralama görünüşü'
                          : item.group === 'motion'
                            ? 'Vizual keçid'
                            : 'Əlavə vəziyyət'}
                  </Text>
                </View>
                <Icon name="chevron-forward" size={19} color={colors.muted} />
              </View>
            </Card>
          </Pressable>
        ))}
      </Screen>
    );
  const index = designEntries.indexOf(entry);
  const next = designEntries[index + 1];
  const previous = designEntries[index - 1];
  return (
    <Screen
      key={entry.id}
      atmosphere={
        entry.group === 'duel' && entry.view === 'question'
          ? 'question'
          : entry.group === 'duel' ||
              entry.group === 'motion' ||
              (entry.group === 'state' && entry.view === 'launch')
            ? 'stage'
            : 'quiet'
      }
      keyboard={entry.group === 'account'}
      footer={
        <View style={[layout.between, { gap: 4 }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Əvvəlki ekran"
            disabled={!previous}
            onPress={() => previous && router.setParams({ screen: previous.id })}
            style={styles.arrow}
          >
            <Icon name="chevron-back" color={previous ? colors.gold : colors.line} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Bütün dizayn ekranları"
            onPress={() => router.setParams({ screen: '' })}
            style={styles.allLink}
          >
            <Text style={styles.allText}>
              {index + 1} / {designEntries.length} · Bütün ekranlar
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Növbəti ekran"
            disabled={!next}
            onPress={() => next && router.setParams({ screen: next.id })}
            style={styles.arrow}
          >
            <Icon name="chevron-forward" color={next ? colors.gold : colors.line} />
          </Pressable>
        </View>
      }
    >
      {entry.id !== 'launch-screen' && (
        <PageHeader title={entry.title} onBack={() => router.setParams({ screen: '' })} />
      )}
      <View style={styles.previewBadge}>
        <Icon name="color-palette-outline" size={17} />
        <Text style={styles.previewText}>DİZAYN BAXIŞI · NÜMUNƏ MƏLUMATLAR</Text>
      </View>
      {entry.group === 'account' && (
        <AccountContent
          view={entry.view}
          onNavigate={(view) => {
            const destination = designEntries.find(
              (item) => item.group === 'account' && item.view === view,
            );
            if (destination) router.setParams({ screen: destination.id });
          }}
        />
      )}
      {entry.group === 'duel' && <DuelStageContent display={sampleDuel(entry.view)} />}
      {entry.group === 'standings' && (
        <StandingsContent
          mode={mode}
          onChange={setMode}
          players={sampleStandings}
          self={sampleStandingSelf}
        />
      )}
      {entry.group === 'state' && <StudioStateContent view={entry.view} />}
      {entry.group === 'motion' && <DuelMotionPreview />}
    </Screen>
  );
}
const styles = StyleSheet.create({
  number: { width: 30, color: colors.gold, fontSize: 16, fontVariant: ['tabular-nums'] },
  note: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  previewBadge: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#c29a5060',
    borderRadius: 9,
    backgroundColor: '#55472f35',
  },
  previewText: { flex: 1, color: colors.gold, fontSize: 9, letterSpacing: 1.1 },
  arrow: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  allLink: { minHeight: 44, flex: 1, alignItems: 'center', justifyContent: 'center' },
  allText: { color: colors.gold, fontSize: 12 },
});
