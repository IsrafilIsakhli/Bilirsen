import { Text, View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { GameSnapshot } from '@azquiz/contracts';
import { PanelInk } from '../../components/stage-panel';
import { colors, typography } from '../../theme/tokens';

const circumference = 2 * Math.PI * 48;

export function QuestionStatus({
  snapshot,
  remaining,
  contestant,
}: {
  snapshot: GameSnapshot;
  remaining: number;
  contestant?: string;
}) {
  const question = snapshot.question;
  if (!question) return null;
  const timeColor = remaining <= 5 ? colors.red : colors.goldLight;
  const progress = Math.max(0, Math.min(1, remaining / question.durationSeconds));
  const difficulty =
    question.difficulty === 'asan' ? 'ASAN' : question.difficulty === 'orta' ? 'ORTA' : 'ÇƏTİN';
  return (
    <View style={styles.status}>
      <View style={styles.captionRow}>
        <Text style={styles.cue}>
          SUAL {question.number} / {question.total}
        </Text>
        <Text style={styles.cue}>{difficulty}</Text>
      </View>
      <View style={styles.track}>
        <View style={styles.focus}>
          <Text style={styles.cue}>QALAN VAXT</Text>
          <View
            style={styles.dial}
            accessible
            accessibilityLabel={`Qalan vaxt: ${remaining} saniyə`}
          >
            <Svg width={112} height={112} viewBox="0 0 112 112" style={StyleSheet.absoluteFill}>
              <Circle cx={56} cy={56} r={54} fill={colors.background} stroke="#6e86ac" />
              <Circle cx={56} cy={56} r={48} fill="none" stroke="#294263" strokeWidth={4} />
              {progress > 0 && (
                <Circle
                  cx={56}
                  cy={56}
                  r={48}
                  fill="none"
                  stroke={timeColor}
                  strokeWidth={4}
                  strokeDasharray={[circumference, circumference]}
                  strokeDashoffset={circumference * (1 - progress)}
                  strokeLinecap="round"
                  transform="rotate(-90 56 56)"
                />
              )}
            </Svg>
            <Text style={[styles.seconds, { color: timeColor }]}>
              {String(remaining).padStart(2, '0')}
            </Text>
            <Text style={styles.secondsCaption}>SANİYƏ</Text>
          </View>
          <View style={styles.scoreboard}>
            {contestant && (
              <View style={styles.contestant}>
                <Text style={styles.smallCue}>YARIŞÇI</Text>
                <Text style={styles.name}>{contestant}</Text>
              </View>
            )}
            <View style={styles.score}>
              <Text style={styles.smallCue}>YARIŞ XALI</Text>
              <Text style={styles.scoreNumber}>{snapshot.score}</Text>
            </View>
          </View>
        </View>
        <View style={styles.ladder} accessibilityLabel="Turun pillələri">
          <PanelInk fill="#071326" />
          <Text style={styles.ladderTitle}>XAL PİLLƏLƏRİ</Text>
          {Array.from({ length: question.total }, (_, index) => {
            const number = question.total - index;
            const current = number === question.number;
            return (
              <View key={number} style={[styles.rung, current && styles.current]}>
                <Text style={[styles.rungText, current && styles.currentText]}>
                  {String(number).padStart(2, '0')}
                </Text>
                <Text style={[styles.rungText, current && styles.currentText]}>
                  {current ? `${question.points} xal` : number < question.number ? '●' : '·'}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  status: { gap: 8 },
  captionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderColor: colors.brass,
  },
  cue: { ...typography.cue, color: colors.goldLight },
  track: { flexDirection: 'row', alignItems: 'stretch', gap: 10 },
  focus: { flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'center', gap: 4 },
  dial: { width: 112, height: 112, alignItems: 'center', justifyContent: 'center', gap: 2 },
  seconds: { fontSize: 44, lineHeight: 49, fontWeight: '600', fontVariant: ['tabular-nums'] },
  secondsCaption: { color: colors.muted, fontSize: 10, letterSpacing: 1.1 },
  scoreboard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 4,
  },
  contestant: { flex: 1, minWidth: 0 },
  smallCue: { color: colors.goldLight, fontSize: 10, lineHeight: 14, fontWeight: '700' },
  name: { color: colors.text, fontSize: 14, lineHeight: 19 },
  score: { marginLeft: 'auto', alignItems: 'flex-end' },
  scoreNumber: {
    color: colors.text,
    fontSize: 22,
    lineHeight: 25,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  ladder: { width: 102, gap: 1, paddingHorizontal: 7, paddingVertical: 9 },
  ladderTitle: {
    color: colors.goldLight,
    fontSize: 9,
    lineHeight: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 3,
  },
  rung: { flexDirection: 'row', justifyContent: 'space-between', gap: 3, paddingHorizontal: 5 },
  current: { backgroundColor: colors.goldLight },
  rungText: { color: colors.muted, fontSize: 10, lineHeight: 13, fontVariant: ['tabular-nums'] },
  currentText: { color: colors.background, fontWeight: '700' },
});
