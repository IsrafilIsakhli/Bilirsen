import type { ReactNode } from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import type { OptionKey } from '@azquiz/contracts';
import { Icon } from '../../components/studio';
import { PanelInk } from '../../components/stage-panel';
import { colors } from '../../theme/tokens';

type Answer = { key: OptionKey; text: string };
type AnswerState = 'neutral' | 'pending' | 'correct' | 'wrong';

export function AnswerGrid({
  options,
  children,
}: {
  options: readonly Answer[];
  children: (option: Answer) => ReactNode;
}) {
  const { width, fontScale } = useWindowDimensions();
  const paired =
    options.length === 4 &&
    width >= 360 &&
    fontScale <= 1.2 &&
    options.every((option) => option.text.length <= 18);
  if (!paired) return <View style={styles.stack}>{options.map(children)}</View>;
  return (
    <View style={styles.stack}>
      {[options.slice(0, 2), options.slice(2, 4)].map((row, index) => (
        <View key={index} style={styles.row}>
          {row.map((option) => (
            <View key={option.key} style={styles.cell}>
              {children(option)}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const optionColors = {
  neutral: { edge: colors.brass, fill: '#102441' },
  pending: { edge: colors.goldLight, fill: '#203752' },
  correct: { edge: colors.green, fill: '#102f32' },
  wrong: { edge: colors.red, fill: '#3b2330' },
} satisfies Record<AnswerState, { edge: string; fill: string }>;

export function AnswerOption({
  option,
  state,
  disabled,
  onPress,
  dimmed = false,
}: {
  option: Answer;
  state: AnswerState;
  disabled: boolean;
  onPress: () => void;
  dimmed?: boolean;
}) {
  const { edge, fill } = optionColors[state];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${option.key}. ${option.text}`}
      accessibilityState={{ disabled, selected: state !== 'neutral' }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.option, dimmed && styles.dimmed, pressed && styles.pressed]}
    >
      <PanelInk fill={fill} edge={edge} />
      <View style={[styles.letter, { borderColor: edge }]}>
        <Text style={[styles.key, { color: state === 'neutral' ? colors.goldLight : edge }]}>
          {option.key}
        </Text>
      </View>
      <Text style={styles.text}>{option.text}</Text>
      <View style={styles.marker}>
        {state === 'pending' && <ActivityIndicator size="small" color={colors.gold} />}
        {(state === 'correct' || state === 'wrong') && (
          <Icon name={state === 'correct' ? 'checkmark' : 'close'} color={edge} size={16} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'stretch', gap: 8 },
  cell: { flex: 1, minWidth: 0 },
  option: {
    flex: 1,
    minHeight: 57,
    paddingHorizontal: 11,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  letter: {
    width: 28,
    height: 29,
    borderWidth: 1,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#182d4e',
  },
  key: { fontSize: 15, fontWeight: '600' },
  text: {
    flex: 1,
    minWidth: 0,
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
  marker: { width: 16, alignItems: 'center' },
  dimmed: { opacity: 0.68 },
  pressed: { opacity: 0.88 },
});
