import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { Icon } from './studio';
import { colors } from '../theme/tokens';

type FieldProps = Pick<
  TextInputProps,
  'value' | 'onChangeText' | 'keyboardType' | 'autoComplete' | 'textContentType' | 'autoCapitalize'
> & {
  label: string;
  placeholder?: string;
  secure?: boolean;
  error?: string;
};
export function StudioFormField({
  label,
  placeholder,
  secure = false,
  error,
  ...input
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.field,
          focused && { borderColor: colors.gold },
          error && { borderColor: colors.red },
        ]}
      >
        <TextInput
          {...input}
          accessibilityLabel={label}
          placeholder={placeholder}
          placeholderTextColor="#7d97b2"
          secureTextEntry={secure && !visible}
          autoCorrect={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={styles.input}
        />
        {secure && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Şifrəni gizlət' : 'Şifrəni göstər'}
            onPress={() => setVisible(!visible)}
            style={styles.eye}
          >
            <Icon
              name={visible ? 'eye-off-outline' : 'eye-outline'}
              size={21}
              color={colors.muted}
            />
          </Pressable>
        )}
      </View>
      {error && (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  group: { gap: 8 },
  label: { color: colors.text, fontSize: 13, fontWeight: '500' },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 54,
    backgroundColor: '#0b1d30',
    borderWidth: 1,
    borderColor: '#35516c',
    borderRadius: 12,
  },
  input: {
    flex: 1,
    minWidth: 0,
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  eye: { width: 48, minHeight: 52, alignItems: 'center', justifyContent: 'center' },
  error: { color: colors.red, fontSize: 12, lineHeight: 18 },
});
