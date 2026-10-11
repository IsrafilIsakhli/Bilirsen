import { useId, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { colors } from '../theme/tokens';
const reveal = FadeIn.duration(220).reduceMotion(ReduceMotion.System);
export function QuestionFrame({
  text,
  state = 'neutral',
  caption,
}: {
  text: string;
  state?: 'neutral' | 'correct' | 'wrong';
  caption?: string;
}) {
  const [size, setSize] = useState({ width: 400, height: 144 });
  const gradientId = `question-${useId().replace(/:/g, '')}`;
  const border = state === 'correct' ? colors.green : state === 'wrong' ? colors.red : colors.gold;
  return (
    <Animated.View
      entering={reveal}
      onLayout={({ nativeEvent: { layout } }) =>
        setSize((previous) =>
          previous.width === layout.width && previous.height === layout.height
            ? previous
            : { width: layout.width, height: layout.height },
        )
      }
      style={styles.frame}
    >
      <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}>
        <Svg width="100%" height={size.height} viewBox={`0 0 ${size.width} ${size.height}`}>
          <Defs>
            <LinearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop stopColor="#1b3b59" />
              <Stop offset={0.45} stopColor="#132b43" />
              <Stop offset="1" stopColor="#091727" />
            </LinearGradient>
          </Defs>
          <Path
            d={`M18 1 H${size.width - 18} L${size.width - 1} 18 V${size.height - 18} L${size.width - 18} ${size.height - 1} H18 L1 ${size.height - 18} V18 Z`}
            fill={`url(#${gradientId})`}
            stroke={border}
            strokeWidth="1.4"
          />
          <Path
            d={`M22 6 H${size.width - 22} M22 ${size.height - 6} H${size.width - 22}`}
            stroke="#d5deeb"
            strokeWidth={0.6}
            opacity={0.23}
          />
          <Path
            d={`M1 ${size.height / 2} H8 M${size.width - 8} ${size.height / 2} H${size.width - 1}`}
            stroke={border}
            strokeWidth={2}
          />
        </Svg>
      </View>
      {caption && <Text style={styles.caption}>{caption}</Text>}
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  frame: {
    minHeight: 144,
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 12,
  },
  caption: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.3,
    textAlign: 'center',
  },
  text: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 29,
    textAlign: 'center',
  },
});
