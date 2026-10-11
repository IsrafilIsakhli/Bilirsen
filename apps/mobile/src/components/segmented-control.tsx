import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors } from '../theme/tokens';

type Segment<T extends string> = { value: T; label: string; accessibilityLabel?: string };

export function SegmentedControl<T extends string>({
  value,
  items,
  onChange,
}: {
  value: T;
  items: readonly Segment<T>[];
  onChange: (value: T) => void;
}) {
  return (
    <View style={styles.container}>
      {items.map((item) => {
        const selected = value === item.value;
        return (
          <Pressable
            key={item.value}
            accessibilityRole="button"
            accessibilityLabel={item.accessibilityLabel ?? item.label}
            accessibilityState={{ selected }}
            onPress={() => onChange(item.value)}
            style={[styles.segment, selected && styles.selected]}
          >
            <Text style={[styles.text, selected && styles.selectedText]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 4,
    backgroundColor: '#071525',
    gap: 4,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  selected: {
    backgroundColor: '#21374b',
    borderWidth: 1,
    borderColor: '#d2ae6560',
    boxShadow: '0 2px 7px #00000040',
  },
  text: {
    color: colors.muted,
    fontWeight: '700',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  selectedText: { color: colors.goldLight },
});
