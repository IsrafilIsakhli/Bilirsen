import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Card } from './studio';
import { BrandMark } from './brand-mark';
import { colors } from '../theme/tokens';

export function StudioLoading({ message = 'Səhnə hazırlanır.' }: { message?: string }) {
  return (
    <View accessibilityRole="progressbar" accessibilityLabel={message} style={styles.content}>
      <BrandMark size={64} />
      <Text style={styles.title}>{message}</Text>
      <ActivityIndicator color={colors.gold} />
      <View style={{ width: '100%', gap: 12 }} accessible={false}>
        {[3].map((count) => (
          <Card key={count} style={{ borderColor: colors.line, gap: 14 }}>
            {Array.from({ length: count }, (_, index) => (
              <View
                key={index}
                style={[styles.line, { width: index === 0 ? '100%' : index === 1 ? '74%' : '48%' }]}
              />
            ))}
          </Card>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  content: { alignItems: 'center', gap: 16, paddingVertical: 16 },
  title: {
    color: colors.text,
    fontSize: 19,
    lineHeight: 27,
    fontWeight: '600',
    textAlign: 'center',
  },
  line: { height: 12, backgroundColor: '#223b54', borderRadius: 5 },
});
