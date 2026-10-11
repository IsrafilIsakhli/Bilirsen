import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon, Body, Button, Card, Label } from '../../components/studio';
import { Eyebrow, StudioNotice } from '../../components/studio-elements';
import { StudioFormField } from '../../components/studio-form-field';
import { colors } from '../../theme/tokens';

export type AccountView = 'login' | 'register' | 'recovery' | 'verification' | 'conversion';
export const accountTitles: Record<AccountView, string> = {
  login: 'Giriş',
  register: 'Qeydiyyat',
  recovery: 'Şifrə bərpası',
  verification: 'E-poçt təsdiqi',
  conversion: 'Hesab yarat',
};
const content: Record<
  AccountView,
  {
    icon: 'book-outline' | 'lock-closed-outline' | 'mail-outline';
    title: string;
    description: string;
    action: string;
  }
> = {
  login: {
    icon: 'book-outline',
    title: 'Yenidən xoş gəldin.',
    description: 'Yoluna qaldığın yerdən davam et.',
    action: 'Daxil ol',
  },
  register: {
    icon: 'book-outline',
    title: 'Səhnəyə öz adınla çıx.',
    description: 'Bilik yolunda ilk addımını at.',
    action: 'Hesab yarat',
  },
  recovery: {
    icon: 'lock-closed-outline',
    title: 'Şifrəni yenilə.',
    description: 'Hesabına bağlı e-poçtu yaz. Şifrəni yeniləmək üçün bağlantı göndərək.',
    action: 'Bərpa bağlantısı göndər',
  },
  verification: {
    icon: 'mail-outline',
    title: 'E-poçtunu təsdiqlə.',
    description: 'Təsdiq bağlantısı üçün e-poçtunu yoxla.',
    action: 'Təsdiqi yoxla',
  },
  conversion: {
    icon: 'book-outline',
    title: 'Nəticələrini hesabına bağla.',
    description: 'Hesab yarat və növbəti yarışa öz adınla çıx.',
    action: 'Hesab yarat',
  },
};

// Forms are presentation-ready; submission stays disabled until account services exist.
// Entered credentials remain local to this mounted screen and are never persisted.
export function AccountContent({
  view,
  onNavigate,
}: {
  view: AccountView;
  onNavigate: (view: AccountView) => void;
}) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const copy = content[view];
  const form = view === 'login' || view === 'register' || view === 'recovery';
  return (
    <View style={{ gap: 16 }}>
      <View style={styles.hero}>
        <Icon name={copy.icon} color={colors.muted} size={28} />
        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.description}>{copy.description}</Text>
      </View>
      {form && (
        <View style={{ gap: 16 }}>
          {view === 'register' && (
            <StudioFormField
              label="İstifadəçi adı"
              placeholder="Səhnədəki adın"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoComplete="username"
              textContentType="username"
            />
          )}
          <StudioFormField
            label="E-poçt ünvanı"
            placeholder="adın@poçt.az"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
          />
          {view !== 'recovery' && (
            <StudioFormField
              label="Şifrə"
              placeholder="Şifrən"
              value={password}
              onChangeText={setPassword}
              secure
              autoCapitalize="none"
              autoComplete={view === 'register' ? 'new-password' : 'current-password'}
              textContentType={view === 'register' ? 'newPassword' : 'password'}
            />
          )}
          {view === 'register' && (
            <StudioFormField
              label="Şifrəni təkrar yaz"
              placeholder="Eyni şifrəni yaz"
              value={confirmation}
              onChangeText={setConfirmation}
              secure
              autoCapitalize="none"
              autoComplete="new-password"
              textContentType="newPassword"
            />
          )}
          {view === 'login' && (
            <AccountLink title="Şifrəni unutdun?" onPress={() => onNavigate('recovery')} />
          )}
        </View>
      )}
      {view === 'verification' && (
        <Card style={{ gap: 10 }}>
          <Eyebrow>E-POÇT ÜNVANI</Eyebrow>
          <Label>Qeydiyyatdan sonra göstəriləcək</Label>
          <Body>Məktubu görmürsənsə, spam qovluğuna da bax.</Body>
        </Card>
      )}
      {view === 'conversion' && (
        <Card>
          <Label>Öz profilinlə davam et</Label>
          <Body>
            Hesaba keçid və qonaq nəticələrinin saxlanması qeydiyyat xidməti ilə birlikdə açılacaq.
          </Body>
        </Card>
      )}
      <StudioNotice>
        Qeydiyyat və hesab xidmətləri hələ açılmayıb. Hazırda qonaq kimi oynaya bilərsən.
      </StudioNotice>
      {view === 'conversion' ? (
        <Button title="Qeydiyyata keç" onPress={() => onNavigate('register')} />
      ) : (
        <Button title={copy.action + ' · tezliklə'} disabled onPress={() => undefined} />
      )}
      {view === 'verification' && (
        <Button title="Yenidən göndər · tezliklə" disabled outline onPress={() => undefined} />
      )}
      {view === 'login' ? (
        <AccountLink title="Qeydiyyat ekranına keç" onPress={() => onNavigate('register')} />
      ) : (
        view !== 'conversion' && (
          <AccountLink title="Girişə qayıt" onPress={() => onNavigate('login')} />
        )
      )}
    </View>
  );
}
function AccountLink({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={styles.link}
    >
      <Text style={styles.linkText}>{title}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  hero: { alignItems: 'flex-start', gap: 12, paddingTop: 8, paddingBottom: 12 },
  title: {
    color: colors.text,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '600',
    maxWidth: 320,
    letterSpacing: -0.7,
  },
  description: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 300,
  },
  link: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  linkText: { color: colors.goldLight, fontSize: 14, lineHeight: 22, textAlign: 'center' },
});
