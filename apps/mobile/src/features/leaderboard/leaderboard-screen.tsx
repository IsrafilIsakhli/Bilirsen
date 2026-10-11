import { useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import {
  Screen,
  Title,
  Body,
  Card,
  Label,
  Badge,
  Button,
  ErrorNotice,
  layout,
} from '../../components/studio';
import { SectionHeading } from '../../components/studio-elements';
import { SegmentedControl } from '../../components/segmented-control';
import { useProfile } from '../../services/http/queries';
import { errorMessage } from '../../services/http/client';
import { RankStrip } from '../ranks/rank-strip';
import { colors } from '../../theme/tokens';

const modes = [
  { value: 'solo', label: 'Solo', accessibilityLabel: 'Solo reytinqi' },
  { value: 'duel', label: 'Duel', accessibilityLabel: 'Duel reytinqi' },
] as const;

export default function Leaderboard() {
  const [mode, setMode] = useState<'solo' | 'duel'>('solo');
  const profile = useProfile();
  const rank = mode === 'solo' ? profile.data?.soloRank : profile.data?.duelRank;
  return (
    <Screen atmosphere="quiet">
      <Title>Reytinq</Title>
      <Body>Solo və duel üçün iki ayrı sıralama.</Body>
      <SegmentedControl value={mode} items={modes} onChange={setMode} />

      {profile.error && (
        <ErrorNotice
          message={errorMessage(profile.error)}
          onRetry={() => {
            void profile.refetch();
          }}
        />
      )}
      {rank && (
        <>
          <SectionHeading title="Sənin şəxsi rankın" note="Qonaq hesabı" />
          <RankStrip rank={rank} mode={mode} />
        </>
      )}
      <Body>
        {mode === 'solo'
          ? 'Solo oynayaraq şəxsi rankını yüksəldə bilərsən.'
          : 'Duel rankı canlı yarış açıldıqdan sonra dəyişəcək.'}
      </Body>
      <Card>
        <View style={layout.row}>
          <Badge icon="lock-closed-outline" compact />
          <View style={{ flex: 1, gap: 5 }}>
            <Label>Rəsmi reytinq tezliklə</Label>
            <Text style={{ color: colors.muted, fontSize: 12 }}>Qeydiyyatlı oyunçular üçün</Text>
          </View>
        </View>
        <Body>
          Qonaq hesabları rəsmi sıralamada görünməyəcək. Sıralama və qeydiyyat növbəti mərhələdə
          açılacaq.
        </Body>
      </Card>
      <Button
        title={mode === 'solo' ? 'Solo yarışına başla' : 'Duel studiyasına keç'}
        onPress={() => router.push(mode === 'solo' ? '/solo-ready' : '/(tabs)/duel')}
      />
    </Screen>
  );
}
