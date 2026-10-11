import { View, Text } from 'react-native';
import type { Rank } from '@azquiz/contracts';
import { Badge, Card, Label, layout } from '../../components/studio';
import { Progress } from './rank-card';
import { rankIcon } from './rank-presentation';
import { colors } from '../../theme/tokens';

export function RankStrip({ rank, mode }: { rank: Rank; mode: 'solo' | 'duel' }) {
  return (
    <Card style={{ padding: 16, gap: 12 }}>
      <View style={[layout.row, { flexWrap: 'wrap' }]}>
        <Badge compact icon={rankIcon(rank.name)} />
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ color: colors.muted, fontSize: 12 }}>
            {mode === 'solo' ? 'Solo' : 'Duel'} rankı
          </Text>
          <Label>
            {rank.name} {rank.division}
          </Label>
        </View>
        <Text style={{ color: colors.goldLight, fontSize: 18, fontWeight: '700' }}>
          {rank.points}
          <Text style={{ color: colors.muted, fontSize: 12 }}> xal</Text>
        </Text>
      </View>
      <Progress rank={rank} />
      <View style={[layout.between, { flexWrap: 'wrap', rowGap: 4 }]}>
        <Text style={{ color: colors.muted, fontSize: 12 }}>
          {rank.progress} / {rank.span}
        </Text>
        <Text style={{ color: colors.muted, fontSize: 12 }}>
          {rank.nextAt === null ? 'Son pillə' : `Növbəti pilləyə ${rank.nextAt - rank.points} xal`}
        </Text>
      </View>
    </Card>
  );
}
