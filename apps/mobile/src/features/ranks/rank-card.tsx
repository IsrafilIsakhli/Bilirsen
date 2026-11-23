import { Pressable, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import type { Rank } from '@azquiz/contracts';
import { colors } from '../../theme/tokens';
import { Icon } from '../../components/studio';
export function Progress({ rank }: { rank: Rank }) {
  return (
    <View
      style={styles.track}
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: rank.span, now: rank.progress }}
      accessibilityLabel={`${rank.name} ${rank.division}`}
    >
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
      style={({ pressed }) => [{ flex: 1, minWidth: 0 }, pressed && { opacity: 0.7 }]}
    >
      <View style={styles.summary}>
        <View style={styles.header}>
          <Text style={styles.heading}>{mode === 'solo' ? 'SOLO RANKI' : 'DUEL RANKI'}</Text>
          <Icon name="chevron-forward" size={13} color={colors.muted} />
        </View>
        <Text style={styles.name}>
          {rank.name} {rank.division}
        </Text>
        <Text style={styles.points}>
          {rank.progress} / {rank.span}
        </Text>
        <Progress rank={rank} />
        <Text style={styles.note}>
          {mode === 'duel'
            ? 'Canlı duel tezliklə'
            : rank.nextAt === null
              ? 'Ən yüksək pillə'
              : `Növbəti pilləyə ${rank.nextAt - rank.points} xal`}
        </Text>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  summary: { gap: 7, minHeight: 112, paddingVertical: 8 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4 },
  note: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  track: {
    backgroundColor: '#203750',
    height: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 4 },
  name: { color: colors.text, fontSize: 16, lineHeight: 22, fontWeight: '700' },
  points: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
    fontVariant: ['tabular-nums'],
  },
  heading: {
    color: colors.gold,
    fontSize: 11,
    lineHeight: 17,
    letterSpacing: 1,
    fontWeight: '600',
    flexShrink: 1,
  },
});
