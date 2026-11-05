import { StyleSheet, Text, View } from 'react-native';
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
  gauge: { minWidth: 98, alignItems: 'flex-start', justifyContent: 'center', gap: 3 },
  percent: {
    color: colors.goldLight,
    fontSize: 42,
    lineHeight: 48,
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
