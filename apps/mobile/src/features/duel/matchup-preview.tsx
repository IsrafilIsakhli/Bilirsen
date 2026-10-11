import { View, Text, StyleSheet } from 'react-native';
import { AvatarMedallion } from '../../components/studio-elements';
import { Icon } from '../../components/studio';
import { colors } from '../../theme/tokens';

export function MatchupPreview({ name }: { name: string }) {
  return (
    <View style={styles.stage}>
      <View style={styles.player}>
        <AvatarMedallion name={name} size={54} />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.caption}>Sənin yerin</Text>
      </View>
      <View style={styles.bridge}>
        <View style={styles.line} />
        <View style={styles.diamond}>
          <Text style={styles.versus}>VS</Text>
        </View>
        <View style={styles.line} />
      </View>
      <View style={styles.player}>
        <View style={styles.opponent}>
          <Icon name="person-outline" size={31} color={colors.muted} />
        </View>
        <Text style={styles.name}>Rəqib</Text>
        <Text style={styles.caption}>Tezliklə</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  stage: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  player: { flex: 1, alignItems: 'center', gap: 8, minWidth: 0 },
  name: { color: colors.text, fontSize: 15, fontWeight: '700', textAlign: 'center', maxWidth: 120 },
  caption: { color: colors.muted, fontSize: 12 },
  opponent: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: colors.blue,
    backgroundColor: '#102337',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bridge: { flexDirection: 'row', alignItems: 'center', width: 60, gap: 8, marginBottom: 24 },
  line: { flex: 1, height: 1, backgroundColor: '#b8955355' },
  diamond: {
    width: 39,
    height: 39,
    alignItems: 'center',
    justifyContent: 'center',
  },
  versus: {
    color: colors.goldLight,
    fontSize: 13,
    fontWeight: '600',
  },
});
