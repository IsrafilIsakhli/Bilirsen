import { Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';
import { PanelInk } from './stage-panel';
import { colors, typography } from '../theme/tokens';

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
  const edge = state === 'correct' ? colors.green : state === 'wrong' ? colors.red : colors.brass;
  return (
    <Animated.View entering={reveal} style={styles.frame}>
      <PanelInk fill="#0b1b35" edge={edge} />
      {caption && <Text style={styles.caption}>{caption}</Text>}
      <Text accessibilityRole="header" style={styles.question}>
        {text}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  frame: {
    minHeight: 126,
    paddingHorizontal: 19,
    paddingVertical: 17,
    gap: 9,
    justifyContent: 'center',
  },
  caption: { ...typography.cue, color: colors.goldLight, textAlign: 'center' },
  question: {
    ...typography.title,
    fontSize: 25,
    lineHeight: 30,
    color: colors.text,
    textAlign: 'center',
  },
});
