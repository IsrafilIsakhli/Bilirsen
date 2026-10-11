import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Card, Label, layout } from '../../components/studio';
import { colors } from '../../theme/tokens';

export function PerformanceSummary({
  correct,
  answered,
  rounds,
}: {
  correct: number;
  answered: number;
  rounds: number;
}) {
  const ratio = answered ? Math.max(0, Math.min(1, correct / answered)) : 0;
  const percent = Math.round(ratio * 100);
  const length = 2 * Math.PI * 43;
  return (
    <Card style={{ gap: 18 }}>
      <Label>Yarış göstəricilərin</Label>
      <View style={[layout.row, { gap: 18, alignItems: 'center' }]}>
        <View
          style={styles.gauge}
          accessible
          accessibilityLabel={`Düzgün cavab faizi: ${percent}%`}
        >
          <Svg width="104" height="104" viewBox="0 0 104 104" style={StyleSheet.absoluteFill}>
            <Circle cx="52" cy="52" r="43" fill="none" stroke={colors.line} strokeWidth="5" />
            <Circle
              cx="52"
              cy="52"
              r="43"
              fill="none"
              stroke={colors.green}
              strokeWidth="5"
              strokeDasharray={[length, length]}
              strokeDashoffset={length * (1 - ratio)}
              strokeLinecap="round"
              transform="rotate(-90 52 52)"
            />
          </Svg>
          <Text style={styles.percent}>{percent}%</Text>
          <Text style={styles.unit}>düzgün</Text>
        </View>
        <View style={{ flex: 1, gap: 10 }}>
          <Text style={styles.total}>
            {rounds}
            <Text style={styles.unit}> solo turu</Text>
          </Text>
          <Text style={styles.description}>
            {answered
              ? `${correct} düzgün cavab · ${answered} bağlanmış sual`
              : 'İlk turunla göstəricilər burada görünəcək.'}
          </Text>
          <Text style={styles.note}>Duel göstəriciləri canlı yarış açıldıqda əlavə olunacaq.</Text>
        </View>
      </View>
    </Card>
  );
}
const styles = StyleSheet.create({
  gauge: { width: 104, height: 104, alignItems: 'center', justifyContent: 'center', gap: 3 },
  percent: {
    color: colors.green,
    fontSize: 25,
    lineHeight: 32,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  unit: { color: colors.muted, fontSize: 12, fontWeight: '400' },
  total: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  description: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  note: { color: colors.muted, fontSize: 12, lineHeight: 18 },
});
