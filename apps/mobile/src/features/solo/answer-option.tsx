import { Pressable, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useId, useState } from 'react';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import type { OptionKey } from '@azquiz/contracts';
import { Icon } from '../../components/studio';
import { colors } from '../../theme/tokens';
export function AnswerOption({
  option,
  state,
  disabled,
  onPress,
  dimmed = false,
}: {
  option: { key: OptionKey; text: string };
  state: 'neutral' | 'pending' | 'correct' | 'wrong';
  disabled: boolean;
  onPress: () => void;
  dimmed?: boolean;
}) {
  const gradientId = `answer-${useId().replace(/:/g, '')}`;
  const [size, setSize] = useState({ width: 400, height: 64 });
  const border =
    state === 'correct'
      ? colors.green
      : state === 'wrong'
        ? colors.red
        : state === 'pending'
          ? colors.goldLight
          : '#a28a61';
  const fill =
    state === 'correct'
      ? '#15352f'
      : state === 'wrong'
        ? '#3b222b'
        : state === 'pending'
          ? '#3b3540'
          : '#16314d';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${option.key}. ${option.text}`}
      accessibilityState={{ disabled, selected: state !== 'neutral' }}
      disabled={disabled}
      onPress={onPress}
      onLayout={({ nativeEvent: { layout } }) =>
        setSize((previous) =>
          previous.width === layout.width && previous.height === layout.height
            ? previous
            : { width: layout.width, height: layout.height },
        )
      }
      style={({ pressed }) => [
        styles.option,
        dimmed && { opacity: 0.55 },
        pressed && { opacity: 0.9 },
      ]}
    >
      <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${size.width} ${size.height}`}>
          <Defs>
            <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop stopColor={fill} />
              <Stop offset="1" stopColor={state === 'neutral' ? '#081726' : fill} />
            </LinearGradient>
          </Defs>
          <Path
            d={`M16 1 H${size.width - 16} L${size.width - 1} ${size.height / 2} L${size.width - 16} ${size.height - 1} H16 L1 ${size.height / 2} Z`}
            fill={`url(#${gradientId})`}
            stroke={border}
            strokeWidth={state === 'neutral' ? 1 : 1.7}
          />
          <Path d={`M21 5 H${size.width - 21}`} stroke="#bddbf2" strokeWidth={0.5} opacity={0.24} />
        </Svg>
      </View>
      <View
        style={[
          styles.letter,
          {
            borderColor: border,
            backgroundColor: state !== 'neutral' ? border : '#112237',
          },
        ]}
      >
        <Text style={[styles.key, { color: state !== 'neutral' ? colors.background : border }]}>
          {option.key}
        </Text>
      </View>
      <Text style={styles.text}>{option.text}</Text>
      {state === 'pending' && <ActivityIndicator size="small" color={colors.gold} />}
      {(state === 'correct' || state === 'wrong') && (
        <Icon
          name={state === 'correct' ? 'checkmark-circle' : 'close-circle'}
          color={border}
          size={22}
        />
      )}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  option: {
    minHeight: 64,
    paddingHorizontal: 22,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  key: { fontSize: 17, fontWeight: '600' },
  letter: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff05',
  },
  text: { flex: 1, color: colors.text, fontWeight: '600', fontSize: 16, lineHeight: 23 },
});
