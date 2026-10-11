import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from './studio';
import type { IconName } from './studio';
import { colors, spacing } from '../theme/tokens';

export function ActionRow({
  title,
  description,
  icon,
  onPress,
  disabled = false,
  divided = false,
  trailing = 'chevron-forward',
}: {
  title: string;
  description?: string;
  icon: IconName;
  onPress: () => void;
  disabled?: boolean;
  divided?: boolean;
  trailing?: IconName;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        divided && styles.divided,
        pressed && { backgroundColor: '#244158' },
        disabled && { opacity: 0.55 },
      ]}
    >
      <View style={styles.icon}>
        <Icon name={icon} size={23} color={disabled ? colors.muted : colors.gold} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      <Icon name={trailing} size={19} color={colors.muted} />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  divided: { borderTopWidth: 1, borderTopColor: colors.line },
  icon: { width: 28, alignItems: 'center' },
  copy: { flex: 1, gap: 4 },
  title: { color: colors.text, fontSize: 16, lineHeight: 23, fontWeight: '600' },
  description: { color: colors.muted, fontSize: 12, lineHeight: 19 },
});
