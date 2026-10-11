import { Text, View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { GameSnapshot } from '@azquiz/contracts';
import { colors } from '../../theme/tokens';
import { layout } from '../../components/studio';

export function QuestionStatus({
  snapshot,
  remaining,
}: {
  snapshot: GameSnapshot;
  remaining: number;
}) {
  const question = snapshot.question;
  if (!question) return null;
  const accent =
    question.difficulty === 'asan'
      ? colors.green
      : question.difficulty === 'orta'
        ? colors.gold
        : colors.red;
  const clockColor = remaining <= 5 ? colors.red : colors.gold;
  const circumference = 2 * Math.PI * 30;
  const timeProgress = Math.max(0, Math.min(1, remaining / question.durationSeconds));
  return (
    <View style={{ gap: 14 }}>
      <View style={[layout.row, { gap: 10 }]}>
        <Text style={styles.count}>
          SUAL {question.number} / {question.total}
        </Text>
        <View style={{ flex: 1 }} />
        <View style={[styles.chip, { borderColor: accent + '85' }]}>
          <Text style={{ color: accent, fontSize: 12, fontWeight: '600' }}>
            {question.difficulty === 'asan'
              ? 'Asan'
              : question.difficulty === 'orta'
                ? 'Orta'
                : 'Çətin'}
          </Text>
        </View>
      </View>
      <View
        style={styles.milestones}
        accessible
        accessibilityLabel={`${question.total} sualdan ${question.number}-ci sual`}
      >
        {Array.from({ length: question.total }, (_, index) => (
          <View
            key={index}
            style={[
              styles.milestone,
              index + 1 <= question.number && {
                backgroundColor: index + 1 === question.number ? colors.goldLight : '#967b4d',
              },
              index + 1 === question.number && { boxShadow: '0 0 7px #efbf6950' },
            ]}
          />
        ))}
      </View>
      <View style={[styles.scoreboard, layout.between, { flexWrap: 'wrap', rowGap: 8 }]}>
        <View style={styles.score}>
          <Text style={styles.caption}>Yarış xalı</Text>
          <Text style={styles.number}>{snapshot.score}</Text>
        </View>
        <View
          style={[styles.clock, { borderColor: clockColor + 'ad' }]}
          accessibilityLabel={'Qalan vaxt: ' + remaining + ' saniyə'}
        >
          <View style={styles.timerDial}>
            <Svg width={72} height={72} viewBox="0 0 72 72" style={StyleSheet.absoluteFill}>
              <Circle cx="36" cy="36" r="30" fill="none" stroke={colors.line} strokeWidth="3" />
              <Circle
                cx="36"
                cy="36"
                r="30"
                fill="none"
                stroke={clockColor}
                strokeWidth="3"
                strokeDasharray={[circumference, circumference]}
                strokeDashoffset={circumference * (1 - timeProgress)}
                strokeLinecap="round"
                transform="rotate(-90 36 36)"
              />
            </Svg>
            <Text style={[styles.seconds, { color: clockColor }]}>{remaining}</Text>
            <Text style={{ color: colors.muted, fontSize: 12 }}>san</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  count: { color: colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 0.6 },
  milestones: { flexDirection: 'row', gap: 5 },
  milestone: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.line,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#102236',
  },
  score: {
    minWidth: 90,
    gap: 2,
  },
  scoreboard: {
    backgroundColor: '#0c2034',
    borderWidth: 1,
    borderColor: '#395f8070',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  caption: { color: colors.muted, fontSize: 12 },
  number: {
    color: colors.goldLight,
    fontSize: 32,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  clock: {
    alignItems: 'center',
  },
  timerDial: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center', gap: 1 },
  seconds: { fontSize: 23, lineHeight: 26, fontWeight: '600', fontVariant: ['tabular-nums'] },
});
