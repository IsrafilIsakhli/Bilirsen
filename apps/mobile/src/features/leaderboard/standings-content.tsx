import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, Icon, Label, layout } from '../../components/studio';
import { AvatarMedallion, Eyebrow } from '../../components/studio-elements';
import { SegmentedControl } from '../../components/segmented-control';
import { colors, displayFamily } from '../../theme/tokens';
import { StagePanel } from '../../components/stage-panel';

export interface StandingDisplay {
  position: number;
  name: string;
  points: string;
  rankLabel: string;
}
export function StandingsContent({
  mode,
  onChange,
  players,
  self,
}: {
  mode: 'solo' | 'duel';
  onChange: (mode: 'solo' | 'duel') => void;
  players: readonly StandingDisplay[];
  self: StandingDisplay;
}) {
  const podium = players.slice(0, 3);
  const others = players.slice(3);
  return (
    <View style={{ gap: 20 }}>
      <SegmentedControl
        value={mode}
        onChange={onChange}
        items={[
          { value: 'solo', label: 'Solo' },
          { value: 'duel', label: 'Duel' },
        ]}
      />
      <StagePanel style={styles.selfPanel}>
        <View style={styles.selfCopy}>
          <Eyebrow>SƏNİN YERİN · NÜMUNƏ</Eyebrow>
          <Text style={styles.selfRank}>{self.rankLabel}</Text>
          <Text style={[styles.points, { textAlign: 'left' }]}>{self.points} rank xalı</Text>
        </View>
        <View style={styles.selfPlace}>
          <Text style={styles.selfNumber}>{self.position}</Text>
          <Eyebrow>YER</Eyebrow>
        </View>
      </StagePanel>
      <View style={layout.center}>
        <Text style={styles.title}>Studiyanın ən yaxşıları</Text>
      </View>
      <StagePanel style={{ padding: 16 }}>
        <View style={styles.podium}>
          {[podium[1], podium[0], podium[2]].map(
            (player) =>
              player && (
                <View key={player.position} style={styles.champion}>
                  {player.position === 1 && <Icon name="trophy-outline" size={24} />}
                  <AvatarMedallion name={player.name} size={player.position === 1 ? 66 : 52} />
                  <Text style={[styles.name, { textAlign: 'center', width: '100%' }]}>
                    {player.name}
                  </Text>
                  <Text style={styles.points}>{player.points} xal</Text>
                  <View
                    style={[
                      styles.step,
                      { height: player.position === 1 ? 86 : player.position === 2 ? 65 : 46 },
                    ]}
                  >
                    <LinearGradient
                      colors={
                        player.position === 1 ? ['#c19c5740', '#1a2a3d'] : ['#547b9f35', '#112337']
                      }
                      style={StyleSheet.absoluteFill}
                    />
                    <Text style={styles.position}>{player.position}</Text>
                  </View>
                </View>
              ),
          )}
        </View>
      </StagePanel>
      <View style={layout.between}>
        <Label>Oyunçular</Label>
        <Text style={styles.points}>Rank xalı</Text>
      </View>
      <Card style={{ gap: 0, paddingVertical: 0 }}>
        {others.map((player, index) => (
          <View
            key={player.position}
            style={{ paddingVertical: 12, borderTopWidth: index ? 1 : 0, borderColor: colors.line }}
          >
            <Standing player={player} />
          </View>
        ))}
      </Card>
      <Text style={[styles.points, { textAlign: 'center' }]}>
        Qonaq hesabları rəsmi siyahıda görünməyəcək.
      </Text>
    </View>
  );
}
function Standing({ player }: { player: StandingDisplay }) {
  return (
    <View style={[layout.row, { minHeight: 48, flexWrap: 'wrap', gap: 8 }]}>
      <Text style={styles.place}>{player.position}</Text>
      <AvatarMedallion name={player.name} size={34} />
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={styles.name}>{player.name}</Text>
        <Text style={[styles.points, { textAlign: 'left' }]}>{player.rankLabel}</Text>
      </View>
      <Text style={styles.total}>{player.points}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  selfPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    paddingVertical: 14,
  },
  selfCopy: { flex: 1, minWidth: 128, gap: 5 },
  selfPlace: { alignItems: 'center', minWidth: 68 },
  selfNumber: {
    color: colors.goldLight,
    fontSize: 49,
    lineHeight: 54,
    fontVariant: ['tabular-nums'],
    fontWeight: '600',
  },
  selfRank: { fontFamily: displayFamily, color: colors.text, fontSize: 22, fontWeight: '700' },
  title: {
    fontFamily: displayFamily,
    color: colors.text,
    fontSize: 27,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 33,
  },
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 9,
    paddingTop: 6,
  },
  champion: { flex: 1, minWidth: 0, alignItems: 'center', gap: 10 },
  name: { color: colors.text, fontSize: 13, fontWeight: '600' },
  points: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: 'center' },
  step: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#c29a5070',
    backgroundColor: '#26313c',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  position: { color: colors.gold, fontSize: 24, fontWeight: '700' },
  place: { width: 22, color: colors.muted, fontSize: 14 },
  total: {
    color: colors.goldLight,
    fontWeight: '600',
    fontSize: 14,
    fontVariant: ['tabular-nums'],
  },
});
