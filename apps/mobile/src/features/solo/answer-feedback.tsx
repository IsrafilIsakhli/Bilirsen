import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';
import type { GameSnapshot } from '@azquiz/contracts';
import { Icon } from '../../components/studio';
import { colors } from '../../theme/tokens';

const reveal = FadeIn.duration(180).reduceMotion(ReduceMotion.System);
export function AnswerFeedback({
  feedback,
  pending,
}: {
  feedback: GameSnapshot['feedback'];
  pending: boolean;
}) {
  const answered = feedback?.selected !== null && feedback !== null;
  const accent = !answered ? colors.muted : feedback.correct ? colors.green : colors.red;
  const title = feedback
    ? feedback.selected === null
      ? 'Vaxt bitdi · rank dəyişmədi'
      : feedback.correct
        ? `Düzgün! +${feedback.points} yarış xalı`
        : 'Bu dəfə alınmadı'
    : pending
      ? 'Cavab təsdiqi gözlənilir…'
      : 'Bir variant seç';
  return (
    <Animated.View
      key={feedback ? 'resolved' : 'open'}
      entering={feedback ? reveal : undefined}
      style={[
        styles.panel,
        feedback && { borderColor: accent + '60', backgroundColor: accent + '0d' },
      ]}
    >
      <View style={styles.row}>
        {pending && !feedback ? (
          <ActivityIndicator color={colors.gold} size="small" />
        ) : feedback ? (
          <Icon
            name={
              feedback.selected === null
                ? 'time-outline'
                : feedback.correct
                  ? 'checkmark-circle-outline'
                  : 'close-circle-outline'
            }
            size={22}
            color={accent}
          />
        ) : (
          <View style={styles.line} />
        )}
        <Text accessibilityLiveRegion="polite" style={[styles.title, { color: accent }]}>
          {title}
        </Text>
        {!feedback && !pending && <View style={styles.line} />}
      </View>
      {feedback && (
        <Text style={styles.rank}>
          Solo rankı: {feedback.rankDelta >= 0 ? '+' : ''}
          {feedback.rankDelta}
        </Text>
      )}
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  panel: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  title: { fontSize: 14, fontWeight: '600', flexShrink: 1, textAlign: 'center' },
  rank: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  line: { width: 26, height: 1, backgroundColor: '#a78249' },
});
