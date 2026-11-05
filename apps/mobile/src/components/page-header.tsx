import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, Title, layout } from './studio';
import { colors } from '../theme/tokens';
export function PageHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <View
      style={[
        layout.between,
        { minHeight: 48, paddingBottom: 8, borderBottomWidth: 1, borderColor: colors.brass },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Geri"
        style={({ pressed }) => ({
          width: 44,
          height: 44,
          backgroundColor: pressed ? colors.panelLight : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        })}
        onPress={onBack ?? (() => router.back())}
      >
        <Icon name="chevron-back" color={colors.goldLight} />
      </Pressable>
      <View style={{ flex: 1, paddingLeft: 4 }}>
        <Title>{title}</Title>
      </View>
    </View>
  );
}
