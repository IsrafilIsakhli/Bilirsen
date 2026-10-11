import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { AvatarMedallion, Eyebrow } from '../../components/studio-elements';
import {
  Screen,
  Title,
  Body,
  Label,
  Card,
  Button,
  Icon,
  ErrorNotice,
  LoadingScreen,
  layout,
} from '../../components/studio';
import { useProfile, useHistory, useActiveGame } from '../../services/http/queries';
import { errorMessage } from '../../services/http/client';
import { RankCard } from '../../features/ranks/rank-card';
import { colors } from '../../theme/tokens';
import { StagePanel } from '../../components/stage-panel';
export default function Home() {
  const profile = useProfile();
  const history = useHistory();
  const active = useActiveGame();
  if (profile.isPending) return <LoadingScreen />;
  if (!profile.data)
    return (
      <Screen>
        <ErrorNotice
          message={errorMessage(profile.error)}
          onRetry={() => {
            void profile.refetch();
          }}
        />
      </Screen>
    );
  const me = profile.data;
  const last = history.data?.[0];
  return (
    <Screen style={{ gap: 20 }}>
      <View style={layout.between}>
        <View style={[layout.row, { flex: 1 }]}>
          <AvatarMedallion name={me.displayName} />
          <View style={{ flex: 1 }}>
            <Body>Salam,</Body>
            <Label>{me.displayName}</Label>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
          <Text style={styles.brand}>Bilirsən?</Text>
        </View>
      </View>
      <View style={{ gap: 6 }}>
        <Title>Yarışa hazırsan?</Title>
      </View>
      <StagePanel>
        <View style={[layout.between, { alignItems: 'flex-start' }]}>
          <View style={{ flex: 1, gap: 8 }}>
            <Eyebrow>TƏK OYUN</Eyebrow>
            <Text style={styles.soloTitle}>
              {active.data ? 'Yarışın davam edir.' : 'Səhnə sənindir.'}
            </Text>
            <Body>10 sual · qarışıq mövzular</Body>
          </View>
          <View style={styles.soloMark}>
            <Icon name="book-outline" size={27} />
          </View>
        </View>
        <Button
          title={active.data ? 'Yarışa davam et' : 'Oyuna başla'}
          onPress={() =>
            active.data
              ? router.push({ pathname: '/solo', params: { id: active.data.id } })
              : router.push('/solo-ready')
          }
        />
      </StagePanel>
      <View style={[layout.row, { alignItems: 'stretch', gap: 10 }]}>
        <RankCard compact mode="solo" rank={me.soloRank} />
        <RankCard compact mode="duel" rank={me.duelRank} />
      </View>
      <Card style={{ gap: 16, borderWidth: 0 }}>
        <View style={layout.row}>
          <Icon name="people-outline" color={colors.muted} size={26} />
          <View style={{ flex: 1 }}>
            <Title small>Duel</Title>
            <Body>Eyni suallar, iki rəqib</Body>
          </View>
        </View>
        <View style={{ width: '100%' }}>
          <Button title="Duel studiyası" outline onPress={() => router.push('/(tabs)/duel')} />
        </View>
      </Card>
      {last ? (
        <Pressable
          onPress={() => router.push({ pathname: '/solo', params: { id: last.id } })}
          accessibilityRole="button"
        >
          <View style={styles.latest}>
            <View style={layout.row}>
              <Icon name="reader-outline" size={22} color={colors.muted} />
              <View style={{ flex: 1 }}>
                <Label>Son nəticə</Label>
                <Body>
                  Solo · {last.result.correct}/{last.result.totalQuestions} düzgün ·{' '}
                  {last.result.score} xal
                </Body>
                <Text
                  style={{
                    color: last.result.actualDelta < 0 ? colors.red : colors.green,
                    fontSize: 12,
                    lineHeight: 20,
                  }}
                >
                  Solo rankı: {last.result.actualDelta >= 0 ? '+' : ''}
                  {last.result.actualDelta}
                </Text>
              </View>
              <Icon name="chevron-forward" color={colors.muted} />
            </View>
          </View>
        </Pressable>
      ) : (
        <View style={styles.latest}>
          <View style={layout.row}>
            <Icon name="reader-outline" />
            <Body>İlk yarışın səni gözləyir.</Body>
          </View>
        </View>
      )}
      {active.error && (
        <ErrorNotice
          message={errorMessage(active.error)}
          onRetry={() => {
            void active.refetch();
          }}
        />
      )}
      {history.error && (
        <ErrorNotice
          message={errorMessage(history.error)}
          onRetry={() => {
            void history.refetch();
          }}
        />
      )}
    </Screen>
  );
}
const styles = StyleSheet.create({
  brand: { color: colors.goldLight, fontWeight: '700', fontSize: 19 },
  soloTitle: {
    color: colors.text,
    fontSize: 27,
    lineHeight: 34,
    letterSpacing: -0.5,
    fontWeight: '600',
  },
  soloMark: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#efbf6910',
  },
  latest: { paddingVertical: 14, borderTopWidth: 1, borderColor: colors.line, minHeight: 64 },
});
