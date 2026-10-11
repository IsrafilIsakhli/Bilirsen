import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, Label, layout } from './studio';
import { colors } from '../theme/tokens';
export function PageHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <View style={[layout.between, { minHeight: 44, marginBottom: 4 }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Geri"
        style={({ pressed }) => ({
          width: 44,
          height: 44,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: '#49698450',
          backgroundColor: pressed ? '#244059' : '#12273b80',
          alignItems: 'center',
          justifyContent: 'center',
        })}
        onPress={onBack ?? (() => router.back())}
      >
        <Icon name="chevron-back" color={colors.text} />
      </Pressable>
      <View style={{ flex: 1, paddingLeft: 4 }}>
        <Label>{title}</Label>
      </View>
    </View>
  );
}
