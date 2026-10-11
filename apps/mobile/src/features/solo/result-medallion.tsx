import { useId } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, LinearGradient, Stop } from 'react-native-svg';
import { Icon } from '../../components/studio';
import { colors } from '../../theme/tokens';

const reveal = FadeIn.duration(220).reduceMotion(ReduceMotion.System);

export function ResultMedallion({
  correct,
  total,
  size = 224,
}: {
  correct: number;
  total: number;
  size?: number;
}) {
  const id = 'result-' + useId().replace(/:/g, '');
  const circumference = Math.PI * 2 * 91;
  const segment = circumference / total;
  return (
    <Animated.View
      entering={reveal}
      style={[styles.medallion, { width: size, height: size }]}
      accessible
      accessibilityLabel={`Düzgün cavab: ${correct} / ${total}`}
    >
      <Svg width={size} height={size} viewBox="0 0 224 224" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id={id}>
            <Stop stopColor="#dcb568" stopOpacity={0.12} />
            <Stop offset={1} stopColor="#dcb568" stopOpacity={0} />
          </RadialGradient>
          <LinearGradient id={`${id}-metal`} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop stopColor="#ffe1a0" />
            <Stop offset={0.5} stopColor="#977742" />
            <Stop offset={1} stopColor="#f2c875" />
          </LinearGradient>
        </Defs>
        <Circle cx={112} cy={112} r={111} fill={`url(#${id})`} />
        <Circle
          cx={112}
          cy={112}
          r={79}
          fill="#10263c"
          stroke={`url(#${id}-metal)`}
          strokeWidth={1}
        />
        {Array.from({ length: total }, (_, index) => (
          <Circle
            key={index}
            cx={112}
            cy={112}
            r={91}
            fill="none"
            stroke={index < correct ? colors.goldLight : '#25415d'}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={[segment - 11, circumference - segment + 11]}
            transform={`rotate(${-90 + (index * 360) / total} 112 112)`}
          />
        ))}
      </Svg>
      <Icon
        name={correct === total ? 'trophy-outline' : 'ribbon-outline'}
        size={Math.round(size * 0.1)}
      />
      <Text
        style={[
          styles.number,
          { fontSize: Math.round(size * 0.27), lineHeight: Math.round(size * 0.31) },
        ]}
      >
        {correct}
        <Text style={[styles.total, { fontSize: Math.round(size * 0.12) }]}>/{total}</Text>
      </Text>
      <Text style={[styles.caption, { fontSize: size < 190 ? 10 : 12 }]}>DÜZGÜN CAVAB</Text>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  medallion: { width: 224, height: 224, alignItems: 'center', justifyContent: 'center', gap: 6 },
  number: {
    color: colors.goldLight,
    fontSize: 60,
    fontWeight: '600',
    lineHeight: 68,
    fontVariant: ['tabular-nums'],
  },
  total: { color: colors.muted, fontSize: 26, fontWeight: '500' },
  caption: { color: colors.muted, fontSize: 12, letterSpacing: 0.7 },
});
