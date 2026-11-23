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
import { Eyebrow, SectionHeading } from '../../components/studio-elements';
import { useProfile } from '../../services/http/queries';
import { errorMessage } from '../../services/http/client';
import { RankStrip } from '../ranks/rank-strip';
import { colors } from '../../theme/tokens';
import { MatchupPreview } from './matchup-preview';
import { SceneBanner } from '../../components/stage-background';

export default function Duel() {
  const profile = useProfile();
  return (
    <Screen atmosphere="duel">
      <View style={{ gap: 8 }}>
        <Text style={styles.status}>CANLI DUEL · TEZLİKLƏ</Text>
        <Title>Duel studiyası</Title>
        <Body>Biliyini eyni səhnədə sına.</Body>
      </View>
      <SceneBanner scene="duel" style={{ minHeight: 224, gap: 12, paddingTop: 32 }}>
        <MatchupPreview name={profile.data?.displayName ?? 'Sən'} />
        <Text style={[styles.note, { textAlign: 'center' }]}>
          Canlı duel və dost otaqları hazırlanır.
        </Text>
      </SceneBanner>
      {profile.error && (
        <ErrorNotice
          message={errorMessage(profile.error)}
          onRetry={() => {
            void profile.refetch();
          }}
        />
      )}
      {profile.data && <RankStrip rank={profile.data.duelRank} mode="duel" />}
      <SectionHeading title="Bir səhnə. İki yarışçı." />
      <Card style={{ gap: 18, backgroundColor: '#0c1a30', borderColor: colors.brass, padding: 20 }}>
        <View style={layout.row}>
          <Badge icon="people-outline" compact duel />
          <View style={{ flex: 1, gap: 4 }}>
            <Label>Ranklı duel</Label>
            <Text style={styles.note}>Sənə yaxın ranklı rəqiblə eyni suallara cavab ver.</Text>
          </View>
        </View>
        <View style={styles.rules}>
          <View style={styles.outcome}>
            <Text style={[styles.rankDelta, { color: colors.green }]}>+25</Text>
            <Text style={styles.rule}>Qələbə</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.outcome}>
            <Text style={[styles.rankDelta, { color: colors.red }]}>−25</Text>
            <Text style={styles.rule}>Məğlubiyyət</Text>
          </View>
        </View>
        <Button title="Rəqib tap · tezliklə" disabled onPress={() => undefined} />
      </Card>
      <View style={styles.friendRoom}>
        <View style={[layout.row, { alignItems: 'flex-start' }]}>
          <Icon name="people-outline" size={26} color={colors.muted} />
          <View style={{ flex: 1, gap: 4 }}>
            <Label>Dostla oyna</Label>
            <Text style={styles.note}>Otaq kodu ilə qoşul. Rank dəyişmir.</Text>
            <Eyebrow>TEZLİKLƏ</Eyebrow>
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
      </View>
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
  note: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  friendRoom: { paddingVertical: 16, borderBottomWidth: 1, borderColor: colors.line, gap: 16 },
  outcome: { flex: 1, minWidth: 94, alignItems: 'center', gap: 3 },
  rankDelta: { fontSize: 32, lineHeight: 38, fontWeight: '600', fontVariant: ['tabular-nums'] },
  rules: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: 8,
    paddingVertical: 12,
    flexWrap: 'wrap',
  },
  rule: { color: colors.muted, fontSize: 14, lineHeight: 22 },
  divider: { width: 1, height: 42, backgroundColor: colors.line },
});
