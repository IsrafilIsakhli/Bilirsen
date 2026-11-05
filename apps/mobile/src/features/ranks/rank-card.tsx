import { Pressable, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import type { Rank } from '@azquiz/contracts';
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
export function RankCard({ rank, mode }: { rank: Rank; mode: 'solo' | 'duel' }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={mode === 'solo' ? 'Solo rankını göstər' : 'Duel rankını göstər'}
      onPress={() => router.push({ pathname: '/rank', params: { mode } })}
      style={{ flex: 1 }}
    >
      <View style={styles.summary}>
        <Text style={styles.heading}>{mode === 'solo' ? 'SOLO RANKI' : 'DUEL RANKI'}</Text>
        <Text style={styles.name}>
          {rank.name} {rank.division}
        </Text>
        <Text style={styles.points}>
          {rank.progress} / {rank.span}
        </Text>
        <Progress rank={rank} />
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  summary: { gap: 4, minHeight: 74, paddingVertical: 4 },
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
