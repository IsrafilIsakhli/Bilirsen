import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  Screen,
  Title,
  Body,
  Label,
  Card,
  Icon,
  LoadingScreen,
  ErrorNotice,
  layout,
} from '../../components/studio';
import { PageHeader } from '../../components/page-header';
import { Eyebrow, SectionHeading, StudioNotice } from '../../components/studio-elements';
import { useProfile } from '../../services/http/queries';
import { errorMessage } from '../../services/http/client';
import { Progress } from './rank-card';
import { rankTiers } from './rank-presentation';
import { colors } from '../../theme/tokens';
import { RankCrest } from '../../components/rank-crest';
import { StagePanel } from '../../components/stage-panel';

export default function RankDetails() {
  const { mode } = useLocalSearchParams<{ mode: string }>();
  const duel = mode === 'duel';
  const profile = useProfile();
  if (profile.isPending) return <LoadingScreen />;
  if (!profile.data)
    return (
      <Screen atmosphere="quiet">
        <ErrorNotice
          message={errorMessage(profile.error)}
          onRetry={() => {
            void profile.refetch();
          }}
        />
      </Screen>
    );
  const rank = duel ? profile.data.duelRank : profile.data.soloRank;
  const tierIndex = rankTiers.findIndex((tier) => tier.name === rank.name);
  return (
    <Screen atmosphere="quiet">
      <PageHeader title={duel ? 'Duel rankı' : 'Solo rankı'} />
      <StagePanel>
        <View style={[layout.row, { gap: 16 }]}>
          <RankCrest name={rank.name} size={80} />
          <View style={{ flex: 1, gap: 8 }}>
            <Eyebrow>BİLİK YOLUN</Eyebrow>
            <Title>
              {rank.name} {rank.division}
            </Title>
            <Body>{rank.points} rank xalı</Body>
          </View>
        </View>
      </StagePanel>
      <View style={{ gap: 8, paddingHorizontal: 8 }}>
        <Progress rank={rank} />
        <Text style={{ color: colors.muted, fontSize: 12, textAlign: 'center' }}>
          {rank.progress} / {rank.span} · Cari pillənin irəliləyişi
        </Text>
      </View>
      <SectionHeading title="Bilik pillələri" note="III → II → I" />
      <View style={{ gap: 8 }}>
        {rankTiers.map((tier, index) => {
          const current = tier.name === rank.name;
          const reached = tierIndex >= 0 && index < tierIndex;
          return (
            <View key={tier.name} style={[layout.row, { gap: 9 }]}>
              <View
                style={{
                  width: 14,
                  alignSelf: 'stretch',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    width: 1,
                    top: index === 0 ? '50%' : 0,
                    bottom: index === rankTiers.length - 1 ? '50%' : 0,
                    backgroundColor: reached || current ? '#c29a50' : colors.line,
                  }}
                />
                <View
                  style={{
                    width: current ? 13 : 8,
                    height: current ? 13 : 8,
                    borderRadius: 7,
                    backgroundColor: reached || current ? colors.gold : '#446382',
                    borderWidth: current ? 2 : 0,
                    borderColor: colors.goldLight,
                  }}
                />
              </View>
              <Card
                gold={current}
                style={{ flex: 1, padding: 12, borderRadius: 13, borderWidth: current ? 1 : 0 }}
              >
                <View style={[layout.row, { alignItems: 'flex-start' }]}>
                  <Icon
                    name={tier.icon}
                    color={current || reached ? colors.gold : colors.muted}
                    size={23}
                  />
                  <View style={{ flex: 1, gap: 3 }}>
                    <Label>{tier.name}</Label>
                    <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 18 }}>
                      {tier.caption}
                    </Text>
                    <Text
                      style={{
                        color: current ? colors.gold : colors.muted,
                        fontSize: 12,
                        marginTop: 4,
                      }}
                    >
                      {current ? 'Sən burada' : reached ? 'Keçildi' : 'İrəlidə'}
                    </Text>
                  </View>
                </View>
              </Card>
            </View>
          );
        })}
      </View>
      <Card gold>
        <Label>{duel ? 'Duelin nəticəsinə görə' : 'Solo rank qaydaları'}</Label>
        {duel ? (
          <View style={layout.row}>
            <View style={{ flex: 1, alignItems: 'center', gap: 4 }}>
              <Icon name="trophy-outline" />
              <Label>+25</Label>
              <Body>Qələbə</Body>
            </View>
            <View style={{ flex: 1, alignItems: 'center', gap: 4 }}>
              <Icon name="close-circle-outline" color={colors.red} />
              <Label>−25</Label>
              <Body>Məğlubiyyət</Body>
            </View>
          </View>
        ) : (
          <View style={[layout.row, { gap: 0 }]}>
            {[
              { name: 'Asan', rule: '+5 / −3', color: colors.green },
              { name: 'Orta', rule: '+8 / −4', color: colors.gold },
              { name: 'Çətin', rule: '+12 / −5', color: colors.red },
            ].map((item, index) => (
              <View
                key={item.name}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  gap: 8,
                  borderLeftWidth: index ? 1 : 0,
                  borderColor: colors.line,
                }}
              >
                <Text style={{ color: item.color, fontSize: 12 }}>{item.name}</Text>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 14,
                    fontWeight: '700',
                    textAlign: 'center',
                  }}
                >
                  {item.rule}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Card>
      <StudioNotice>
        {duel
          ? 'Dost dueli ranka təsir etmir. Canlı duel növbəti mərhələdə açılacaq.'
          : 'Cavabsız sual: 0. Rank dəyişiklikləri turun sonunda birlikdə hesablanır.'}
      </StudioNotice>
    </Screen>
  );
}
