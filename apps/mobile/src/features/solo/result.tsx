import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';
import type { GameResult } from '@azquiz/contracts';
import { Screen, Title, Body, Button, Icon, layout } from '../../components/studio';
import { StagePanel } from '../../components/stage-panel';
import { Eyebrow, StudioNotice } from '../../components/studio-elements';
import { Progress } from '../ranks/rank-card';
import { colors, displayFamily } from '../../theme/tokens';

const reveal = FadeIn.duration(220).reduceMotion(ReduceMotion.System);

export function SoloResult({ result }: { result: GameResult }) {
  const { height } = useWindowDimensions();
  const complete = result.reason === 'completed';
  const before = `${result.previousRank.name} ${result.previousRank.division}`;
  const after = `${result.rank.name} ${result.rank.division}`;
  const promoted = result.rank.points > result.previousRank.points && before !== after;
  const delta = `${result.actualDelta >= 0 ? '+' : ''}${result.actualDelta}`;
  const deltaColor = result.actualDelta < 0 ? colors.red : colors.goldLight;
  return (
    <Screen
      style={styles.content}
      footer={
        <>
          <Button
            title="Yenidən oyna"
            icon="arrow-forward"
            onPress={() => router.replace('/solo-ready')}
          />
          <Button title="Ana səhifəyə qayıt" quiet onPress={() => router.replace('/(tabs)')} />
        </>
      }
    >
      <View style={[styles.intro, { minHeight: Math.max(120, Math.min(224, height * 0.24)) }]}>
        <Eyebrow>TƏK OYUN / NƏTİCƏ</Eyebrow>
        <Title>{complete ? 'Tur tamamlandı!' : 'Tur bağlandı'}</Title>
        <Text style={styles.caption}>
          {!complete
            ? 'Nəticən saxlanıldı.'
            : result.correct === result.totalQuestions
              ? 'On sual. On düzgün cavab.'
              : 'Hər tur bilik yolunda yeni bir addımdır.'}
        </Text>
      </View>
      <StagePanel style={styles.score}>
        <Eyebrow>QAZANILAN YARIŞ XALI</Eyebrow>
        <Text accessibilityLabel={`${result.score} yarış xalı`} style={styles.total}>
          {result.score}
        </Text>
        <Text style={styles.caption}>
          Maksimum {result.maximumScore} / {result.correct}/{result.totalQuestions} düzgün
        </Text>
      </StagePanel>
      <Animated.View entering={promoted ? reveal : undefined} style={styles.rank}>
        <View style={layout.between}>
          <Eyebrow>{promoted ? 'RANK YÜKSƏLDİ' : 'SOLO RANK DƏYİŞİKLİYİ'}</Eyebrow>
          <Text style={[styles.delta, { color: deltaColor }]}>{delta}</Text>
        </View>
        <View style={[layout.between, { flexWrap: 'wrap' }]}>
          <Text style={styles.previous}>{before}</Text>
          <Icon name="arrow-forward" size={16} />
          <Text style={styles.current}>{after}</Text>
        </View>
        <View style={layout.between}>
          <Eyebrow>{result.rank.points} RANK XALI</Eyebrow>
          <Text style={styles.caption}>
            {result.rank.progress} / {result.rank.span}
          </Text>
        </View>
        <Progress rank={result.rank} />
      </Animated.View>
      <View style={styles.breakdown}>
        <View
          style={styles.segments}
          accessible
          accessibilityLabel={`${result.totalQuestions} sualdan ${result.closedQuestions} sual bağlandı`}
        >
          {Array.from({ length: result.totalQuestions }, (_, index) => (
            <View
              key={index}
              style={[styles.segment, index < result.closedQuestions && styles.closed]}
            />
          ))}
        </View>
        <Text style={styles.caption}>
          {result.closedQuestions}/{result.totalQuestions} sual bağlandı.
        </Text>
      </View>
      {!complete && <StudioNotice>Cavab verdiyin sualların nəticəsi saxlanıldı.</StudioNotice>}
      {result.actualDelta !== result.theoreticalDelta && (
        <Body>
          Tur üzrə dəyişiklik {result.theoreticalDelta} idi. Rank minimum 0 olduğu üçün faktiki
          dəyişiklik {result.actualDelta} oldu.
        </Body>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: 15, paddingBottom: 16 },
  intro: { alignItems: 'center', paddingTop: 12, gap: 12 },
  score: { alignItems: 'center', gap: 4, paddingVertical: 18 },
  total: {
    color: colors.goldLight,
    fontSize: 86,
    lineHeight: 96,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  caption: { color: colors.muted, fontSize: 13, lineHeight: 19, textAlign: 'center' },
  rank: { borderTopWidth: 1, borderColor: colors.brass, paddingTop: 10, gap: 8 },
  delta: { fontSize: 27, fontWeight: '600', fontVariant: ['tabular-nums'] },
  previous: { color: colors.muted, fontSize: 16, flexShrink: 1 },
  current: {
    fontFamily: displayFamily,
    color: colors.text,
    fontSize: 23,
    fontWeight: '700',
    flexShrink: 1,
  },
  breakdown: { gap: 10, paddingTop: 5 },
  segments: { flexDirection: 'row', gap: 5 },
  segment: { height: 4, flex: 1, backgroundColor: colors.line },
  closed: { backgroundColor: colors.green },
});
