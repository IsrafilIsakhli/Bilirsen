import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Label, layout } from '../../components/studio';
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
  return (
    <View style={styles.summary}>
      <Label>Yarış göstəricilərin</Label>
      <View style={[layout.row, { gap: 18, alignItems: 'center' }]}>
        <View
          style={styles.gauge}
          accessible
          accessibilityLabel={`Düzgün cavab faizi: ${percent}%`}
        >
          <Svg width={104} height={104} viewBox="0 0 104 104" style={StyleSheet.absoluteFill}>
            <Circle cx={52} cy={52} r={48} stroke="#294263" strokeWidth={3} fill="none" />
            {ratio > 0 && (
              <Circle
                cx={52}
                cy={52}
                r={48}
                stroke={colors.goldLight}
                strokeWidth={3}
                fill="none"
                strokeDasharray={[Math.PI * 96, Math.PI * 96]}
                strokeDashoffset={Math.PI * 96 * (1 - ratio)}
                transform="rotate(-90 52 52)"
                strokeLinecap="round"
              />
            )}
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
    </View>
  );
}
const styles = StyleSheet.create({
  summary: {
    gap: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.brass,
    paddingVertical: 14,
  },
  gauge: { width: 104, height: 104, alignItems: 'center', justifyContent: 'center', gap: 0 },
  percent: {
    color: colors.goldLight,
    fontSize: 30,
    lineHeight: 38,
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
