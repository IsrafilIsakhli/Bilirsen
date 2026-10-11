import { Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { PropsWithChildren } from 'react';
import { Card, Icon, Label, layout } from './studio';
import type { IconName } from './studio';
import { colors } from '../theme/tokens';

export function Eyebrow({ children }: PropsWithChildren) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

export function SectionHeading({ title, note }: { title: string; note?: string }) {
  return (
    <View style={{ gap: 8 }}>
      <View style={[layout.between, { flexWrap: 'wrap', rowGap: 4 }]}>
        <Label>{title}</Label>
        {note && <Text style={styles.note}>{note}</Text>}
      </View>
    </View>
  );
}

export function AvatarMedallion({ name, size = 50 }: { name: string; size?: number }) {
  return (
    <LinearGradient
      colors={['#77623f', '#ffe2a5', '#976c2e']}
      style={{ width: size, height: size, borderRadius: size / 2, padding: size > 70 ? 3 : 2 }}
    >
      <View style={{ flex: 1, borderRadius: size / 2, backgroundColor: '#091826', padding: 3 }}>
        <LinearGradient
          colors={['#ffe5ad', '#e4b25e']}
          style={{
            flex: 1,
            borderRadius: size / 2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: colors.background, fontSize: size * 0.45, fontWeight: '700' }}>
            {name.charAt(0).toLocaleUpperCase('az-AZ')}
          </Text>
        </LinearGradient>
      </View>
    </LinearGradient>
  );
}

export function StatTile({
  value,
  title,
  icon,
  accent = colors.gold,
}: {
  value: string;
  title: string;
  icon: IconName;
  accent?: string;
}) {
  return (
    <Card style={{ flex: 1, padding: 12, borderRadius: 12, gap: 8, borderWidth: 0 }}>
      <View
        style={{
          alignItems: 'flex-start',
        }}
      >
        <Icon name={icon} color={accent} size={18} />
      </View>
      <Text
        style={[
          styles.value,
          { color: accent, fontSize: value.length > 5 ? 18 : value.length > 3 ? 23 : 27 },
        ]}
      >
        {value}
      </Text>
      <Text style={[styles.note, { lineHeight: 19 }]}>{title}</Text>
    </Card>
  );
}

export function StudioNotice({ children }: PropsWithChildren) {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 9,
        alignItems: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 2,
      }}
    >
      <Icon name="information-circle-outline" color={colors.muted} size={18} />
      <Text style={{ flex: 1, color: colors.muted, fontSize: 14, lineHeight: 22 }}>{children}</Text>
    </View>
  );
}

export function EmptyStage({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: IconName;
}) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 26, gap: 14 }}>
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          backgroundColor: '#152b40',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name={icon} size={32} />
      </View>
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', textAlign: 'center' }}>
        {title}
      </Text>
      <Text style={[styles.note, { textAlign: 'center', lineHeight: 21, maxWidth: 260 }]}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrow: { color: colors.gold, fontSize: 11, fontWeight: '700', letterSpacing: 1.8 },
  note: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  value: {
    color: colors.goldLight,
    fontSize: 27,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});
