import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Crypto from 'expo-crypto';
import { useRef } from 'react';
import { gameSchema } from '@azquiz/contracts';
import { Screen, Title, Body, Button, ErrorNotice, layout, Icon } from '../../components/studio';
import { request, errorMessage } from '../../services/http/client';
import { keys, useProfile } from '../../services/http/queries';
import { RankStrip } from '../ranks/rank-strip';
import { Eyebrow, StudioNotice } from '../../components/studio-elements';
import { PageHeader } from '../../components/page-header';
import { colors } from '../../theme/tokens';
import { SceneBanner } from '../../components/stage-background';
export default function SoloReady() {
  const command = useRef(Crypto.randomUUID());
  const client = useQueryClient();
  const profile = useProfile();
  const start = useMutation({
    mutationFn: () =>
      request('/games/solo', gameSchema, { method: 'POST', body: { commandId: command.current } }),
    onSuccess: (game) => {
      client.setQueryData(keys.game(game.id), game);
      void client.invalidateQueries({ queryKey: keys.active });
      router.replace({ pathname: '/solo', params: { id: game.id } });
    },
  });
  return (
    <Screen
      atmosphere="quiet"
      footer={
        <Button title="Səhnəyə çıx" onPress={() => start.mutate()} loading={start.isPending} />
      }
    >
      <PageHeader title="Tək oyna" />
      <SceneBanner scene="foyer" style={{ minHeight: 188, gap: 6 }}>
        <Eyebrow>SƏHNƏYƏ HAZIRLIQ</Eyebrow>
        <Title>10 suallıq yarış</Title>
        <Body>Qarışıq mövzular, üç çətinlik.</Body>
      </SceneBanner>
      <View style={{ gap: 0 }}>
        <View style={[layout.between, { paddingBottom: 8 }]}>
          <Eyebrow>ÇƏTİNLİK</Eyebrow>
          <Eyebrow>VAXT / XAL</Eyebrow>
        </View>
        {[
          { title: '2 asan sual', seconds: 20, color: colors.green },
          { title: '5 orta sual', seconds: 25, color: colors.gold },
          { title: '3 çətin sual', seconds: 30, color: colors.red },
        ].map((row, index) => (
          <View
            key={row.title}
            style={{
              paddingVertical: 11,
              borderTopWidth: 1,
              borderColor: index ? colors.line : colors.brass,
            }}
          >
            <View style={[layout.between, { flexWrap: 'wrap', rowGap: 8 }]}>
              <View style={layout.row}>
                <View
                  style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: row.color }}
                />
                <Text style={{ color: row.color, fontSize: 16, fontWeight: '700' }}>
                  {row.title}
                </Text>
              </View>
              <View style={layout.row}>
                <Icon name="time-outline" size={18} color={row.color} />
                <Body>
                  {row.seconds} san · {row.seconds} xal
                </Body>
              </View>
            </View>
          </View>
        ))}
      </View>
      {profile.data && <RankStrip rank={profile.data.soloRank} mode="solo" />}
      {profile.error && (
        <ErrorNotice
          message={errorMessage(profile.error)}
          onRetry={() => {
            void profile.refetch();
          }}
        />
      )}
      <StudioNotice>
        Cavabsız sual: 0 rank xalı. Vaxt bitəndə növbəti suala keçilir. Mövzular qarışıq gələcək.
      </StudioNotice>
      {start.error && <ErrorNotice message={errorMessage(start.error)} />}
    </Screen>
  );
}
