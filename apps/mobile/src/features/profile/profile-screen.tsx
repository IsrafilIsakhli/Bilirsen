import { View } from 'react-native';
import { router } from 'expo-router';
import {
  Screen,
  Title,
  Card,
  LoadingScreen,
  ErrorNotice,
  Button,
  layout,
} from '../../components/studio';
import {
  AvatarMedallion,
  Eyebrow,
  SectionHeading,
  StudioNotice,
} from '../../components/studio-elements';
import { RankCard } from '../ranks/rank-card';
import { useProfile } from '../../services/http/queries';
import { errorMessage } from '../../services/http/client';
import { PerformanceSummary } from './performance-summary';
import { ActionRow } from '../../components/action-row';

export default function Profile() {
  const profile = useProfile();
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
  return (
    <Screen atmosphere="quiet">
      <Title>Profil</Title>
      <View style={[layout.row, { gap: 16, paddingVertical: 9 }]}>
        <AvatarMedallion name={me.displayName} size={72} />
        <View style={{ flex: 1, gap: 8 }}>
          <Title small>{me.displayName}</Title>
          <View
            style={{
              alignSelf: 'flex-start',
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 5,
              backgroundColor: '#efbf6910',
            }}
          >
            <Eyebrow>QONAQ HESABI</Eyebrow>
          </View>
        </View>
      </View>
      <SectionHeading title="Bilik pillələrin" note="İki ayrı rank" />
      <View style={[layout.row, { alignItems: 'stretch', gap: 10 }]}>
        <RankCard mode="solo" rank={me.soloRank} />
        <RankCard mode="duel" rank={me.duelRank} />
      </View>
      <PerformanceSummary
        correct={me.correctAnswers}
        answered={me.answeredQuestions}
        rounds={me.completedGames}
      />
      <SectionHeading title="Hesab" />
      <Card style={{ padding: 0, gap: 0, overflow: 'hidden' }}>
        <ActionRow
          title="Oyun tarixçəsi"
          description="Son yarışların və nəticələrin"
          icon="reader-outline"
          onPress={() => router.push('/history')}
        />
        <ActionRow
          title="Tənzimləmələr"
          description="Studiyanın səs ayarları"
          icon="options-outline"
          divided
          onPress={() => router.push('/settings')}
        />
      </Card>
      <StudioNotice>
        Qonaq nəticələrin bu hesabda saxlanır. Rəsmi reytinq üçün qeydiyyat növbəti mərhələdə
        açılacaq.
      </StudioNotice>
      <Button
        title="Hesab yarat · tezliklə"
        outline
        onPress={() => router.push({ pathname: '/account', params: { view: 'conversion' } })}
      />
    </Screen>
  );
}
