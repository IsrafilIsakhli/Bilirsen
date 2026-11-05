import { View, Switch, Text } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Screen, Body, Card, Label, Button, ErrorNotice, layout } from '../../components/studio';
import { Eyebrow, SectionHeading } from '../../components/studio-elements';
import { PageHeader } from '../../components/page-header';
import { useSounds } from '../../services/audio/sound-provider';
import { colors } from '../../theme/tokens';
import { ActionRow } from '../../components/action-row';

export default function Settings() {
  const sounds = useSounds();
  useFocusEffect(useCallback(() => () => sounds.stop(), [sounds.stop]));
  return (
    <Screen atmosphere="quiet">
      <PageHeader title="Tənzimləmələr" />
      <Eyebrow>SƏS PULTU</Eyebrow>
      <View
        style={{
          gap: 14,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: colors.brass,
          paddingVertical: 14,
        }}
      >
        <View style={layout.between}>
          <View style={{ flex: 1 }}>
            <Label>Yarış səsləri</Label>
            <Body>Saniyə və cavab siqnalları</Body>
          </View>
          <Switch
            accessibilityLabel="Yarış səsləri"
            value={sounds.preferences.enabled}
            onValueChange={(enabled) => sounds.update({ enabled })}
            trackColor={{ true: colors.gold, false: colors.line }}
            thumbColor={colors.text}
          />
        </View>
        <View style={{ height: 1, backgroundColor: colors.line }} />
        <View style={layout.between}>
          <View style={{ flex: 1 }}>
            <Label>Saniyə səsi</Label>
            <Body>Vaxt azaldıqca sıxlaşan tik–tak</Body>
          </View>
          <Switch
            accessibilityLabel="Saniyə səsi"
            value={sounds.preferences.timerEnabled}
            disabled={!sounds.preferences.enabled}
            onValueChange={(timerEnabled) => sounds.update({ timerEnabled })}
            trackColor={{ true: colors.gold, false: colors.line }}
            thumbColor={colors.text}
          />
        </View>
      </View>
      <SectionHeading title="Səsləri yoxla" note="3 studiya siqnalı" />
      <View style={{ gap: 0, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line }}>
        <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 19, paddingVertical: 12 }}>
          Fon sual boyunca çalınır. Cavab vurğusu seçim təsdiqlənəndə eşidilir.
        </Text>
        <ActionRow
          title="Saniyə səsini dinlə"
          description="20 / 25 / 30 saniyəlik fon · ritm sona yaxın sıxlaşır"
          disabled={!sounds.preferences.enabled || !sounds.preferences.timerEnabled}
          onPress={() => sounds.play('tick')}
          icon="time-outline"
          trailing="play-outline"
        />
        <ActionRow
          title="Düzgün cavab səsini dinlə"
          description="Qısa müsbət studiya vurğusu"
          divided
          disabled={!sounds.preferences.enabled}
          onPress={() => sounds.play('correct')}
          icon="checkmark-circle-outline"
          trailing="play-outline"
        />
        <ActionRow
          title="Səhv cavab səsini dinlə"
          description="Qısa, aşağı enən studiya vurğusu"
          divided
          disabled={!sounds.preferences.enabled}
          onPress={() => sounds.play('wrong')}
          icon="close-circle-outline"
          trailing="play-outline"
        />
      </View>
      <Button title="Dinləməni dayandır" outline icon="stop-outline" onPress={sounds.stop} />
      {sounds.error && <ErrorNotice message={sounds.error} />}
      <Body>
        Səslər yarış üçün ayrıca hazırlanıb. Səs səviyyəsini telefonundakı düymələrlə dəyişə
        bilərsən.
      </Body>
      {__DEV__ && (
        <Card>
          <Eyebrow>SON DİZAYN BAXIŞI</Eyebrow>
          <Label>Bütün yeni ekranlar telefonda</Label>
          <Body>19 ekranın görünüşünə və keçidlərinə burada baxa bilərsən.</Body>
          <Button
            title="Bütün dizayn ekranlarına bax"
            onPress={() => router.push('/studio-preview')}
            outline
          />
        </Card>
      )}
    </Screen>
  );
}
