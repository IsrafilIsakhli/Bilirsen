import { Text, View, StyleSheet } from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';
import type { Rank } from '@azquiz/contracts';
import { Card, Icon, layout } from '../../components/studio';
import { Eyebrow } from '../../components/studio-elements';
import { RankCrest } from '../../components/rank-crest';
import { colors } from '../../theme/tokens';

const reveal = FadeIn.duration(220).reduceMotion(ReduceMotion.System);

export function RankPromotion({ previous, current }: { previous: Rank; current: Rank }) {
  return (
    <Animated.View entering={reveal}>
      <Card gold style={{ padding: 18, gap: 12 }}>
        <View style={layout.row}>
          <RankCrest name={current.name} size={76} />
          <View style={{ flex: 1, gap: 7 }}>
            <Eyebrow>YENİ PİLLƏ</Eyebrow>
            <Text style={styles.title}>Bilik yolunda irəli!</Text>
            <Text style={styles.rank}>
              {current.name} {current.division}
            </Text>
          </View>
        </View>
        <View style={styles.transition}>
          <Text style={styles.previous}>
            {previous.name} {previous.division}
          </Text>
          <Icon name="arrow-forward" size={15} />
          <Text style={styles.next}>
            {current.name} {current.division}
          </Text>
        </View>
      </Card>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 19, fontWeight: '700' },
  rank: { color: colors.goldLight, fontSize: 16, fontWeight: '600' },
  transition: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#efbf6933',
  },
  previous: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#101e2b',
    borderRadius: 6,
  },
  next: {
    color: colors.gold,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#efbf6910',
    borderRadius: 6,
  },
});
