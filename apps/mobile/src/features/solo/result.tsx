import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import type { GameResult } from '@azquiz/contracts';
import { Screen, Title, Button, layout } from '../../components/studio';
import { Eyebrow, StatTile, StudioNotice } from '../../components/studio-elements';
import { RankStrip } from '../ranks/rank-strip';
import { RankPromotion } from '../ranks/rank-promotion';
import { ResultMedallion } from './result-medallion';
import { colors } from '../../theme/tokens';
import { RoundBreakdown } from './round-breakdown';

export function SoloResult({ result }: { result: GameResult }) {
  const { width } = useWindowDimensions();
  const wide = width >= 360;
  const promoted =
    result.rank.points > result.previousRank.points &&
    (result.rank.name !== result.previousRank.name ||
      result.rank.division !== result.previousRank.division);
  return (
    <Screen
      footer={
        <>
          <Button
            title="Yenidən oyna"
            icon="arrow-forward"
            onPress={() => router.replace('/solo-ready')}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ana səhifəyə qayıt"
            onPress={() => router.replace('/(tabs)')}
            style={styles.back}
          >
            <Text style={styles.backText}>Ana səhifəyə qayıt</Text>
          </Pressable>
        </>
      }
    >
      <Eyebrow>TƏK OYUN · NƏTİCƏ</Eyebrow>
      <View style={[wide ? layout.row : layout.center, { gap: 16, paddingVertical: 8 }]}>
        <ResultMedallion
          correct={result.correct}
          total={result.totalQuestions}
          size={wide ? 164 : 180}
        />
        <View
          style={{
            flex: wide ? 1 : undefined,
            alignItems: wide ? 'flex-start' : 'center',
            gap: 10,
          }}
        >
          <Title small>{result.reason === 'completed' ? 'Tur tamamlandı!' : 'Tur bağlandı'}</Title>
          <Text style={[styles.subtitle, { textAlign: wide ? 'left' : 'center' }]}>
            {result.reason === 'abandoned'
              ? 'Nəticən saxlanıldı. Səhnə yenə səni gözləyir.'
              : result.correct === result.totalQuestions
                ? 'On sual. On düzgün cavab. Mükəmməl tur!'
                : 'Hər tur bilik yolunda yeni bir addımdır.'}
          </Text>
        </View>
      </View>
      {promoted && <RankPromotion previous={result.previousRank} current={result.rank} />}
      <View style={[layout.row, { alignItems: 'stretch', gap: 10 }]}>
        <StatTile
          icon="trophy-outline"
          title={'Yarış xalı · maksimum ' + result.maximumScore}
          value={String(result.score)}
        />
        <StatTile
          icon={
            result.actualDelta < 0
              ? 'trending-down-outline'
              : result.actualDelta > 0
                ? 'trending-up-outline'
                : 'remove-outline'
          }
          title="Solo rank dəyişikliyi"
          value={(result.actualDelta >= 0 ? '+' : '') + result.actualDelta}
          accent={
            result.actualDelta < 0
              ? colors.red
              : result.actualDelta > 0
                ? colors.green
                : colors.muted
          }
        />
      </View>
      <RankStrip rank={result.rank} mode="solo" />
      <RoundBreakdown result={result} />
      <StudioNotice>
        {result.reason === 'abandoned' ? 'Cavab verdiyin sualların nəticəsi saxlanıldı. ' : ''}
        {result.closedQuestions}/{result.totalQuestions} sual bağlandı.
      </StudioNotice>
      {result.actualDelta !== result.theoreticalDelta && (
        <Text style={styles.detail}>
          Tur üzrə dəyişiklik {result.theoreticalDelta} idi. Rank minimum 0 olduğu üçün faktiki
          dəyişiklik {result.actualDelta} oldu.
        </Text>
      )}
    </Screen>
  );
}
const styles = StyleSheet.create({
  back: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  backText: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    maxWidth: 280,
  },
  detail: { color: colors.muted, fontSize: 12, lineHeight: 18 },
});
