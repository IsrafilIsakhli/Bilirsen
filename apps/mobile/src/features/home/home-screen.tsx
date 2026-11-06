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
} from '../../components/studio';
import { useProfile, useHistory, useActiveGame } from '../../services/http/queries';
import { errorMessage } from '../../services/http/client';
import { RankCard } from '../ranks/rank-card';
import { colors, displayFamily, typography } from '../../theme/tokens';
import { useSounds } from '../../services/audio/sound-provider';

export default function Home() {
  const { height } = useWindowDimensions();
  const profile = useProfile();
  const history = useHistory();
  const active = useActiveGame();
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
    <Screen style={styles.content}>
      <View style={styles.masthead}>
        <Text style={styles.contestant}>{me.displayName}</Text>
        <Eyebrow>BİLİK SƏHNƏSİ</Eyebrow>
      </View>
      <View style={[styles.hero, { minHeight: Math.max(280, Math.min(410, height * 0.48)) }]}>
        <View style={styles.center}>
          <Text accessibilityRole="header" style={styles.wordmark}>
            Bilirsən?
          </Text>
          <Eyebrow>AZƏRBAYCAN DİLİNDƏ BİLİK YARIŞI</Eyebrow>
        </View>
        <View style={styles.center}>
          <Title>{activeId ? 'Yarışın davam edir.' : 'Səhnə sənindir.'}</Title>
          <Eyebrow>TƏK OYUN / 10 SUAL / 3 ÇƏTİNLİK</Eyebrow>
        </View>
      </View>
      <Button
        title={activeId ? 'Yarışa davam et' : 'Oyuna başla'}
        icon="arrow-forward"
        onPress={() =>
          activeId
            ? router.push({ pathname: '/solo', params: { id: activeId } })
            : router.push('/solo-ready')
        }
      />
      <View style={styles.ranks}>
        <RankCard mode="solo" rank={me.soloRank} />
        <RankCard mode="duel" rank={me.duelRank} />
      </View>
      <View style={styles.links}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/(tabs)/duel')}
          style={styles.link}
        >
          <Text style={styles.linkTitle}>Duel studiyası</Text>
          <Eyebrow>CANLI DUEL TEZLİKLƏ</Eyebrow>
        </Pressable>
        {last ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/solo', params: { id: last.id } })}
            style={styles.link}
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
  content: { gap: 13, paddingBottom: 10 },
  masthead: {
    ...layout.between,
    borderBottomWidth: 1,
    borderColor: colors.brass,
    paddingBottom: 12,
  },
  contestant: { ...typography.cue, color: colors.goldLight, flex: 1, textTransform: 'uppercase' },
  hero: { justifyContent: 'space-between', paddingTop: 10, paddingBottom: 5, gap: 18 },
  center: { alignItems: 'center', gap: 7 },
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
  linkNote: { color: colors.muted, fontSize: 12, lineHeight: 17 },
});
