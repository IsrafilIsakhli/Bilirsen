import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import {
  Screen,
  Title,
  Body,
  Card,
  Badge,
  Button,
  Icon,
  Label,
  ErrorNotice,
  layout,
} from '../../components/studio';
import { SectionHeading } from '../../components/studio-elements';
import { useProfile } from '../../services/http/queries';
import { errorMessage } from '../../services/http/client';
import { RankStrip } from '../ranks/rank-strip';
import { colors } from '../../theme/tokens';
import { MatchupPreview } from './matchup-preview';
import { StagePanel } from '../../components/stage-panel';

export default function Duel() {
  const profile = useProfile();
  return (
    <Screen>
      <View style={{ gap: 8 }}>
        <Text style={styles.status}>CANLI DUEL · TEZLİKLƏ</Text>
        <Title>Duel studiyası</Title>
        <Body>Biliyini eyni səhnədə sına.</Body>
      </View>
      <StagePanel style={{ paddingVertical: 24 }}>
        <MatchupPreview name={profile.data?.displayName ?? 'Sən'} />
        <Text style={[styles.note, { textAlign: 'center' }]}>
          Canlı duel və dost otaqları hazırlanır.
        </Text>
      </StagePanel>
      {profile.error && (
        <ErrorNotice
          message={errorMessage(profile.error)}
          onRetry={() => {
            void profile.refetch();
          }}
        />
      )}
      {profile.data && <RankStrip rank={profile.data.duelRank} mode="duel" />}
      <SectionHeading title="Yarış seçimləri" />
      <Card style={{ gap: 16 }}>
        <View style={layout.row}>
          <Badge icon="people-outline" compact duel />
          <View style={{ flex: 1, gap: 4 }}>
            <Label>Ranklı duel</Label>
            <Text style={styles.note}>Sənə yaxın ranklı rəqiblə yarış</Text>
          </View>
        </View>
        <View style={styles.rules}>
          <Text style={styles.rule}>
            <Text style={{ color: colors.green, fontWeight: '700' }}>+25</Text> Qələbə
          </Text>
          <View style={styles.divider} />
          <Text style={styles.rule}>
            <Text style={{ color: colors.red, fontWeight: '700' }}>−25</Text> Məğlubiyyət
          </Text>
        </View>
        <Button title="Rəqib tap · tezliklə" disabled onPress={() => undefined} />
        <View style={{ height: 1, backgroundColor: colors.line, marginVertical: 4 }} />
        <View style={layout.row}>
          <Icon name="people-outline" size={26} color={colors.muted} />
          <View style={{ flex: 1, gap: 4 }}>
            <Label>Dostla oyna</Label>
            <Text style={styles.note}>Otaq kodu ilə qoşul · rank dəyişmir</Text>
          </View>
        </View>
        <View style={[layout.row, { gap: 8, alignItems: 'stretch' }]}>
          <View style={{ flex: 1 }}>
            <Button title="Otaq yarat" disabled quiet onPress={() => undefined} />
          </View>
          <View style={{ flex: 1 }}>
            <Button title="Kod daxil et" disabled quiet onPress={() => undefined} />
          </View>
        </View>
      </Card>
      <View style={[layout.row, { alignItems: 'flex-start', gap: 8 }]}>
        <Icon name="repeat-outline" size={18} color={colors.muted} />
        <Text style={[styles.note, { flex: 1 }]}>
          Bərabərlikdə əlavə 3 sual. Solo və duel rankları ayrıdır.
        </Text>
      </View>
      <Button title="Tək oyunda məşq et" quiet onPress={() => router.push('/solo-ready')} />
    </Screen>
  );
}
const styles = StyleSheet.create({
  status: {
    color: colors.gold,
    fontSize: 12,
    letterSpacing: 1.2,
    fontWeight: '600',
    lineHeight: 18,
  },
  note: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  rules: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: 8,
    paddingVertical: 12,
    flexWrap: 'wrap',
  },
  rule: { color: colors.muted, fontSize: 14, lineHeight: 22 },
  divider: { width: 1, height: 20, backgroundColor: colors.line },
});
