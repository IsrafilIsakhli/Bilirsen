import type { ComponentProps, PropsWithChildren, ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { StageBackground } from './stage-background';
import type { StageAtmosphere } from './stage-background';
export { StageBackground } from './stage-background';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { BrandMark } from './brand-mark';

export type IconName = ComponentProps<typeof Ionicons>['name'];
export function Icon({
  name,
  size = 24,
  color = colors.gold,
}: {
  name: IconName;
  size?: number;
  color?: ColorValue;
}) {
  return <Ionicons name={name} size={size} color={color} />;
}
export function DuelMark({
  size = 28,
  color = colors.gold,
}: {
  size?: number;
  color?: ColorValue;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M5 3 L10 5 L25 23 L22 26 L7 8 Z M4 21 L11 28 M7 25 L4 29 M27 3 L22 5 L7 23 L10 26 L25 8 Z M21 28 L28 21 M25 25 L29 29" />
    </Svg>
  );
}
export function Screen({
  children,
  scroll = true,
  style,
  footer,
  keyboard = false,
  atmosphere = 'stage',
}: PropsWithChildren<{
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  footer?: ReactNode;
  keyboard?: boolean;
  atmosphere?: StageAtmosphere;
}>) {
  const { width } = useWindowDimensions();
  const paddingHorizontal = width < 360 ? spacing.lg : spacing.xl;
  return (
    <View style={styles.outer}>
      <View style={styles.stage}>
        <StageBackground atmosphere={atmosphere} />
        <KeyboardAvoidingView
          style={styles.safe}
          enabled={keyboard}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <SafeAreaView
            style={styles.safe}
            edges={footer ? ['top', 'left', 'right'] : ['top', 'bottom', 'left', 'right']}
          >
            {scroll ? (
              <ScrollView
                contentContainerStyle={[styles.content, { paddingHorizontal }, style]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
              >
                {children}
              </ScrollView>
            ) : (
              <View style={[styles.content, { flex: 1, paddingHorizontal }, style]}>
                {children}
              </View>
            )}
          </SafeAreaView>
          {footer && (
            <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.footer}>
              <View style={[styles.footerContent, { paddingHorizontal }]}>{footer}</View>
            </SafeAreaView>
          )}
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
export function Title({ children, small = false }: PropsWithChildren<{ small?: boolean }>) {
  return (
    <Text
      accessibilityRole="header"
      style={[styles.title, small && { fontSize: 24, lineHeight: 30 }]}
    >
      {children}
    </Text>
  );
}
export function Body({ children, gold = false }: PropsWithChildren<{ gold?: boolean }>) {
  return <Text style={[styles.body, gold && { color: colors.gold }]}>{children}</Text>;
}
export function Label({ children }: PropsWithChildren) {
  return <Text style={styles.label}>{children}</Text>;
}
export function Card({
  children,
  gold = false,
  style,
}: PropsWithChildren<{ gold?: boolean; style?: StyleProp<ViewStyle> }>) {
  return (
    <LinearGradient
      colors={gold ? ['#1c2c3b', '#102235'] : ['#13283b', '#102132']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, gold && { borderColor: colors.gold }, style]}
    >
      {children}
    </LinearGradient>
  );
}
export function Button({
  title,
  onPress,
  outline = false,
  disabled = false,
  loading = false,
  icon,
  quiet = false,
}: {
  title: string;
  onPress: () => void;
  outline?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: IconName;
  quiet?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        (outline || quiet) && { minHeight: 48 },
        outline && styles.outline,
        quiet && { backgroundColor: '#14253a' },
        disabled && { backgroundColor: '#17283b', borderWidth: 1, borderColor: colors.line },
        pressed && { opacity: 0.88 },
      ]}
    >
      {!outline && !quiet && !disabled && (
        <LinearGradient
          colors={['#f2ce8d', '#e3b467']}
          style={[StyleSheet.absoluteFill, { borderRadius: radius.button }]}
        />
      )}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            pointerEvents: 'none',
            borderRadius: radius.button,
            borderTopWidth: 1,
            borderTopColor: disabled || quiet ? '#afc4df10' : outline ? '#ffdda010' : '#fff4d83b',
          },
        ]}
      />
      {loading ? (
        <ActivityIndicator color={outline ? colors.gold : colors.background} />
      ) : (
        <>
          <Text
            style={[
              styles.buttonText,
              outline && { color: colors.gold },
              quiet && { color: colors.text },
              disabled && { color: colors.muted },
            ]}
          >
            {title}
          </Text>
          {icon && (
            <Icon
              name={icon}
              size={20}
              color={disabled || quiet ? colors.muted : outline ? colors.gold : colors.background}
            />
          )}
        </>
      )}
    </Pressable>
  );
}
export function Badge({
  icon,
  large = false,
  compact = false,
  duel = false,
}: {
  icon: IconName;
  large?: boolean;
  compact?: boolean;
  duel?: boolean;
}) {
  return (
    <LinearGradient
      colors={['#ffe0a0', '#a9782e']}
      style={[
        styles.badge,
        large && { width: 106, height: 106, borderRadius: 53 },
        compact && { width: 46, height: 46, borderRadius: 23, padding: 1.5 },
      ]}
    >
      <View style={[styles.badgeInner, large && { borderRadius: 50 }]}>
        {duel ? (
          <DuelMark size={large ? 50 : compact ? 25 : 32} />
        ) : (
          <Icon name={icon} size={large ? 50 : compact ? 24 : 30} />
        )}
      </View>
    </LinearGradient>
  );
}
export function ErrorNotice({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Card style={{ borderColor: colors.red, gap: 10 }}>
      <View style={layout.row}>
        <Icon name="alert-circle-outline" color={colors.red} size={24} />
        <View style={{ flex: 1 }}>
          <Label>Bu dəfə açılmadı</Label>
        </View>
      </View>
      <Text accessibilityRole="alert" style={styles.body}>
        {message}
      </Text>
      {onRetry && <Button title="Yenidən yoxla" onPress={onRetry} outline />}
    </Card>
  );
}
export function LoadingScreen({ message = 'Bir az gözlə…' }: { message?: string }) {
  return (
    <Screen scroll={false} style={{ justifyContent: 'center', alignItems: 'center', gap: 18 }}>
      <BrandMark size={126} />
      <Text style={{ color: colors.goldLight, fontSize: 34, fontWeight: '800' }}>Bilirsən?</Text>
      <Text style={{ color: colors.gold, fontSize: 10, letterSpacing: 2 }}>BİLİK SƏHNƏSİ</Text>
      <ActivityIndicator color={colors.gold} size="small" />
      <Body>{message}</Body>
    </Screen>
  );
}
export const layout = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  center: { alignItems: 'center', gap: 12 },
  muted: { color: colors.muted },
  gap: { gap: 16 },
});
const styles = StyleSheet.create({
  outer: { flex: 1, backgroundColor: '#030a12', alignItems: 'center' },
  stage: { flex: 1, width: '100%', maxWidth: 520, overflow: 'hidden' },
  safe: { flex: 1 },
  footer: { backgroundColor: '#081725', borderTopWidth: 1, borderColor: '#385f8a70' },
  footerContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, gap: 4 },
  content: { padding: 20, gap: 16, paddingBottom: 30 },
  title: { color: colors.text, ...typography.title },
  body: { color: colors.muted, ...typography.body },
  label: { color: colors.text, ...typography.label },
  card: {
    borderWidth: 1,
    borderColor: '#30495e',
    borderRadius: radius.card,
    padding: 16,
    gap: 12,
  },
  button: {
    minHeight: 52,
    borderRadius: radius.button,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  outline: { borderWidth: 1, borderColor: '#ae8b53' },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'center',
  },
  badge: { width: 60, height: 60, borderRadius: 30, padding: 2.5 },
  badgeInner: {
    flex: 1,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0b1a2b',
  },
});
