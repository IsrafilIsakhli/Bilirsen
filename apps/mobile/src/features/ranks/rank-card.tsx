import { Pressable, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import type { Rank } from '@azquiz/contracts';
import { Card } from '../../components/studio';
import { RankCrest } from '../../components/rank-crest';
import { colors } from '../../theme/tokens';
export function Progress({ rank }: { rank: Rank }) {
  return (
    <View style={styles.track}>
      <LinearGradient
        colors={[colors.goldLight, colors.gold]}
        style={[styles.fill, { width: `${Math.min(100, (rank.progress / rank.span) * 100)}%` }]}
      />
    </View>
  );
}
export function RankCard({
  rank,
  mode,
  compact = false,
}: {
  rank: Rank;
  mode: 'solo' | 'duel';
  compact?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={mode === 'solo' ? 'Solo rankını göstər' : 'Duel rankını göstər'}
      onPress={() => router.push({ pathname: '/rank', params: { mode } })}
      style={{ flex: 1 }}
    >
      <Card style={{ padding: 12, gap: compact ? 9 : 13, flex: 1, borderRadius: 12 }}>
        <Text style={styles.heading}>{mode === 'solo' ? 'Solo rankı' : 'Duel rankı'}</Text>
        <View
          style={
            compact
              ? { gap: 8, flexDirection: 'row', alignItems: 'center' }
              : { gap: 12, alignItems: 'flex-start' }
          }
        >
          <RankCrest name={rank.name} size={compact ? 30 : 48} />
          <View style={compact ? { flex: 1, minWidth: 0 } : { width: '100%' }}>
            <Text style={styles.name}>
              {rank.name} {rank.division}
            </Text>
            <Text style={styles.points}>
              {rank.progress}{' '}
              <Text style={{ color: colors.muted, fontWeight: '500' }}>/ {rank.span}</Text>
            </Text>
          </View>
        </View>
        <Progress rank={rank} />
      </Card>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  track: {
    backgroundColor: '#203750',
    height: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 4 },
  name: { color: colors.text, fontSize: 13, fontWeight: '700' },
  points: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
    fontVariant: ['tabular-nums'],
  },
  heading: { color: colors.muted, fontSize: 13, fontWeight: '600' },
});
