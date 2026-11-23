import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Eyebrow } from '../../components/studio-elements';
import {
  Screen,
  Title,
  Body,
  Button,
  ErrorNotice,
  LoadingScreen,
  layout,
  Icon,
} from '../../components/studio';
import { keys, useProfile, useHistory, useActiveGame } from '../../services/http/queries';
import { errorMessage } from '../../services/http/client';
import { RankCard } from '../ranks/rank-card';
import { colors, displayFamily } from '../../theme/tokens';
import { useSounds } from '../../services/audio/sound-provider';
import { useScreenRefresh } from '../../hooks/use-screen-refresh';

const homeQueries = [keys.profile, keys.history, keys.active];

export default function Home() {
  const { height } = useWindowDimensions();
  const profile = useProfile();
  const history = useHistory();
  const active = useActiveGame();
  const refresh = useScreenRefresh(homeQueries);
  const { homeAvailable, syncHome } = useSounds();
  const playHome = Boolean(profile.data) && homeAvailable;
  useFocusEffect(
    useCallback(() => {
      if (!playHome) return;
      syncHome(true);
      return () => syncHome(false);
    }, [playHome, syncHome]),
  );
  if (profile.isPending) return <LoadingScreen />;
  if (!profile.data)
    return (
      <Screen atmosphere="quiet">
        <ErrorNotice message={errorMessage(profile.error)} onRetry={() => void profile.refetch()} />
      </Screen>
    );

  const me = profile.data;
  const last = history.data?.[0];
  const activeId = active.data?.id;
  return (
    <Screen style={styles.content} {...refresh}>
      <View style={styles.masthead}>
        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Icon name="person-outline" size={19} />
          </View>
          <View style={styles.identityCopy}>
            <Text style={styles.greeting}>Xoş gəldin,</Text>
            <Text style={styles.contestant}>{me.displayName}</Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tənzimləmələri aç"
          onPress={() => router.push('/settings')}
          style={({ pressed }) => [styles.settings, pressed && styles.pressed]}
        >
          <Icon name="options-outline" size={23} color={colors.text} />
        </Pressable>
      </View>
      <View style={[styles.hero, { minHeight: Math.max(240, Math.min(340, height * 0.36)) }]}>
        <View style={styles.center}>
          <Text accessibilityRole="header" style={styles.wordmark}>
            Bilirsən?
          </Text>
          <Eyebrow>AZƏRBAYCAN DİLİNDƏ BİLİK YARIŞI</Eyebrow>
        </View>
        <View style={styles.center}>
          <Title>{activeId ? 'Yarışın davam edir.' : 'Səhnə sənindir.'}</Title>
          <Text style={styles.invitation}>
            {activeId ? 'Qaldığın sualdan davam et.' : 'Biliyini sına. Öz pilləni yüksəlt.'}
          </Text>
        </View>
      </View>
      <View style={styles.ticket}>
        <View>
          <Eyebrow>TƏK OYUN</Eyebrow>
          <Text style={styles.ticketTitle}>10 sual. Bir səhnə.</Text>
        </View>
        <Icon name="arrow-forward-circle-outline" size={24} />
      </View>
      <Button
        title={activeId ? 'Yarışa davam et' : 'Oyuna başla'}
        disabled={active.isPending || Boolean(active.error)}
        icon="arrow-forward"
        onPress={() =>
          activeId
            ? router.push({ pathname: '/solo', params: { id: activeId } })
            : router.push('/solo-ready')
        }
      />
      <View style={styles.details}>
        <Text style={styles.linkNote}>Qarışıq mövzular</Text>
        <View style={styles.dot} />
        <Text style={styles.linkNote}>3 çətinlik səviyyəsi</Text>
      </View>
      <View style={styles.ranks}>
        <RankCard mode="solo" rank={me.soloRank} />
        <RankCard mode="duel" rank={me.duelRank} />
      </View>
      <View style={styles.links}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/(tabs)/duel')}
          style={({ pressed }) => [styles.link, pressed && styles.pressed]}
        >
          <Text style={styles.linkTitle}>Duel studiyası</Text>
          <Eyebrow>CANLI DUEL TEZLİKLƏ</Eyebrow>
        </Pressable>
        {last ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/solo', params: { id: last.id } })}
            style={({ pressed }) => [styles.link, pressed && styles.pressed]}
          >
            <Text style={styles.linkTitle}>Son nəticə</Text>
            <Text style={styles.linkNote}>
              {last.result.correct}/{last.result.totalQuestions} düzgün · {last.result.score} xal
            </Text>
          </Pressable>
        ) : (
          <View style={styles.link}>
            <Body>İlk yarışın səni gözləyir.</Body>
          </View>
        )}
      </View>
      {active.error && (
        <ErrorNotice message={errorMessage(active.error)} onRetry={() => void active.refetch()} />
      )}
      {history.error && (
        <ErrorNotice message={errorMessage(history.error)} onRetry={() => void history.refetch()} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: 14, paddingBottom: 24 },
  masthead: {
    ...layout.between,
    borderBottomWidth: 1,
    borderColor: '#b3956140',
    paddingBottom: 10,
  },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 },
  identityCopy: { flex: 1, gap: 2 },
  avatar: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: colors.brass,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a1930',
  },
  greeting: { color: colors.muted, fontSize: 12, lineHeight: 17 },
  contestant: { color: colors.text, fontSize: 17, lineHeight: 23, fontWeight: '600' },
  settings: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.7 },
  hero: { justifyContent: 'space-between', paddingTop: 18, paddingBottom: 16, gap: 28 },
  center: { alignItems: 'center', gap: 7 },
  invitation: { color: colors.muted, fontSize: 15, lineHeight: 22, textAlign: 'center' },
  ticket: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: colors.brass,
    paddingTop: 16,
    gap: 12,
  },
  ticketTitle: {
    color: colors.text,
    fontFamily: displayFamily,
    fontSize: 25,
    lineHeight: 33,
    marginTop: 5,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    paddingBottom: 10,
  },
  dot: { width: 3, height: 3, backgroundColor: colors.brass, borderRadius: 2 },
  wordmark: {
    fontFamily: displayFamily,
    color: colors.text,
    fontSize: 58,
    fontWeight: '700',
    textAlign: 'center',
  },
  ranks: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 16,
    borderTopWidth: 1,
    borderColor: colors.brass,
    paddingTop: 10,
  },
  links: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    borderTopWidth: 1,
    borderColor: colors.brass,
  },
  link: { flex: 1, minWidth: 120, minHeight: 52, paddingVertical: 8, gap: 4 },
  linkTitle: { color: colors.text, fontSize: 15, fontWeight: '600' },
  linkNote: { color: colors.muted, fontSize: 13, lineHeight: 20 },
});
