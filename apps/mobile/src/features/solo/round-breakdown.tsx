import { StyleSheet, Text, View } from 'react-native';
import type { GameResult } from '@azquiz/contracts';
import { Card, Label, layout } from '../../components/studio';
import { colors } from '../../theme/tokens';

export function RoundBreakdown({ result }: { result: GameResult }) {
  const meters = [
    { title: 'Düzgün cavablar', value: result.correct, color: colors.green },
    { title: 'Bağlanmış suallar', value: result.closedQuestions, color: colors.gold },
  ];
  return (
    <Card style={{ gap: 16 }}>
      <Label>Turun icmalı</Label>
      {meters.map((meter) => (
        <View key={meter.title} style={{ gap: 8 }}>
          <View style={layout.between}>
            <Text style={styles.label}>{meter.title}</Text>
            <Text style={[styles.value, { color: meter.color }]}>
              {meter.value} / {result.totalQuestions}
            </Text>
          </View>
          <View
            style={styles.track}
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel={meter.title}
            accessibilityValue={{ min: 0, max: result.totalQuestions, now: meter.value }}
          >
            <View
              style={{
                height: '100%',
                borderRadius: 3,
                backgroundColor: meter.color,
                width: `${result.totalQuestions ? Math.min(100, (meter.value / result.totalQuestions) * 100) : 0}%`,
              }}
            />
          </View>
        </View>
      ))}
      <Text style={styles.note}>Düzgün cavab sayı yarış xalından ayrı göstərilir.</Text>
    </Card>
  );
}
const styles = StyleSheet.create({
  label: { color: colors.muted, fontSize: 14, lineHeight: 21, flexShrink: 1 },
  value: { fontSize: 14, fontWeight: '600', fontVariant: ['tabular-nums'] },
  track: { height: 5, borderRadius: 3, overflow: 'hidden', backgroundColor: colors.line },
  note: { color: colors.muted, fontSize: 12, lineHeight: 18 },
});
