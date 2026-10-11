import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Crypto from 'expo-crypto';
import { useRef } from 'react';
import { gameSchema } from '@azquiz/contracts';
import {
  Screen,
  Title,
  Body,
  Card,
  Button,
  ErrorNotice,
  layout,
  Icon,
} from '../../components/studio';
import { request, errorMessage } from '../../services/http/client';
import { keys, useProfile } from '../../services/http/queries';
import { RankStrip } from '../ranks/rank-strip';
import { StudioNotice } from '../../components/studio-elements';
import { PageHeader } from '../../components/page-header';
import { colors } from '../../theme/tokens';
import { RankCrest } from '../../components/rank-crest';
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
      footer={
        <Button title="Səhnəyə çıx" onPress={() => start.mutate()} loading={start.isPending} />
      }
    >
      <PageHeader title="Tək oyna" />
      <View style={[layout.row, { marginTop: 4, marginBottom: 8 }]}>
        <RankCrest name={profile.data?.soloRank.name ?? 'Şagird'} size={72} />
        <View style={{ flex: 1, gap: 6 }}>
          <Title small>10 suallıq yarış</Title>
          <Body>Qarışıq mövzular, üç çətinlik.</Body>
        </View>
      </View>
      <Card style={{ paddingVertical: 0, gap: 0 }}>
        {[
          { title: '2 asan sual', seconds: 20, color: colors.green },
          { title: '5 orta sual', seconds: 25, color: colors.gold },
          { title: '3 çətin sual', seconds: 30, color: colors.red },
        ].map((row, index) => (
          <View
            key={row.title}
            style={{ paddingVertical: 14, borderTopWidth: index ? 1 : 0, borderColor: colors.line }}
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
      </Card>
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
